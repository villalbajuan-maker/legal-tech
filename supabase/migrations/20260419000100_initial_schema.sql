create extension if not exists "pgcrypto";

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  client_type text not null default 'individual',
  email text,
  phone text,
  notification_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint clients_client_type_check check (client_type in ('individual', 'firm', 'company', 'insurer'))
);

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  radicado text not null,
  normalized_radicado text not null,
  court text,
  jurisdiction text,
  city text,
  department text,
  process_type text,
  parties jsonb not null default '{}'::jsonb,
  internal_owner text,
  status text not null default 'active',
  priority text not null default 'normal',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cases_status_check check (status in ('active', 'paused', 'closed')),
  constraint cases_priority_check check (priority in ('low', 'normal', 'high', 'critical')),
  constraint cases_unique_radicado unique (organization_id, normalized_radicado)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  source_type text not null default 'public',
  base_url text,
  access_mode text not null default 'http',
  has_captcha boolean not null default false,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  constraint sources_source_type_check check (source_type in ('public', 'private', 'manual')),
  constraint sources_access_mode_check check (access_mode in ('http', 'browser', 'manual', 'api'))
);

create table public.case_sources (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete restrict,
  external_reference text,
  last_checked_at timestamptz,
  last_success_at timestamptz,
  last_error_at timestamptz,
  status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint case_sources_status_check check (status in ('pending', 'active', 'paused', 'error', 'blocked', 'not_found')),
  constraint case_sources_unique_source unique (case_id, source_id)
);

create table public.source_snapshots (
  id uuid primary key default gen_random_uuid(),
  case_source_id uuid not null references public.case_sources(id) on delete cascade,
  fetched_at timestamptz not null default now(),
  fetch_status text not null,
  raw_hash text,
  raw_payload jsonb,
  raw_html_path text,
  error_message text,
  duration_ms integer,
  constraint source_snapshots_fetch_status_check check (fetch_status in ('success', 'error', 'blocked', 'not_found'))
);

create table public.case_movements (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete restrict,
  snapshot_id uuid references public.source_snapshots(id) on delete set null,
  external_id text,
  movement_date date,
  title text not null,
  description text,
  movement_type text,
  normalized_hash text not null,
  metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  constraint case_movements_unique_hash unique (case_id, source_id, normalized_hash)
);

create table public.legal_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  source_id uuid references public.sources(id) on delete set null,
  movement_id uuid references public.case_movements(id) on delete set null,
  event_type text not null,
  event_date timestamptz not null,
  end_date timestamptz,
  title text not null,
  description text,
  confidence numeric not null default 1,
  status text not null default 'active',
  change_status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint legal_events_event_type_check check (event_type in ('audiencia', 'termino', 'vencimiento', 'actuacion', 'otro')),
  constraint legal_events_status_check check (status in ('active', 'cancelled', 'completed', 'superseded')),
  constraint legal_events_change_status_check check (change_status in ('new', 'unchanged', 'changed', 'cancelled'))
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  case_id uuid not null references public.cases(id) on delete cascade,
  legal_event_id uuid references public.legal_events(id) on delete set null,
  alert_type text not null,
  severity text not null,
  title text not null,
  message text not null,
  status text not null default 'pending',
  due_at timestamptz,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  acknowledged_at timestamptz,
  constraint alerts_alert_type_check check (alert_type in ('new_event', 'event_changed', 'event_upcoming', 'source_error', 'manual_review')),
  constraint alerts_severity_check check (severity in ('low', 'medium', 'high', 'critical')),
  constraint alerts_status_check check (status in ('pending', 'sent', 'acknowledged', 'dismissed', 'failed'))
);

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references public.alerts(id) on delete cascade,
  channel text not null,
  recipient text not null,
  provider text,
  provider_message_id text,
  status text not null default 'pending',
  error_message text,
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notification_deliveries_channel_check check (channel in ('email', 'whatsapp', 'internal')),
  constraint notification_deliveries_status_check check (status in ('pending', 'sent', 'delivered', 'failed'))
);

create index clients_organization_id_idx on public.clients (organization_id);
create index cases_client_id_idx on public.cases (client_id);
create index cases_status_idx on public.cases (status);
create index case_sources_status_idx on public.case_sources (status);
create index case_sources_last_checked_at_idx on public.case_sources (last_checked_at);
create index source_snapshots_case_source_fetched_idx on public.source_snapshots (case_source_id, fetched_at desc);
create index source_snapshots_raw_hash_idx on public.source_snapshots (raw_hash);
create index case_movements_case_date_idx on public.case_movements (case_id, movement_date desc);
create index legal_events_case_date_idx on public.legal_events (case_id, event_date);
create index legal_events_event_date_idx on public.legal_events (event_date);
create index legal_events_status_idx on public.legal_events (status);
create index alerts_status_due_idx on public.alerts (status, due_at);
create index alerts_case_id_idx on public.alerts (case_id);
create index alerts_client_id_idx on public.alerts (client_id);

alter table public.organizations enable row level security;
alter table public.clients enable row level security;
alter table public.cases enable row level security;
alter table public.sources enable row level security;
alter table public.case_sources enable row level security;
alter table public.source_snapshots enable row level security;
alter table public.case_movements enable row level security;
alter table public.legal_events enable row level security;
alter table public.alerts enable row level security;
alter table public.notification_deliveries enable row level security;

create policy "Authenticated users can read organizations"
  on public.organizations for select
  to authenticated
  using (true);

create policy "Authenticated users can read clients"
  on public.clients for select
  to authenticated
  using (true);

create policy "Authenticated users can read cases"
  on public.cases for select
  to authenticated
  using (true);

create policy "Authenticated users can read sources"
  on public.sources for select
  to authenticated
  using (true);

create policy "Authenticated users can read case sources"
  on public.case_sources for select
  to authenticated
  using (true);

create policy "Authenticated users can read source snapshots"
  on public.source_snapshots for select
  to authenticated
  using (true);

create policy "Authenticated users can read case movements"
  on public.case_movements for select
  to authenticated
  using (true);

create policy "Authenticated users can read legal events"
  on public.legal_events for select
  to authenticated
  using (true);

create policy "Authenticated users can read alerts"
  on public.alerts for select
  to authenticated
  using (true);

create policy "Authenticated users can read notification deliveries"
  on public.notification_deliveries for select
  to authenticated
  using (true);

insert into public.sources (name, source_type, access_mode, notes)
values
  ('Rama Judicial', 'public', 'http', 'Fuente publica prioritaria para el piloto'),
  ('SAMAI', 'public', 'browser', 'Requiere validacion tecnica por jurisdiccion'),
  ('Manual', 'manual', 'manual', 'Fallback para eventos registrados por el operador')
on conflict (name) do nothing;
