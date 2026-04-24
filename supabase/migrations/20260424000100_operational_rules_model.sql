create table public.organization_operational_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  consultation_rules jsonb not null default jsonb_build_object(
    'critical_frequency', 'hourly',
    'high_frequency', 'every_4_hours',
    'point_query_enabled', true,
    'source_protection_mode', 'balanced'
  ),
  priority_rules jsonb not null default jsonb_build_object(
    'final_resolution', 'max_manual_and_calculated',
    'event_proximity_factor', 'audiencia_o_termino_cercano',
    'raise_if_unassigned_with_change', true
  ),
  attention_rules jsonb not null default jsonb_build_object(
    'stable_cases_mode', 'keep_silent',
    'bandeja_elevation_mode', 'source_error_and_review',
    'upcoming_event_window_days', 3
  ),
  assignment_rules jsonb not null default jsonb_build_object(
    'default_membership_id', null,
    'unassigned_behavior', 'visible_and_raise_if_changed',
    'highlight_uncovered_cases', true
  ),
  notification_rules jsonb not null default jsonb_build_object(
    'base_channel', 'email',
    'summary_frequency', 'daily',
    'interrupt_threshold', 'high'
  ),
  escalation_rules jsonb not null default jsonb_build_object(
    'persistent_failure_threshold', 2,
    'upcoming_event_window_hours', 48,
    'raise_if_critical_without_owner', true
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_operational_rules_unique_org unique (organization_id),
  constraint organization_operational_rules_consultation_rules_object_check check (jsonb_typeof(consultation_rules) = 'object'),
  constraint organization_operational_rules_priority_rules_object_check check (jsonb_typeof(priority_rules) = 'object'),
  constraint organization_operational_rules_attention_rules_object_check check (jsonb_typeof(attention_rules) = 'object'),
  constraint organization_operational_rules_assignment_rules_object_check check (jsonb_typeof(assignment_rules) = 'object'),
  constraint organization_operational_rules_notification_rules_object_check check (jsonb_typeof(notification_rules) = 'object'),
  constraint organization_operational_rules_escalation_rules_object_check check (jsonb_typeof(escalation_rules) = 'object')
);

create trigger set_organization_operational_rules_updated_at
before update on public.organization_operational_rules
for each row
execute function public.set_updated_at();

alter table public.cases
add column if not exists priority_manual text not null default 'normal',
add column if not exists priority_calculated text not null default 'normal',
add column if not exists priority_final text not null default 'normal',
add column if not exists attention_level text not null default 'silencio_operativo',
add column if not exists responsible_membership_id uuid references public.organization_memberships(id) on delete set null,
add column if not exists assignment_origin text not null default 'unassigned';

alter table public.cases
drop constraint if exists cases_priority_manual_check;

alter table public.cases
add constraint cases_priority_manual_check
check (priority_manual in ('low', 'normal', 'high', 'critical'));

alter table public.cases
drop constraint if exists cases_priority_calculated_check;

alter table public.cases
add constraint cases_priority_calculated_check
check (priority_calculated in ('low', 'normal', 'high', 'critical'));

alter table public.cases
drop constraint if exists cases_priority_final_check;

alter table public.cases
add constraint cases_priority_final_check
check (priority_final in ('low', 'normal', 'high', 'critical'));

alter table public.cases
drop constraint if exists cases_attention_level_check;

alter table public.cases
add constraint cases_attention_level_check
check (attention_level in ('silencio_operativo', 'atencion_visible', 'atencion_elevada', 'interrupcion'));

alter table public.cases
drop constraint if exists cases_assignment_origin_check;

alter table public.cases
add constraint cases_assignment_origin_check
check (assignment_origin in ('manual', 'rule', 'default', 'unassigned'));

create index if not exists organization_operational_rules_organization_id_idx
  on public.organization_operational_rules (organization_id);

create index if not exists cases_priority_final_idx
  on public.cases (organization_id, priority_final);

create index if not exists cases_attention_level_idx
  on public.cases (organization_id, attention_level);

create index if not exists cases_responsible_membership_id_idx
  on public.cases (responsible_membership_id);

update public.cases
set
  priority_manual = coalesce(priority_manual, priority, 'normal'),
  priority_calculated = coalesce(priority_calculated, priority, 'normal'),
  priority_final = coalesce(priority_final, priority, 'normal'),
  attention_level = coalesce(attention_level, 'silencio_operativo'),
  assignment_origin = case
    when responsible_membership_id is not null then coalesce(assignment_origin, 'manual')
    when internal_owner is not null and btrim(internal_owner) <> '' then coalesce(nullif(assignment_origin, 'unassigned'), 'manual')
    else 'unassigned'
  end;

insert into public.organization_operational_rules (organization_id)
select organization.id
from public.organizations as organization
left join public.organization_operational_rules as rules
  on rules.organization_id = organization.id
where rules.id is null;

create or replace function public.handle_new_organization_operational_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.organization_operational_rules (organization_id)
  values (new.id)
  on conflict (organization_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_organization_created_set_operational_rules on public.organizations;

create trigger on_organization_created_set_operational_rules
after insert on public.organizations
for each row
execute function public.handle_new_organization_operational_rules();

alter table public.organization_operational_rules enable row level security;

create policy "Members can read organization operational rules"
  on public.organization_operational_rules for select
  to authenticated
  using (public.has_organization_access(organization_id));

create policy "Admins can manage organization operational rules"
  on public.organization_operational_rules for all
  to authenticated
  using (public.has_organization_admin_access(organization_id))
  with check (public.has_organization_admin_access(organization_id));
