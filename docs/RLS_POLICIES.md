# Row Level Security (RLS) Policies Documentation

## Overview

This document provides comprehensive documentation of all Row Level Security (RLS) policies in the Second Chance Connect application. RLS is the primary security mechanism that controls data access at the database level.

## Table of Contents

- [What is RLS?](#what-is-rls)
- [Policy Overview](#policy-overview)
- [Profiles Policies](#profiles-policies)
- [Jobs Policies](#jobs-policies)
- [Applications Policies](#applications-policies)
- [Messages Policies](#messages-policies)
- [Services Policies](#services-policies)
- [Testing RLS Policies](#testing-rls-policies)
- [Multi-Tenancy Considerations](#multi-tenancy-considerations)
- [Troubleshooting](#troubleshooting)

## What is RLS?

Row Level Security (RLS) is a PostgreSQL feature that allows you to control which rows users can access in database tables. In our application:

- **Database-level enforcement**: Policies are enforced by PostgreSQL, not application code
- **Defense in depth**: Even if application code has bugs, RLS prevents unauthorized access
- **Role-based**: Policies check user roles and IDs to determine access
- **Automatic**: Applies to all queries without requiring code changes

## Policy Overview

All tables in the application have RLS enabled:

| Table | RLS Enabled | Select | Insert | Update | Delete |
|-------|-------------|--------|--------|--------|--------|
| profiles | ✅ | Public | Own | Own | ❌ |
| jobs | ✅ | Active/Own | Employers | Employers | Employers |
| applications | ✅ | Own/Related | Seekers | Own/Employer | ❌ |
| messages | ✅ | Own | Authenticated | Receiver | ❌ |
| services | ✅ | Public | Admin | Admin | Admin |

**Legend:**
- **Public**: Anyone can access
- **Own**: Users can access their own records
- **Related**: Users can access records related to them
- **Employers**: Only users with EMPLOYER role
- **Seekers**: Only users with SEEKER role
- **Admin**: Only users with ADMIN role
- **Authenticated**: Any authenticated user

## Profiles Policies

### Enable RLS
\`\`\`sql
alter table public.profiles enable row level security;
\`\`\`

### Policy 1: View All Profiles
\`\`\`sql
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);
\`\`\`

**Purpose**: Allow users to discover other users for messaging and job applications

**Security**: Safe because profiles don't contain sensitive information. Future enhancement should filter sensitive fields.

**Use Cases**:
- Employers viewing job seeker profiles
- Seekers viewing employer company profiles
- Officers viewing their client profiles

### Policy 2: Update Own Profile
\`\`\`sql
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
\`\`\`

**Purpose**: Users can only modify their own profile information

**Security**: `auth.uid()` ensures the authenticated user's ID matches the profile ID

**Use Cases**:
- Updating personal information
- Changing avatar
- Editing bio and contact details

### Policy 3: Insert Own Profile
\`\`\`sql
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
\`\`\`

**Purpose**: Profiles can only be created for the authenticated user

**Security**: Prevents creating profiles for other users

**Use Cases**:
- Automatic profile creation after sign-up (via trigger)
- Manual profile initialization

## Jobs Policies

### Enable RLS
\`\`\`sql
alter table public.jobs enable row level security;
\`\`\`

### Policy 1: View Active Jobs
\`\`\`sql
create policy "Anyone can view active jobs"
  on public.jobs for select
  using (status = 'ACTIVE' or employer_id = auth.uid());
\`\`\`

**Purpose**: Public can see active job listings; employers see all their jobs

**Security**: 
- Seekers only see published (ACTIVE) jobs
- Employers see all jobs they created (including DRAFT and CLOSED)
- Prevents viewing competitor's unpublished jobs

**Use Cases**:
- Job browsing for seekers
- Employer managing their job listings

### Policy 2: Create Jobs (Employers Only)
\`\`\`sql
create policy "Employers can create jobs"
  on public.jobs for insert
  with check (
    auth.uid() = employer_id and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'EMPLOYER')
  );
\`\`\`

**Purpose**: Only employers can post job listings

**Security**: 
- Verifies user has EMPLOYER role
- Ensures employer_id matches authenticated user
- Prevents role escalation

**Use Cases**:
- Posting new job opportunities
- Creating draft job listings

### Policy 3: Update Own Jobs
\`\`\`sql
create policy "Employers can update own jobs"
  on public.jobs for update
  using (auth.uid() = employer_id);
\`\`\`

**Purpose**: Employers can modify their own job postings

**Security**: Owner-only modification

**Use Cases**:
- Editing job descriptions
- Changing job status (DRAFT → ACTIVE → CLOSED)
- Updating requirements

### Policy 4: Delete Own Jobs
\`\`\`sql
create policy "Employers can delete own jobs"
  on public.jobs for delete
  using (auth.uid() = employer_id);
\`\`\`

**Purpose**: Employers can remove their job listings

**Security**: Owner-only deletion

**Use Cases**:
- Removing filled positions
- Deleting draft jobs
- Cleaning up old listings

## Applications Policies

### Enable RLS
\`\`\`sql
alter table public.applications enable row level security;
\`\`\`

### Policy 1: View Own Applications
\`\`\`sql
create policy "Users can view own applications"
  on public.applications for select
  using (
    auth.uid() = seeker_id or
    exists (select 1 from public.jobs where id = job_id and employer_id = auth.uid())
  );
\`\`\`

**Purpose**: Seekers see their applications; employers see applications for their jobs

**Security**:
- Seekers only access applications they submitted
- Employers only access applications for their job postings
- Officers cannot see applications (future enhancement needed)

**Use Cases**:
- Tracking application status
- Reviewing applicants
- Application management

### Policy 2: Create Applications (Seekers Only)
\`\`\`sql
create policy "Seekers can create applications"
  on public.applications for insert
  with check (
    auth.uid() = seeker_id and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'SEEKER')
  );
\`\`\`

**Purpose**: Only job seekers can apply to jobs

**Security**:
- Verifies SEEKER role
- Ensures seeker_id matches authenticated user
- Prevents impersonation

**Use Cases**:
- Applying to job postings
- Submitting applications

### Policy 3: Update Own Applications (Seekers)
\`\`\`sql
create policy "Seekers can update own applications"
  on public.applications for update
  using (auth.uid() = seeker_id);
\`\`\`

**Purpose**: Seekers can modify their applications (before review)

**Security**: Owner-only modification

**Use Cases**:
- Editing cover letters
- Updating resume attachments
- Withdrawing applications

### Policy 4: Update Applications (Employers)
\`\`\`sql
create policy "Employers can update applications for their jobs"
  on public.applications for update
  using (
    exists (select 1 from public.jobs where id = job_id and employer_id = auth.uid())
  );
\`\`\`

**Purpose**: Employers can update application status

**Security**: Only for applications to their own jobs

**Use Cases**:
- Changing status (PENDING → REVIEWED → ACCEPTED/REJECTED)
- Adding notes
- Scheduling interviews

## Messages Policies

### Enable RLS
\`\`\`sql
alter table public.messages enable row level security;
\`\`\`

### Policy 1: View Own Messages
\`\`\`sql
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);
\`\`\`

**Purpose**: Users can only see messages they sent or received

**Security**: Both parties in conversation can access messages

**Use Cases**:
- Viewing message inbox
- Reading sent messages
- Message threads

### Policy 2: Send Messages
\`\`\`sql
create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);
\`\`\`

**Purpose**: Users can send messages as themselves

**Security**: Prevents sending messages as other users

**Use Cases**:
- Initiating conversations
- Replying to messages
- Contacting support

### Policy 3: Mark Messages as Read
\`\`\`sql
create policy "Users can update own received messages"
  on public.messages for update
  using (auth.uid() = receiver_id);
\`\`\`

**Purpose**: Recipients can mark messages as read

**Security**: Only the receiver can modify message status

**Use Cases**:
- Marking messages as read
- Updating message metadata

## Services Policies

### Enable RLS
\`\`\`sql
alter table public.services enable row level security;
\`\`\`

### Policy 1: View All Services
\`\`\`sql
create policy "Anyone can view services"
  on public.services for select
  using (true);
\`\`\`

**Purpose**: Support services directory is public information

**Security**: Safe as services are community resources

**Use Cases**:
- Browsing support services
- Finding housing, education, legal resources
- Public service directory

### Policy 2: Manage Services (Admin Only)
\`\`\`sql
create policy "Admins can manage services"
  on public.services for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN')
  );
\`\`\`

**Purpose**: Only admins can create, update, or delete services

**Security**: Role-based access control for administrative functions

**Use Cases**:
- Adding new services
- Updating service information
- Removing outdated services

## Testing RLS Policies

### Manual Testing

Test each policy by authenticating as different user types:

\`\`\`sql
-- Test as seeker
SET request.jwt.claims TO '{"sub": "seeker-user-id", "role": "authenticated"}';

-- Try to access jobs
SELECT * FROM jobs WHERE status = 'ACTIVE'; -- Should work
SELECT * FROM jobs WHERE status = 'DRAFT'; -- Should return empty

-- Test as employer
SET request.jwt.claims TO '{"sub": "employer-user-id", "role": "authenticated"}';

-- Try to create job
INSERT INTO jobs (title, company, employer_id) 
VALUES ('Test Job', 'Test Co', 'employer-user-id'); -- Should work
\`\`\`

### Automated Testing

See `tests/rls-policies.test.js` for comprehensive RLS policy tests.

Key test scenarios:
- ✅ Users can view their own data
- ✅ Users cannot view others' private data
- ✅ Role-based access is enforced
- ✅ Modifications are restricted to owners
- ✅ Admin privileges are properly checked

## Multi-Tenancy Considerations

### Current Architecture

The application is designed as a **single-tenant system** with role-based access:
- Users are in one global pool
- Roles: SEEKER, EMPLOYER, OFFICER, ADMIN
- No organization hierarchy

### Scaling for Multi-Tenancy

To support multiple organizations (e.g., different probation departments):

#### Option 1: Organization Column

Add `organization_id` to all tables:

\`\`\`sql
alter table profiles add column organization_id uuid references organizations(id);

-- Update policies
create policy "Users can view profiles in their organization"
  on profiles for select
  using (
    organization_id = (select organization_id from profiles where id = auth.uid())
  );
\`\`\`

**Pros:**
- Simple to implement
- Clear data separation
- Easy to query

**Cons:**
- Requires schema migration
- All policies need updates
- Cross-organization features are complex

#### Option 2: Separate Schemas

Create separate schemas per organization:

\`\`\`sql
CREATE SCHEMA org_1;
CREATE SCHEMA org_2;

-- Duplicate tables in each schema
\`\`\`

**Pros:**
- Complete isolation
- Can customize per org
- Better for compliance

**Cons:**
- Complex management
- Code changes needed
- Harder to maintain

#### Recommendation

For current scale, **Option 1** is recommended:
1. Add organization_id column
2. Update all RLS policies to include organization check
3. Create organizations management UI
4. Migrate existing data to default organization

### Migration Strategy

\`\`\`sql
-- Step 1: Add column (nullable initially)
ALTER TABLE profiles ADD COLUMN organization_id UUID;

-- Step 2: Create default organization
INSERT INTO organizations (id, name) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Default Organization');

-- Step 3: Update existing data
UPDATE profiles SET organization_id = '00000000-0000-0000-0000-000000000001';

-- Step 4: Make column required
ALTER TABLE profiles ALTER COLUMN organization_id SET NOT NULL;

-- Step 5: Update policies
-- (See Option 1 above)
\`\`\`

## Troubleshooting

### Common Issues

#### 1. "Row level security is enabled but no policies exist"

**Symptom**: Queries return no results even for owned data

**Cause**: RLS enabled but policies not created

**Solution**: Run `scripts/002_enable_rls.sql`

#### 2. "Permission denied for table"

**Symptom**: Error when accessing table

**Cause**: User lacks table-level permissions

**Solution**: Grant permissions:
\`\`\`sql
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON jobs TO authenticated;
\`\`\`

#### 3. Policies not applying

**Symptom**: Users can see data they shouldn't

**Cause**: Using service role key instead of anon key

**Solution**: 
- Verify using `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Never use service role key in client code

#### 4. Performance issues

**Symptom**: Slow queries with RLS

**Cause**: Complex policy subqueries

**Solution**: 
- Add indexes on foreign keys
- Optimize policy queries
- Consider denormalization

### Debugging RLS

Enable query logging to see RLS in action:

\`\`\`sql
-- Show applied policies
EXPLAIN (ANALYZE, VERBOSE) SELECT * FROM jobs;

-- Check effective policies
SELECT * FROM pg_policies WHERE tablename = 'jobs';

-- Test specific user context
BEGIN;
SET ROLE authenticated;
SET request.jwt.claims = '{"sub": "user-id-here"}';
SELECT * FROM jobs;
ROLLBACK;
\`\`\`

### Policy Testing Checklist

- [ ] Can authenticated users access their own data?
- [ ] Are other users' data hidden?
- [ ] Can users only modify their own records?
- [ ] Are role checks working correctly?
- [ ] Do admin users have proper access?
- [ ] Are public tables accessible without auth?
- [ ] Do policies handle NULL values correctly?
- [ ] Are there no performance bottlenecks?

## Best Practices

### Writing RLS Policies

1. **Start restrictive, then open up**: Default to denying access
2. **Test with multiple users**: Don't just test as yourself
3. **Use role checks**: Verify roles in policies, not just app code
4. **Avoid complex subqueries**: Keep policies simple for performance
5. **Document policies**: Explain the purpose of each policy
6. **Version control**: Keep policies in migration files

### Maintaining RLS

1. **Review regularly**: Audit policies quarterly
2. **Test on changes**: Run RLS tests on every schema change
3. **Monitor performance**: Watch for slow queries
4. **Document exceptions**: Explain any unusual policies
5. **Keep synchronized**: Ensure policies match app logic

### Security Considerations

1. **Never bypass RLS**: Don't use service role key in client code
2. **Validate in policies**: Don't rely on app validation alone
3. **Use auth.uid()**: Always use authenticated user ID
4. **Check roles**: Verify user roles in policies
5. **Audit logs**: Log policy violations
6. **Regular reviews**: Conduct security audits

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Security Best Practices](../SECURITY.md)
- [Database Schema](../scripts/001_create_tables.sql)
- [RLS Policies SQL](../scripts/002_enable_rls.sql)

## Future Enhancements

- [ ] Add officer access to client applications
- [ ] Implement organization-level multi-tenancy
- [ ] Add audit logging for policy violations
- [ ] Create RLS policy visualization tool
- [ ] Add performance monitoring for policies
- [ ] Implement time-based access controls
- [ ] Add IP-based access restrictions
