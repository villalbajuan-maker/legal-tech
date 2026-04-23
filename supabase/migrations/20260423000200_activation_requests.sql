create table public.activation_requests (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'landing_modal',
  request_status text not null default 'new',
  qualification_status text not null,
  profile_type text not null,
  case_band text not null,
  review_methods jsonb not null default '[]'::jsonb,
  operational_risks jsonb not null default '[]'::jsonb,
  has_assigned_owners text not null,
  urgency_level text not null,
  sample_readiness text not null,
  decision_window text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  company_name text,
  city text,
  calendar_url text,
  calendar_presented_at timestamptz,
  activated_organization_id uuid references public.organizations(id) on delete set null,
  activated_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activation_requests_request_status_check
    check (request_status in ('new', 'qualified', 'sent_to_calendar', 'deferred', 'activated', 'rejected')),
  constraint activation_requests_qualification_status_check
    check (qualification_status in ('qualified', 'deferred'))
);

create table public.activation_request_answers (
  id uuid primary key default gen_random_uuid(),
  activation_request_id uuid not null references public.activation_requests(id) on delete cascade,
  question_key text not null,
  question_label text not null,
  answer_value text,
  answer_values jsonb,
  selection_mode text not null,
  step_index integer not null,
  created_at timestamptz not null default now(),
  constraint activation_request_answers_selection_mode_check
    check (selection_mode in ('single', 'multiple', 'form'))
);

