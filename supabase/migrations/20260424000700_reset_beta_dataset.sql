do $$
declare
  target_org_id uuid;
begin
  select organization.id
    into target_org_id
  from public.organizations as organization
  where organization.name = 'LexControl Beta'
  order by organization.created_at asc
  limit 1;

  if target_org_id is null then
    raise notice 'reset_beta_dataset: organization LexControl Beta not found, skipping';
    return;
  end if;

  delete from public.clients
  where organization_id = target_org_id;

  delete from public.cases
  where organization_id = target_org_id;

  raise notice 'reset_beta_dataset: dataset cleared for organization %', target_org_id;
end
$$;
