# Second Chance Connect - Setup Guide

Complete setup instructions for running the Second Chance Connect application locally and deploying to production.

## Prerequisites

- Node.js 20+ and npm
- A Supabase account and project
- Git

## Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd second-chance-connect
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables

The Supabase integration is already connected in v0. The following environment variables are automatically available:

- `SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY`

For local development with email confirmation redirects, add to your environment:

\`\`\`bash
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
\`\`\`

### 4. Initialize the Database

Run the SQL scripts in order through the v0 interface or Supabase SQL Editor:

1. **001_create_tables.sql** - Creates all database tables and indexes
2. **002_enable_rls.sql** - Enables Row Level Security and creates policies
3. **003_create_profile_trigger.sql** - Sets up automatic profile creation
4. **004_seed_data.sql** - (Optional) Adds sample service data

To run scripts in v0:
- The scripts are located in the `scripts/` folder
- v0 can execute them directly for you
- Scripts will run against your connected Supabase database

### 5. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## Database Schema Overview

### Tables

- **profiles** - User profiles extending auth.users
- **jobs** - Job postings created by employers
- **applications** - Job applications from seekers
- **messages** - Direct messaging between users
- **services** - Support services directory

### User Roles

- **SEEKER** - Job seekers with criminal records
- **EMPLOYER** - Companies posting jobs
- **OFFICER** - Probation/parole officers
- **ADMIN** - Platform administrators

## Authentication Flow

1. Users sign up at `/auth/sign-up` with email, password, and role
2. Supabase sends a confirmation email
3. After confirmation, users can sign in at `/auth/login`
4. Middleware redirects users to role-specific dashboards:
   - SEEKER → `/dashboard`
   - EMPLOYER → `/employer/dashboard`
   - OFFICER → `/officer/dashboard`
   - ADMIN → `/admin/dashboard`

## API Routes

All API routes are located in `app/api/`:

- **GET/POST /api/jobs** - List and create jobs
- **GET/PATCH/DELETE /api/jobs/[id]** - Job operations
- **GET/POST /api/applications** - List and create applications
- **PATCH /api/applications/[id]** - Update application status
- **GET/POST /api/messages** - List and send messages
- **PATCH /api/messages/[id]** - Mark messages as read
- **GET /api/services** - List support services

## Custom Hooks

Client-side data fetching hooks in `lib/hooks/`:

- **useJobs()** - Fetch jobs with filters
- **useJob(id)** - Fetch single job
- **useApplications()** - Fetch applications
- **useMessages()** - Fetch and send messages
- **useServices()** - Fetch support services

## Deployment to Vercel

### 1. Connect to Vercel

The project is already configured for Vercel deployment through v0.

### 2. Environment Variables

Ensure these are set in your Vercel project settings:

- `SUPABASE_NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY`

These should already be configured through the v0 Supabase integration.

### 3. Deploy

Push to your main branch or click "Publish" in v0 to deploy.

## Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow users to view their own data
- Restrict modifications to data owners
- Enforce role-based access control

### Authentication

- Passwords are hashed by Supabase Auth
- Email confirmation required by default
- Session tokens managed automatically
- Middleware protects all dashboard routes

## Troubleshooting

### Email Confirmation Not Working

Check that `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set correctly for local development.

### RLS Errors

Ensure users have confirmed their email before trying to access protected resources. The trigger creates profiles automatically, but users need an active session.

### API Route Errors

Check browser console and server logs for detailed error messages. All API routes include error logging with `[v0]` prefix.

## Next Steps

1. **Customize Email Templates** - Update Supabase email templates for your brand
2. **Add File Upload** - Implement resume upload using Supabase Storage
3. **Real-time Features** - Add Supabase Realtime for live messaging
4. **Analytics** - Integrate Vercel Analytics for usage tracking
5. **Testing** - Add unit and integration tests
6. **Monitoring** - Set up error tracking and performance monitoring

## Support

For issues or questions:
- Check the documentation in `/docs`
- Review the PRD in the project root
- Contact the development team
