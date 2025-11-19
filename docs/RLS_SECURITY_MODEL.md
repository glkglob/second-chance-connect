# Row Level Security (RLS) Model

## Overview

Second Chance Connect uses PostgreSQL Row Level Security (RLS) as the primary database security mechanism. RLS provides database-level access control, ensuring data isolation and security even if application-level checks fail.

## Security Philosophy

**Defense in Depth**: RLS is the last line of defense
- Application code checks permissions
- Middleware enforces authentication
- RLS policies guarantee database-level security
- Even with compromised application code, RLS protects data

## Role-Based Access Model

### User Roles

| Role | Description | Primary Use Case |
|------|-------------|-----------------|
| **SEEKER** | Job seekers with criminal records | Browse jobs, apply, communicate |
| **EMPLOYER** | Hiring organizations | Post jobs, review candidates |
| **OFFICER** | Probation/parole officers | Monitor clients, track compliance |
| **ADMIN** | Platform administrators | System management, moderation |

## Table-by-Table Security

### 1. Profiles Table

**Schema**:
```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null check (role in ('SEEKER', 'EMPLOYER', 'OFFICER', 'ADMIN')),
  phone text,
  location text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

**RLS Policies**:

```sql
-- Read: All authenticated users can view all profiles
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

-- Insert: Users can only create their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Update: Users can only update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- No delete policy: Profiles are cascade deleted when auth.users is deleted
```

**Rationale**:
- Public profile viewing enables discovery and communication
- Users maintain full control over their own profile
- Admin operations should go through auth.users for proper cascade

**Multi-tenancy Considerations**:
- In a multi-tenant scenario, add organization_id column
- Modify policies: `using (auth.uid() = id OR organization_id = current_organization())`

### 2. Jobs Table

**Schema**:
```sql
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company text not null,
  location text not null,
  description text not null,
  requirements text,
  salary_range text,
  employment_type text,
  status text default 'DRAFT' check (status in ('ACTIVE', 'DRAFT', 'CLOSED')),
  employer_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

**RLS Policies**:

```sql
-- Read: Anyone can view ACTIVE jobs, employers can view their own
create policy "Anyone can view active jobs"
  on public.jobs for select
  using (status = 'ACTIVE' or employer_id = auth.uid());

-- Insert: Only employers can create jobs
create policy "Employers can create jobs"
  on public.jobs for insert
  with check (
    auth.uid() = employer_id and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'EMPLOYER')
  );

-- Update: Employers can only update their own jobs
create policy "Employers can update own jobs"
  on public.jobs for update
  using (auth.uid() = employer_id);

-- Delete: Employers can only delete their own jobs
create policy "Employers can delete own jobs"
  on public.jobs for delete
  using (auth.uid() = employer_id);
```

**Rationale**:
- Public job listings for discovery
- Employers control their own postings
- Role check prevents privilege escalation
- Draft/Closed jobs hidden from seekers

**Performance Optimization**:
```sql
-- Index for common queries
create index idx_jobs_status on public.jobs(status);
create index idx_jobs_employer on public.jobs(employer_id);
create index idx_jobs_created on public.jobs(created_at desc);
```

**Multi-tenancy Considerations**:
- Add `organization_id` for multi-employer organizations
- Add `visibility` field for internal-only postings

### 3. Applications Table

**Schema**:
```sql
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  seeker_id uuid references public.profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  status text default 'PENDING' check (status in ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED')),
  cover_letter text,
  resume_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(seeker_id, job_id)
);
```

**RLS Policies**:

```sql
-- Read: Seekers see own applications, employers see applications for their jobs
create policy "Users can view own applications"
  on public.applications for select
  using (
    auth.uid() = seeker_id or
    exists (select 1 from public.jobs where id = job_id and employer_id = auth.uid())
  );

-- Insert: Only seekers can apply to jobs
create policy "Seekers can create applications"
  on public.applications for insert
  with check (
    auth.uid() = seeker_id and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'SEEKER')
  );

-- Update: Seekers update own, employers update status on their jobs
create policy "Seekers can update own applications"
  on public.applications for update
  using (auth.uid() = seeker_id);

create policy "Employers can update applications for their jobs"
  on public.applications for update
  using (
    exists (select 1 from public.jobs where id = job_id and employer_id = auth.uid())
  );

-- No delete: Maintain application history for compliance
```

**Rationale**:
- Privacy: Seekers can't see other applications
- Transparency: Both parties can view shared applications
- Separate update policies for different data ownership
- Unique constraint prevents duplicate applications

**Security Notes**:
- Seekers can update cover_letter, resume_url
- Employers can update status, notes
- Application-level code enforces field-level restrictions

**Multi-tenancy Considerations**:
- Add `assigned_officer_id` for officer involvement
- Consider archival policy for old applications

### 4. Messages Table

**Schema**:
```sql
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  subject text,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

**RLS Policies**:

```sql
-- Read: Users can only see messages they sent or received
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Insert: Users can only send messages as themselves
create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Update: Only receivers can mark messages as read
create policy "Users can update own received messages"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- No delete: Maintain message history
```

**Rationale**:
- Strict privacy: Only sender and receiver see messages
- Prevents message spoofing (sender_id check)
- Receivers control read status
- Audit trail maintained

**Application-Level Controls**:
- Validate receiver exists and is appropriate role
- Prevent spam with rate limiting
- Add blocked user functionality

**Performance**:
```sql
create index idx_messages_sender on public.messages(sender_id);
create index idx_messages_receiver on public.messages(receiver_id);
create index idx_messages_created on public.messages(created_at desc);
```

### 5. Services Table

**Schema**:
```sql
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null check (category in ('HOUSING', 'EDUCATION', 'HEALTH', 'LEGAL', 'OTHER')),
  contact_email text,
  contact_phone text,
  location text,
  address text,
  description text,
  website_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

