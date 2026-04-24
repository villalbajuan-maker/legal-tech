alter table public.cases
  add column if not exists external_process_id bigint,
  add column if not exists external_process_key text,
  add column if not exists source_parties_summary text,
  add column if not exists source_last_movement_at timestamptz;

create index if not exists cases_external_process_id_idx
  on public.cases (external_process_id);
