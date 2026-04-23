create or replace function public.submit_case_intake(
  target_organization_id uuid,
  entries jsonb
)
returns table (
  inserted_count integer,
  duplicate_count integer,
  invalid_count integer,
  inserted_radicados jsonb,
  duplicate_radicados jsonb,
  invalid_radicados jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
  intake_entry jsonb;
  normalized_radicado_value text;
  raw_radicado text;
  cpnu_source_id uuid;
  created_case_id uuid;
  next_priority text;
  next_owner text;
  next_notes text;
  inserted_items text[] := array[]::text[];
  duplicate_items text[] := array[]::text[];
  invalid_items text[] := array[]::text[];
begin
  if not public.has_organization_access(target_organization_id) then
    raise exception 'You do not have access to this organization';
  end if;

  if jsonb_typeof(entries) <> 'array' then
    raise exception 'entries must be a json array';
  end if;

  select source_record.id
  into cpnu_source_id
  from public.sources as source_record
  where source_record.name = 'CPNU'
  limit 1;

  if cpnu_source_id is null then
    raise exception 'CPNU source is not configured';
  end if;

  for intake_entry in
    select value
    from jsonb_array_elements(entries)
  loop
    raw_radicado := coalesce(intake_entry ->> 'radicado', '');
    normalized_radicado_value := regexp_replace(raw_radicado, '\D', '', 'g');

    if normalized_radicado_value = '' or length(normalized_radicado_value) < 20 or length(normalized_radicado_value) > 30 then
      invalid_items := array_append(invalid_items, raw_radicado);
      continue;
    end if;

    if exists (
      select 1
      from public.cases as legal_case
      where legal_case.organization_id = target_organization_id
        and legal_case.normalized_radicado = normalized_radicado_value
    ) then
      duplicate_items := array_append(duplicate_items, normalized_radicado_value);
      continue;
    end if;

    next_priority := coalesce(nullif(lower(intake_entry ->> 'priority'), ''), 'normal');
    if next_priority not in ('low', 'normal', 'high', 'critical') then
      next_priority := 'normal';
    end if;

    next_owner := nullif(trim(coalesce(intake_entry ->> 'owner', '')), '');
    next_notes := nullif(trim(coalesce(intake_entry ->> 'notes', '')), '');

    insert into public.cases (
      organization_id,
      radicado,
      normalized_radicado,
      internal_owner,
      priority,
      status,
      notes
    )
    values (
      target_organization_id,
      normalized_radicado_value,
      normalized_radicado_value,
      next_owner,
      next_priority,
      'active',
      next_notes
    )
    returning id into created_case_id;

    insert into public.case_sources (
      case_id,
      source_id,
      status,
      metadata
    )
    values (
      created_case_id,
      cpnu_source_id,
      'pending',
      jsonb_build_object(
        'auto_created', true,
        'source_seed', 'bloque_2_case_intake'
      )
    )
    on conflict (case_id, source_id) do nothing;

    inserted_items := array_append(inserted_items, normalized_radicado_value);
  end loop;

  return query
  select
    coalesce(array_length(inserted_items, 1), 0),
    coalesce(array_length(duplicate_items, 1), 0),
    coalesce(array_length(invalid_items, 1), 0),
    to_jsonb(inserted_items),
    to_jsonb(duplicate_items),
    to_jsonb(invalid_items);
end;
$$;