**RLS Policies**:

```sql
-- Read: Public directory, everyone can view
create policy "Anyone can view services"
  on public.services for select
  using (true);

-- Write: Only admins can manage services
create policy "Admins can manage services"
  on public.services for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
  );
```

**Rationale**:
- Public resource directory
- Admin-only curation for quality control
- No user-generated content to moderate

**Future Enhancements**:
- Add `verified` boolean for verified services
- Add `ratings` table for service reviews
- Consider regional filtering

## Officer-Client Relationships (Future)

**Planned Table**:
```sql
create table public.officer_clients (
  id uuid default uuid_generate_v4() primary key,
  officer_id uuid references public.profiles(id) not null,
  client_id uuid references public.profiles(id) not null,
  status text default 'ACTIVE',
  assigned_at timestamp with time zone default timezone('utc'::text, now()),
  notes text,
  unique(officer_id, client_id)
);

-- Policies
create policy "Officers see own clients"
  on public.officer_clients for select
  using (auth.uid() = officer_id);

create policy "Clients see own officers"
  on public.officer_clients for select
  using (auth.uid() = client_id);

create policy "Admins manage relationships"
  on public.officer_clients for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
  );
```

## Testing RLS Policies

### Manual Testing

```sql
-- Test as seeker
set request.jwt.claims.sub = '<seeker-uuid>';

-- Should see only own applications
select * from applications;

-- Should not be able to create jobs
insert into jobs (title, company, location, description, employer_id)
values ('Test', 'Test', 'Test', 'Test', '<seeker-uuid>');
-- ERROR: new row violates row-level security policy
```

### Automated Testing

```javascript
// Test RLS with Supabase client
import { createClient } from '@supabase/supabase-js'

async function testJobsRLS() {
  // Create seeker client
  const seekerClient = createClient(url, anonKey, {
    auth: { persistSession: false }
  })
  await seekerClient.auth.signIn({ email: 'seeker@test.com', password: 'test' })
  
  // Should not be able to create job
  const { data, error } = await seekerClient
    .from('jobs')
    .insert({ title: 'Test Job', employer_id: 'wrong-id' })
  
  expect(error).toBeTruthy()
  expect(error.message).toContain('violates row-level security')
}
```

See `tests/rls/` directory for comprehensive test suite.

## Common Pitfalls

### 1. Forgetting to Enable RLS
```sql
-- Always check
select tablename, rowsecurity 
from pg_tables 
where schemaname = 'public';

-- If false, enable
alter table public.table_name enable row level security;
```

### 2. Overly Permissive Policies
```sql
-- BAD: Allows anyone to do anything
create policy "bad_policy"
  on public.table_name for all
  using (true);

-- GOOD: Specific and restrictive
create policy "good_policy"
  on public.table_name for select
  using (auth.uid() = user_id);
```

### 3. Policy Conflicts
When multiple policies exist:
- SELECT: ANY policy returning true grants access
- INSERT/UPDATE/DELETE: ALL policies must return true

### 4. Performance Issues
- RLS adds WHERE clauses to every query
- Index columns used in policies
- Use `EXPLAIN ANALYZE` to check query plans

### 5. Testing with Service Role
- Service role key bypasses RLS
- Always test with anon key and regular users
- Never use service role in client-side code

## Security Audit Checklist

- [ ] All tables have RLS enabled
- [ ] No overly permissive policies (using true for write operations)
- [ ] Role checks in INSERT policies
- [ ] Ownership checks in UPDATE/DELETE policies
- [ ] Appropriate indexes for policy conditions
- [ ] Tested with multiple user roles
- [ ] Tested edge cases (deleted users, cascade deletes)
- [ ] No service role key in client code
- [ ] Policies documented and reviewed

## Future Scalability

### Multi-Tenancy

When scaling to multiple organizations:

```sql
-- Add to relevant tables
alter table public.profiles add column organization_id uuid references organizations(id);
alter table public.jobs add column organization_id uuid;

-- Update policies
create policy "organization_isolation"
  on public.table_name for select
  using (organization_id = current_setting('app.current_organization')::uuid);

-- Set organization in connection
set app.current_organization = '<org-uuid>';
```

### Performance Optimization

For large datasets:
1. Partition tables by organization or date
2. Use materialized views for analytics
3. Add composite indexes on policy columns
4. Consider denormalization for read-heavy tables

### Audit Logging

```sql
-- Create audit table
create table public.audit_log (
  id uuid default uuid_generate_v4() primary key,
  table_name text not null,
  record_id uuid not null,
  action text not null,
  user_id uuid references auth.users(id),
  changed_fields jsonb,
  created_at timestamp with time zone default now()
);

-- Trigger function
create or replace function audit_changes()
returns trigger as $$
begin
  insert into public.audit_log (table_name, record_id, action, user_id, changed_fields)
  values (TG_TABLE_NAME, NEW.id, TG_OP, auth.uid(), to_jsonb(NEW));
  return NEW;
end;
$$ language plpgsql security definer;
```

## Resources

- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [RLS Performance Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security-performance)

---

**Last Updated**: 2025-01-22  
**Next Review**: 2025-04-22
