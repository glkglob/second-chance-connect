-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.messages enable row level security;
alter table public.services enable row level security;

-- Profiles policies
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Jobs policies
create policy "Anyone can view active jobs"
  on public.jobs for select
  using (status = 'ACTIVE' or employer_id = auth.uid());

create policy "Employers can create jobs"
  on public.jobs for insert
  with check (
    auth.uid() = employer_id and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'EMPLOYER')
  );

create policy "Employers can update own jobs"
  on public.jobs for update
  using (auth.uid() = employer_id);

create policy "Employers can delete own jobs"
  on public.jobs for delete
  using (auth.uid() = employer_id);

-- Applications policies
create policy "Users can view own applications"
  on public.applications for select
  using (
    auth.uid() = seeker_id or
    exists (select 1 from public.jobs where id = job_id and employer_id = auth.uid())
  );

create policy "Seekers can create applications"
  on public.applications for insert
  with check (
    auth.uid() = seeker_id and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'SEEKER')
  );

create policy "Seekers can update own applications"
  on public.applications for update
  using (auth.uid() = seeker_id);

create policy "Employers can update applications for their jobs"
  on public.applications for update
  using (
    exists (select 1 from public.jobs where id = job_id and employer_id = auth.uid())
  );

-- Messages policies
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can update own received messages"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- Services policies (public read, admin write)
create policy "Anyone can view services"
  on public.services for select
  using (true);

create policy "Admins can manage services"
  on public.services for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
  );
