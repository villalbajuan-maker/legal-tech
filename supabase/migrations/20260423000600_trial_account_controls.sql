alter table public.organizations
add column if not exists account_status text not null default 'demo_active',
add column if not exists trial_started_at timestamptz,
add column if not exists trial_ends_at timestamptz,
add column if not exists process_limit integer not null default 100,
add column if not exists member_limit integer not null default 4;

alter table public.organizations
drop constraint if exists organizations_account_status_check;

alter table public.organizations
add constraint organizations_account_status_check
check (account_status in ('demo_active', 'demo_expired', 'suspended', 'converted', 'closed'));

alter table public.organizations
drop constraint if exists organizations_process_limit_check;

alter table public.organizations
add constraint organizations_process_limit_check
check (process_limit > 0);

alter table public.organizations
drop constraint if exists organizations_member_limit_check;

alter table public.organizations
add constraint organizations_member_limit_check
check (member_limit > 0);

update public.organizations
set
  trial_started_at = coalesce(trial_started_at, created_at),
  trial_ends_at = coalesce(trial_ends_at, created_at + interval '14 days'),
  process_limit = coalesce(process_limit, 100),
  member_limit = coalesce(member_limit, 4),
  account_status = coalesce(account_status, 'demo_active');
