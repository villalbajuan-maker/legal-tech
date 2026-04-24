create or replace function public.priority_rank(priority_value text)
returns integer
language sql
immutable
as $$
  select case coalesce(priority_value, 'normal')
    when 'low' then 1
    when 'normal' then 2
    when 'high' then 3
    when 'critical' then 4
    else 2
  end;
$$;

create or replace function public.priority_from_rank(priority_rank integer)
returns text
language sql
immutable
as $$
  select case greatest(1, least(coalesce(priority_rank, 2), 4))
    when 1 then 'low'
    when 2 then 'normal'
    when 3 then 'high'
    else 'critical'
  end;
$$;

create or replace function public.recalculate_organization_case_derived_fields(target_organization_id uuid)
returns table (
  updated_count integer,
  default_assigned_count integer,
  elevated_attention_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  rules_record public.organization_operational_rules%rowtype;
  validated_default_membership_id uuid;
  configured_default_membership_id uuid;
  upcoming_event_window_days integer := 3;
  final_resolution_mode text := 'max_manual_and_calculated';
  raise_if_unassigned_with_change boolean := true;
begin
  if auth.role() <> 'service_role' and not public.has_organization_admin_access(target_organization_id) then
    raise exception 'You do not have access to this organization';
  end if;

  select *
  into rules_record
  from public.organization_operational_rules
  where organization_id = target_organization_id;

  if not found then
    insert into public.organization_operational_rules (organization_id)
    values (target_organization_id)
    returning * into rules_record;
  end if;

  configured_default_membership_id :=
    nullif(rules_record.assignment_rules ->> 'default_membership_id', '')::uuid;

  if configured_default_membership_id is not null then
    select membership.id
    into validated_default_membership_id
    from public.organization_memberships as membership
    where membership.id = configured_default_membership_id
      and membership.organization_id = target_organization_id
      and membership.status = 'active'
    limit 1;
  end if;

  upcoming_event_window_days :=
    greatest(coalesce(nullif(rules_record.attention_rules ->> 'upcoming_event_window_days', '')::integer, 3), 1);

  final_resolution_mode :=
    coalesce(nullif(rules_record.priority_rules ->> 'final_resolution', ''), 'max_manual_and_calculated');

  raise_if_unassigned_with_change :=
    coalesce(nullif(rules_record.priority_rules ->> 'raise_if_unassigned_with_change', '')::boolean, true);

  return query
  with case_metrics as (
    select
      legal_case.id,
      legal_case.priority_manual,
      legal_case.responsible_membership_id as current_responsible_membership_id,
      legal_case.assignment_origin as current_assignment_origin,
      exists (
        select 1
        from public.case_sources as case_source
        where case_source.case_id = legal_case.id
          and case_source.status in ('error', 'blocked')
      ) as has_source_issue,
      exists (
        select 1
        from public.case_sources as case_source
        where case_source.case_id = legal_case.id
          and case_source.status = 'not_found'
      ) as has_not_found,
      exists (
        select 1
        from public.alerts as alert
        where alert.case_id = legal_case.id
          and alert.status in ('pending', 'sent')
          and alert.alert_type = 'manual_review'
      ) as requires_manual_review,
      exists (
        select 1
        from public.alerts as alert
        where alert.case_id = legal_case.id
          and alert.status in ('pending', 'sent')
          and alert.severity in ('high', 'critical')
      ) as has_high_alert,
      exists (
        select 1
        from public.legal_events as legal_event
        where legal_event.case_id = legal_case.id
          and legal_event.status = 'active'
          and legal_event.change_status in ('new', 'changed')
      ) as has_fresh_event,
      exists (
        select 1
        from public.legal_events as legal_event
        where legal_event.case_id = legal_case.id
          and legal_event.status = 'active'
          and legal_event.event_type in ('audiencia', 'termino', 'vencimiento')
          and legal_event.event_date <= now() + make_interval(days => upcoming_event_window_days)
      ) as has_upcoming_event,
      exists (
        select 1
        from public.legal_events as legal_event
        where legal_event.case_id = legal_case.id
          and legal_event.status = 'active'
          and legal_event.event_type in ('audiencia', 'termino', 'vencimiento')
          and legal_event.event_date <= now() + interval '48 hours'
      ) as has_critical_event
    from public.cases as legal_case
    where legal_case.organization_id = target_organization_id
  ),
  derived as (
    select
      metrics.id,
      case
        when metrics.has_critical_event then 'critical'
        when metrics.has_source_issue
          or metrics.requires_manual_review
          or metrics.has_upcoming_event
          or metrics.has_high_alert
          or (raise_if_unassigned_with_change and metrics.has_fresh_event and metrics.current_responsible_membership_id is null)
          then 'high'
        when metrics.has_fresh_event or metrics.has_not_found then 'normal'
        else 'low'
      end as next_priority_calculated,
      case
        when metrics.current_responsible_membership_id is not null then metrics.current_responsible_membership_id
        when validated_default_membership_id is not null then validated_default_membership_id
        else null
      end as next_responsible_membership_id,
      case
        when metrics.current_responsible_membership_id is not null then coalesce(nullif(metrics.current_assignment_origin, 'unassigned'), 'manual')
        when validated_default_membership_id is not null then 'default'
        else 'unassigned'
      end as next_assignment_origin,
      metrics.current_responsible_membership_id is null and validated_default_membership_id is not null as default_assignment_applied,
      metrics.has_source_issue,
      metrics.requires_manual_review,
      metrics.has_upcoming_event,
      metrics.has_fresh_event,
      metrics.has_critical_event
    from case_metrics as metrics
  ),
  finalized as (
    select
      derived.id,
      derived.next_priority_calculated,
      case
        when final_resolution_mode = 'manual_only' then current_case.priority_manual
        else public.priority_from_rank(
          greatest(
            public.priority_rank(current_case.priority_manual),
            public.priority_rank(derived.next_priority_calculated)
          )
        )
      end as next_priority_final,
      case
        when (
          case
            when final_resolution_mode = 'manual_only' then current_case.priority_manual
            else public.priority_from_rank(
              greatest(
                public.priority_rank(current_case.priority_manual),
                public.priority_rank(derived.next_priority_calculated)
              )
            )
          end
        ) = 'critical' then 'interrupcion'
        when derived.has_source_issue
          or derived.requires_manual_review
          or (
            case
              when final_resolution_mode = 'manual_only' then current_case.priority_manual
              else public.priority_from_rank(
                greatest(
                  public.priority_rank(current_case.priority_manual),
                  public.priority_rank(derived.next_priority_calculated)
                )
              )
            end
          ) = 'high' then 'atencion_elevada'
        when derived.has_upcoming_event
          or derived.has_fresh_event
          or derived.next_priority_calculated = 'normal' then 'atencion_visible'
        else 'silencio_operativo'
      end as next_attention_level,
      derived.next_responsible_membership_id,
      derived.next_assignment_origin,
      derived.default_assignment_applied
    from derived
    join public.cases as current_case on current_case.id = derived.id
  ),
  updated as (
    update public.cases as legal_case
    set
      priority_calculated = finalized.next_priority_calculated,
      priority_final = finalized.next_priority_final,
      attention_level = finalized.next_attention_level,
      responsible_membership_id = finalized.next_responsible_membership_id,
      assignment_origin = finalized.next_assignment_origin,
      updated_at = now()
    from finalized
    where legal_case.id = finalized.id
    returning
      finalized.default_assignment_applied as default_assignment_applied,
      finalized.next_attention_level in ('atencion_elevada', 'interrupcion') as elevated_attention
  )
  select
    count(*)::integer as updated_count,
    count(*) filter (where default_assignment_applied)::integer as default_assigned_count,
    count(*) filter (where elevated_attention)::integer as elevated_attention_count
  from updated;
end;
$$;

grant execute on function public.recalculate_organization_case_derived_fields(uuid) to authenticated;
