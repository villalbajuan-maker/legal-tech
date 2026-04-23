create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'operator',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_memberships_role_check
    check (role in ('platform_admin', 'account_admin', 'operator')),
  constraint organization_memberships_status_check
    check (status in ('active', 'invited', 'disabled')),
  constraint organization_memberships_unique_user_org unique (organization_id, user_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_organization_memberships_updated_at
before update on public.organization_memberships
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.user_id = auth.uid()
      and membership.status = 'active'
      and membership.role = 'platform_admin'
  );
$$;

create or replace function public.has_organization_access(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.organization_memberships membership
      where membership.user_id = auth.uid()
        and membership.organization_id = target_organization_id
        and membership.status = 'active'
    );
$$;

create or replace function public.has_organization_admin_access(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_platform_admin()
    or exists (
      select 1
      from public.organization_memberships membership
      where membership.user_id = auth.uid()
        and membership.organization_id = target_organization_id
        and membership.status = 'active'
        and membership.role in ('platform_admin', 'account_admin')
    );
$$;

alter table public.profiles enable row level security;
alter table public.organization_memberships enable row level security;

drop policy if exists "Authenticated users can read organizations" on public.organizations;
drop policy if exists "Authenticated users can read clients" on public.clients;
drop policy if exists "Authenticated users can read cases" on public.cases;
drop policy if exists "Authenticated users can read sources" on public.sources;
drop policy if exists "Authenticated users can read case sources" on public.case_sources;
drop policy if exists "Authenticated users can read source snapshots" on public.source_snapshots;
drop policy if exists "Authenticated users can read case movements" on public.case_movements;
drop policy if exists "Authenticated users can read legal events" on public.legal_events;
drop policy if exists "Authenticated users can read alerts" on public.alerts;
drop policy if exists "Authenticated users can read notification deliveries" on public.notification_deliveries;

create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_platform_admin());

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_platform_admin())
  with check (id = auth.uid() or public.is_platform_admin());

create policy "Users can read own memberships"
  on public.organization_memberships for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.is_platform_admin()
    or public.has_organization_admin_access(organization_id)
  );

create policy "Platform admins can manage memberships"
  on public.organization_memberships for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "Members can read organizations"
  on public.organizations for select
  to authenticated
  using (public.has_organization_access(id));

create policy "Admins can update organizations"
  on public.organizations for update
  to authenticated
  using (public.has_organization_admin_access(id))
  with check (public.has_organization_admin_access(id));

create policy "Platform admins can insert organizations"
  on public.organizations for insert
  to authenticated
  with check (public.is_platform_admin());

create policy "Members can read clients"
  on public.clients for select
  to authenticated
  using (public.has_organization_access(organization_id));

create policy "Members can manage clients"
  on public.clients for all
  to authenticated
  using (public.has_organization_access(organization_id))
  with check (public.has_organization_access(organization_id));

create policy "Members can read cases"
  on public.cases for select
  to authenticated
  using (public.has_organization_access(organization_id));

create policy "Members can manage cases"
  on public.cases for all
  to authenticated
  using (public.has_organization_access(organization_id))
  with check (public.has_organization_access(organization_id));

create policy "Authenticated users can read sources"
  on public.sources for select
  to authenticated
  using (true);

create policy "Platform admins can manage sources"
  on public.sources for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "Members can read case sources"
  on public.case_sources for select
  to authenticated
  using (
    exists (
      select 1
      from public.cases legal_case
      where legal_case.id = case_sources.case_id
        and public.has_organization_access(legal_case.organization_id)
    )
  );

create policy "Members can manage case sources"
  on public.case_sources for all
  to authenticated
  using (
    exists (
      select 1
      from public.cases legal_case
      where legal_case.id = case_sources.case_id
        and public.has_organization_access(legal_case.organization_id)
    )
  )
  with check (
    exists (
      select 1
      from public.cases legal_case
      where legal_case.id = case_sources.case_id
        and public.has_organization_access(legal_case.organization_id)
    )
  );

create policy "Members can read source snapshots"
  on public.source_snapshots for select
  to authenticated
  using (
    exists (
      select 1
      from public.case_sources case_source
      join public.cases legal_case on legal_case.id = case_source.case_id
      where case_source.id = source_snapshots.case_source_id
        and public.has_organization_access(legal_case.organization_id)
    )
  );

create policy "Members can manage source snapshots"
  on public.source_snapshots for all
  to authenticated
  using (
    exists (
      select 1
      from public.case_sources case_source
      join public.cases legal_case on legal_case.id = case_source.case_id
      where case_source.id = source_snapshots.case_source_id
        and public.has_organization_access(legal_case.organization_id)
    )
  )
  with check (
    exists (
      select 1
      from public.case_sources case_source
      join public.cases legal_case on legal_case.id = case_source.case_id
      where case_source.id = source_snapshots.case_source_id
        and public.has_organization_access(legal_case.organization_id)
    )
  );

create policy "Members can read case movements"
  on public.case_movements for select
  to authenticated
  using (
    exists (
      select 1
      from public.cases legal_case
      where legal_case.id = case_movements.case_id
        and public.has_organization_access(legal_case.organization_id)
    )
  );

create policy "Members can manage case movements"
  on public.case_movements for all
  to authenticated
  using (
    exists (
      select 1
      from public.cases legal_case
      where legal_case.id = case_movements.case_id
        and public.has_organization_access(legal_case.organization_id)
    )
  )
  with check (
    exists (
      select 1
      from public.cases legal_case
      where legal_case.id = case_movements.case_id
        and public.has_organization_access(legal_case.organization_id)
    )
  );

create policy "Members can read legal events"
  on public.legal_events for select
  to authenticated
  using (
    exists (
      select 1
      from public.cases legal_case
      where legal_case.id = legal_events.case_id
        and public.has_organization_access(legal_case.organization_id)
    )
  );

create policy "Members can manage legal events"
  on public.legal_events for all
  to authenticated
  using (
    exists (
      select 1
      from public.cases legal_case
      where legal_case.id = legal_events.case_id
        and public.has_organization_access(legal_case.organization_id)
    )
  )
  with check (
    exists (
      select 1
      from public.cases legal_case
      where legal_case.id = legal_events.case_id
        and public.has_organization_access(legal_case.organization_id)
    )
  );

create policy "Members can read alerts"
  on public.alerts for select
  to authenticated
  using (public.has_organization_access(organization_id));

create policy "Members can manage alerts"
  on public.alerts for all
  to authenticated
  using (public.has_organization_access(organization_id))
  with check (public.has_organization_access(organization_id));

create policy "Members can read notification deliveries"
  on public.notification_deliveries for select
  to authenticated
  using (
    exists (
      select 1
      from public.alerts alert
      where alert.id = notification_deliveries.alert_id
        and public.has_organization_access(alert.organization_id)
    )
  );

create policy "Members can manage notification deliveries"
  on public.notification_deliveries for all
  to authenticated
  using (
    exists (
      select 1
      from public.alerts alert
      where alert.id = notification_deliveries.alert_id
        and public.has_organization_access(alert.organization_id)
    )
  )
  with check (
    exists (
      select 1
      from public.alerts alert
      where alert.id = notification_deliveries.alert_id
        and public.has_organization_access(alert.organization_id)
    )
  );

insert into public.organizations (id, name, created_at)
select
  '00000000-0000-0000-0000-000000000001'::uuid,
  'LexControl Beta',
  now()
where not exists (
  select 1 from public.organizations
  where id = '00000000-0000-0000-0000-000000000001'::uuid
);
