# RLS Policy Test Suite

This document describes tests for Row Level Security (RLS) policies.

## Test Setup

RLS policies must be tested against a real Supabase database. The tests should:

1. Create test users with different roles
2. Authenticate as each user
3. Attempt various database operations
4. Verify the expected results

## Required Test Environment

Set up test environment variables:

\`\`\`bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=your-test-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

## Test Cases

### Profiles Table

#### Test: Users can view all profiles
- [ ] Authenticated user can view other profiles
- [ ] Public profiles are visible
- [ ] Query returns multiple profiles

#### Test: Users can only update their own profile
- [ ] User can update their own profile
- [ ] User cannot update another user's profile
- [ ] Update attempt on other profile returns error

#### Test: Users can only insert their own profile
- [ ] User can create profile for themselves
- [ ] User cannot create profile for another user

### Jobs Table

#### Test: Anyone can view active jobs
- [ ] Unauthenticated users see active jobs
- [ ] Authenticated users see active jobs
- [ ] Draft jobs are hidden from non-owners
- [ ] Closed jobs are hidden from non-owners

#### Test: Employers can view all their jobs
- [ ] Employer sees their active jobs
- [ ] Employer sees their draft jobs
- [ ] Employer sees their closed jobs
- [ ] Employer doesn't see other employers' drafts

#### Test: Only employers can create jobs
- [ ] EMPLOYER role can create jobs
- [ ] SEEKER role cannot create jobs
- [ ] OFFICER role cannot create jobs
- [ ] ADMIN role cannot create jobs (unless also employer)

#### Test: Employers can only modify their own jobs
- [ ] Employer can update their job
- [ ] Employer cannot update another employer's job
- [ ] Employer can delete their job
- [ ] Employer cannot delete another employer's job

### Applications Table

#### Test: Seekers can view their applications
- [ ] Seeker sees their applications
- [ ] Seeker doesn't see other seekers' applications

#### Test: Employers can view applications to their jobs
- [ ] Employer sees applications to their jobs
- [ ] Employer doesn't see applications to other jobs

#### Test: Only seekers can create applications
- [ ] SEEKER role can apply to jobs
- [ ] EMPLOYER role cannot create applications
- [ ] OFFICER role cannot create applications

#### Test: Seekers can update their applications
- [ ] Seeker can update their application
- [ ] Seeker cannot update another seeker's application

#### Test: Employers can update applications to their jobs
- [ ] Employer can update application status
- [ ] Employer can add notes to applications
- [ ] Employer cannot update applications to other jobs

### Messages Table

#### Test: Users can only view their messages
- [ ] User sees messages they sent
- [ ] User sees messages they received
- [ ] User doesn't see messages between other users

#### Test: Users can only send messages as themselves
- [ ] User can send message with their ID as sender
- [ ] User cannot send message with another user's ID as sender

#### Test: Only receivers can mark messages as read
- [ ] Receiver can mark message as read
- [ ] Sender cannot mark message as read
- [ ] Third party cannot mark message as read

### Services Table

#### Test: Anyone can view services
- [ ] Unauthenticated users can view services
- [ ] Authenticated users can view services
- [ ] All services are visible

#### Test: Only admins can manage services
- [ ] ADMIN role can create services
- [ ] ADMIN role can update services
- [ ] ADMIN role can delete services
- [ ] Non-admin roles cannot create services
- [ ] Non-admin roles cannot update services
- [ ] Non-admin roles cannot delete services

## Running Tests

### Manual Testing

Use Supabase SQL Editor:

\`\`\`sql
-- Authenticate as a test user
SELECT auth.uid(); -- Should return user ID

-- Test viewing jobs
SELECT * FROM jobs WHERE status = 'ACTIVE';

-- Test creating a job (as employer)
INSERT INTO jobs (title, company, location, description, employer_id)
VALUES ('Test Job', 'Test Co', 'Test City', 'Test Desc', auth.uid());
\`\`\`

### Automated Testing

Create test suite using Supabase client:

\`\`\`javascript
// tests/rls/jobs.test.js
import { createClient } from '@supabase/supabase-js'

describe('Jobs RLS Policies', () => {
  let seekerClient, employerClient, adminClient
  
  beforeAll(async () => {
    // Create test users and authenticate
    seekerClient = await createTestUser('SEEKER')
    employerClient = await createTestUser('EMPLOYER')
    adminClient = await createTestUser('ADMIN')
  })
  
  it('should allow employers to create jobs', async () => {
    const { data, error } = await employerClient
      .from('jobs')
      .insert({ title: 'Test Job', ... })
    
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })
  
  it('should prevent seekers from creating jobs', async () => {
    const { data, error } = await seekerClient
      .from('jobs')
      .insert({ title: 'Test Job', ... })
    
    expect(error).toBeDefined()
    expect(data).toBeNull()
  })
})
\`\`\`

## Security Checklist

After running all tests, verify:

- [ ] No user can access data they shouldn't see
- [ ] Role checks work correctly for all operations
- [ ] Policies handle edge cases (NULL values, deleted records)
- [ ] Performance is acceptable (no slow queries)
- [ ] Policies are applied consistently across all routes
- [ ] No way to bypass policies using API routes
- [ ] Service role key is never exposed to client

## Continuous Integration

Add RLS tests to CI pipeline:

\`\`\`yaml
# .github/workflows/test.yml
- name: Run RLS Policy Tests
  run: npm run test:rls
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
\`\`\`

## References

- [RLS Policies Documentation](../../docs/RLS_POLICIES.md)
- [Supabase RLS Testing Guide](https://supabase.com/docs/guides/auth/row-level-security#testing-policies)
- [Database Schema](../../scripts/001_create_tables.sql)
- [RLS Policy SQL](../../scripts/002_enable_rls.sql)
