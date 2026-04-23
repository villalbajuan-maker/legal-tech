create unique index if not exists legal_events_movement_event_type_unique_idx
  on public.legal_events (movement_id, event_type)
  where movement_id is not null;