create table public.activation_request_events (
  id uuid primary key default gen_random_uuid(),
  activation_request_id uuid not null references public.activation_requests(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index activation_requests_created_at_idx
  on public.activation_requests (created_at desc);

create index activation_requests_contact_email_idx
  on public.activation_requests (contact_email);

create index activation_requests_request_status_idx
  on public.activation_requests (request_status);

create index activation_request_answers_request_step_idx
  on public.activation_request_answers (activation_request_id, step_index);

create index activation_request_events_request_created_idx
  on public.activation_request_events (activation_request_id, created_at desc);

create trigger set_activation_requests_updated_at
before update on public.activation_requests
for each row
execute function public.set_updated_at();

alter table public.activation_requests enable row level security;
alter table public.activation_request_answers enable row level security;
alter table public.activation_request_events enable row level security;

create policy "Platform admins can read activation requests"
  on public.activation_requests for select
  to authenticated
  using (public.is_platform_admin());

create policy "Platform admins can manage activation requests"
  on public.activation_requests for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "Platform admins can read activation request answers"
  on public.activation_request_answers for select
  to authenticated
  using (public.is_platform_admin());

create policy "Platform admins can manage activation request answers"
  on public.activation_request_answers for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "Platform admins can read activation request events"
  on public.activation_request_events for select
  to authenticated
  using (public.is_platform_admin());

create policy "Platform admins can manage activation request events"
  on public.activation_request_events for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create or replace function public.submit_activation_request(payload jsonb)
returns table (
  request_id uuid,
  qualification_status text,
  request_status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  created_request_id uuid;
  computed_qualification_status text;
  computed_request_status text;
begin
  if coalesce(trim(payload ->> 'profile_type'), '') = '' then
    raise exception 'profile_type is required';
  end if;

  if coalesce(trim(payload ->> 'case_band'), '') = '' then
    raise exception 'case_band is required';
  end if;

  if coalesce(trim(payload ->> 'contact_name'), '') = '' then
    raise exception 'contact_name is required';
  end if;

  if coalesce(trim(payload ->> 'contact_email'), '') = '' then
    raise exception 'contact_email is required';
  end if;

  if coalesce(trim(payload ->> 'contact_phone'), '') = '' then
    raise exception 'contact_phone is required';
  end if;

  computed_qualification_status :=
    case
      when coalesce((payload ->> 'qualified_for_scheduling')::boolean, false) then 'qualified'
      else 'deferred'
    end;

  computed_request_status :=
    case
      when computed_qualification_status = 'qualified' then 'qualified'
      else 'deferred'
    end;

  insert into public.activation_requests (
    source,
    request_status,
    qualification_status,
    profile_type,
    case_band,
    review_methods,
    operational_risks,
    has_assigned_owners,
    urgency_level,
    sample_readiness,
    decision_window,
    contact_name,
    contact_email,
    contact_phone,
    company_name,
    city,
    calendar_url
  )
  values (
    coalesce(nullif(payload ->> 'source', ''), 'landing_modal'),
    computed_request_status,
    computed_qualification_status,
    payload ->> 'profile_type',
    payload ->> 'case_band',
    coalesce(payload -> 'review_methods', '[]'::jsonb),
    coalesce(payload -> 'operational_risks', '[]'::jsonb),
    payload ->> 'has_assigned_owners',
    payload ->> 'urgency_level',
    payload ->> 'sample_readiness',
    payload ->> 'decision_window',
    payload ->> 'contact_name',
    lower(payload ->> 'contact_email'),
    payload ->> 'contact_phone',
    nullif(payload ->> 'company_name', ''),
    nullif(payload ->> 'city', ''),
    nullif(payload ->> 'calendar_url', '')
  )
  returning id into created_request_id;

  insert into public.activation_request_answers (
    activation_request_id,
    question_key,
    question_label,
    answer_value,
    answer_values,
    selection_mode,
    step_index
  )
  values
    (created_request_id, 'profile_type', '¿Qué tipo de operación quieres activar?', payload ->> 'profile_type', null, 'single', 2),
    (created_request_id, 'case_band', '¿Cuántos procesos vigilas hoy?', payload ->> 'case_band', null, 'single', 3),
    (created_request_id, 'review_methods', '¿Cómo revisan hoy las novedades?', null, coalesce(payload -> 'review_methods', '[]'::jsonb), 'multiple', 4),
    (created_request_id, 'operational_risks', '¿Qué riesgos pueden estar ocurriendo hoy?', null, coalesce(payload -> 'operational_risks', '[]'::jsonb), 'multiple', 5),
    (created_request_id, 'has_assigned_owners', '¿Tienen responsables asignados por proceso?', payload ->> 'has_assigned_owners', null, 'single', 6),
    (created_request_id, 'urgency_level', '¿Qué tan urgente es ordenar esta vigilancia?', payload ->> 'urgency_level', null, 'single', 7),
    (created_request_id, 'sample_readiness', '¿Tienes una muestra inicial de procesos para probar?', payload ->> 'sample_readiness', null, 'single', 8),
    (created_request_id, 'decision_window', '¿Cuándo tendría sentido activar la demo?', payload ->> 'decision_window', null, 'single', 9),
    (
      created_request_id,
      'contact',
      'Datos de contacto',
      null,
      jsonb_build_object(
        'name', payload ->> 'contact_name',
        'email', lower(payload ->> 'contact_email'),
        'phone', payload ->> 'contact_phone',
        'company_name', nullif(payload ->> 'company_name', ''),
        'city', nullif(payload ->> 'city', '')
      ),
      'form',
      10
    );

  insert into public.activation_request_events (
    activation_request_id,
    event_type,
    payload
  )
  values
    (
      created_request_id,
      'request_submitted',
      jsonb_build_object(
        'source', coalesce(nullif(payload ->> 'source', ''), 'landing_modal'),
        'qualified_for_scheduling', coalesce((payload ->> 'qualified_for_scheduling')::boolean, false)
      )
    ),
    (
      created_request_id,
      case when computed_qualification_status = 'qualified' then 'qualified' else 'deferred' end,
      jsonb_build_object(
        'qualification_status', computed_qualification_status,
        'request_status', computed_request_status
      )
    );

  return query
  select created_request_id, computed_qualification_status, computed_request_status;
end;
$$;

create or replace function public.mark_activation_request_calendar_presented(
  target_request_id uuid,
  presented_calendar_url text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.activation_requests
  set
    request_status = case
      when request_status in ('new', 'qualified') then 'sent_to_calendar'
      else request_status
    end,
    calendar_url = coalesce(presented_calendar_url, calendar_url),
    calendar_presented_at = now(),
    updated_at = now()
  where id = target_request_id;

  insert into public.activation_request_events (
    activation_request_id,
    event_type,
    payload
  )
  values (
    target_request_id,
    'calendar_presented',
    jsonb_build_object(
      'calendar_url', presented_calendar_url
    )
  );
end;
$$;

grant execute on function public.submit_activation_request(jsonb) to anon, authenticated;
grant execute on function public.mark_activation_request_calendar_presented(uuid, text) to anon, authenticated;
