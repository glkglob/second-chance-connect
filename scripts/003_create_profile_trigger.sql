-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'SEEKER')
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$;

-- Trigger to auto-create profile
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at_jobs
  before update on public.jobs
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at_applications
  before update on public.applications
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at_services
  before update on public.services
  for each row
  execute function public.handle_updated_at();
