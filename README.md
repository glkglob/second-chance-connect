# Second Chance Connect

A comprehensive full-stack web application connecting individuals with criminal records to employment opportunities, probation officers, and support services for successful reintegration.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Font**: Inter (Google Fonts)
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## Design System

### Color Palette

- **Primary**: #003366 (Navy) - Trust, professionalism, stability
- **Secondary**: #4A90E2 (Light Blue) - Hope, opportunity, progress
- **Background**: #F4F6F8 (Light Gray) - Clean, accessible
- **Text Dark**: #212529
- **Text Light**: #FFFFFF
- **Success**: Green for positive actions
- **Destructive**: Red for errors and warnings

### Typography

- **Font Family**: Inter
- **Headings**: Bold, tracking-tight
- **Body**: Regular, leading-relaxed (1.5-1.6 line height)
- **Minimum Font Size**: 16px for body text

### Accessibility

- **WCAG-AA Compliant**: All color combinations meet 4.5:1 contrast ratio
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Semantic HTML**: Proper heading hierarchy, landmarks, ARIA labels
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Descriptive labels and announcements

## Project Structure

\`\`\`
second-chance-connect/
├── app/
│   ├── api/                   # API routes
│   │   ├── jobs/              # Job CRUD operations
│   │   ├── applications/      # Application management
│   │   ├── messages/          # Messaging system
│   │   └── services/          # Support services
│   ├── auth/                  # Authentication pages
│   │   ├── login/             # Sign in page
│   │   ├── sign-up/           # Registration page
│   │   ├── sign-up-success/   # Email confirmation notice
│   │   └── error/             # Auth error page
│   ├── dashboard/             # Job Seeker dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Dashboard home
│   │   ├── jobs/              # Job browsing
│   │   ├── applications/      # Application tracking
│   │   ├── profile/           # Profile management
│   │   ├── messages/          # Messaging
│   │   └── settings/          # Settings
│   ├── employer/              # Employer dashboard
│   │   ├── layout.tsx
│   │   ├── dashboard/         # Employer home
│   │   ├── jobs/              # Job posting management
│   │   ├── candidates/        # Candidate review
│   │   ├── messages/          # Messaging
│   │   └── settings/          # Settings
│   ├── officer/               # Probation Officer dashboard
│   │   ├── layout.tsx
│   │   ├── dashboard/         # Officer home
│   │   ├── clients/           # Client management
│   │   ├── reports/           # Reporting
│   │   ├── messages/          # Messaging
│   │   └── settings/          # Settings
│   ├── admin/                 # Admin panel
│   │   ├── layout.tsx
│   │   ├── dashboard/         # Admin home
│   │   ├── users/             # User management
│   │   ├── jobs/              # Job moderation
│   │   ├── reports/           # System reports
│   │   ├── content/           # Content management
│   │   └── settings/          # Platform settings
│   ├── page.tsx               # Home page
│   ├── about/                 # About page
│   ├── services/              # Support services page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── auth-button.tsx        # Authentication button
│   ├── site-header.tsx        # Public site header
│   ├── site-footer.tsx        # Public site footer
│   ├── dashboard-header.tsx   # Dashboard header
│   ├── dashboard-nav.tsx      # Dashboard navigation
│   ├── stat-card.tsx          # Statistics card
│   ├── job-card.tsx           # Job listing card
│   ├── page-header.tsx        # Page header component
│   ├── progress-tracker.tsx   # Progress tracking widget
│   ├── alerts-feed.tsx        # Alerts feed component
│   ├── registration-wizard.tsx # Multi-step registration
│   └── resume-builder.tsx     # Resume builder component
├── lib/
│   ├── supabase/              # Supabase client utilities
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Auth middleware
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-jobs.ts        # Jobs data fetching
│   │   ├── use-applications.ts # Applications data
│   │   ├── use-messages.ts    # Messaging data
│   │   └── use-services.ts    # Services data
│   ├── types/                 # TypeScript types
│   │   └── database.ts        # Database types
│   └── utils.ts               # Utility functions
├── scripts/                   # Database scripts
│   ├── 001_create_tables.sql  # Table creation
│   ├── 002_enable_rls.sql     # Row Level Security
│   ├── 003_create_profile_trigger.sql # Auto-profile creation
│   └── 004_seed_data.sql      # Sample data
├── middleware.ts              # Next.js middleware
├── .env.example               # Environment variables template
└── SETUP.md                   # Detailed setup guide
\`\`\`

## Database Schema

### Tables

- **profiles** - User profiles (extends auth.users)
  - Fields: id, name, role, phone, location, bio, avatar_url
  - Roles: SEEKER, EMPLOYER, OFFICER, ADMIN

- **jobs** - Job postings
  - Fields: id, title, company, location, description, requirements, salary_range, employment_type, status, employer_id
  - Status: ACTIVE, DRAFT, CLOSED

- **applications** - Job applications
  - Fields: id, seeker_id, job_id, status, cover_letter, resume_url, notes
  - Status: PENDING, REVIEWED, ACCEPTED, REJECTED

- **messages** - Direct messaging
  - Fields: id, sender_id, receiver_id, subject, content, read

- **services** - Support services directory
  - Fields: id, name, category, contact_email, contact_phone, location, address, description, website_url
  - Categories: HOUSING, EDUCATION, HEALTH, LEGAL, OTHER

### Security

All tables use Row Level Security (RLS) with policies that:
- Enforce role-based access control
- Allow users to view their own data
- Restrict modifications to data owners
- Protect sensitive information

## API Routes

### Jobs
- `GET /api/jobs` - List jobs (with filters: status, employerId, search)
- `POST /api/jobs` - Create job (employers only)
- `GET /api/jobs/[id]` - Get job details
- `PATCH /api/jobs/[id]` - Update job (owner only)
- `DELETE /api/jobs/[id]` - Delete job (owner only)

### Applications
- `GET /api/applications` - List applications (filtered by user)
- `POST /api/applications` - Apply to job (seekers only)
- `PATCH /api/applications/[id]` - Update application status

### Messages
- `GET /api/messages` - List messages (user's conversations)
- `POST /api/messages` - Send message
- `PATCH /api/messages/[id]` - Mark as read

### Services
- `GET /api/services` - List support services (public, with filters)

## Authentication Flow

1. **Sign Up** (`/auth/sign-up`)
   - User provides email, password, name, and role
   - Supabase sends confirmation email
   - Profile automatically created via database trigger

2. **Email Confirmation**
   - User clicks link in email
   - Account activated

3. **Sign In** (`/auth/login`)
   - User provides credentials
   - Redirected to role-specific dashboard

4. **Role-Based Access**
   - Middleware enforces route protection
   - Users can only access their role's dashboard

## Features

### For Job Seekers
- Browse fair-chance job opportunities
- Build and manage professional profiles
- Track job applications
- Access support services directory
- Communicate with employers and officers
- Personalized job recommendations

### For Employers
- Post job opportunities
- Review candidate applications
- Manage hiring pipeline
- Access fair-chance hiring resources
- Communicate with candidates
- Track hiring metrics

### For Probation Officers
- Monitor client employment status
- Track compliance and progress
- Generate reports
- Communicate with clients
- Access case management tools
- View employment analytics

### For Administrators
- Manage all user types
- Moderate job postings
- Generate system-wide reports
- Manage platform content
- Configure system settings
- Monitor platform health

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account and project
- npm, yarn, or pnpm

### Quick Start

1. **Clone and Install**
\`\`\`bash
git clone <repository-url>
cd second-chance-connect
npm install
\`\`\`

2. **Configure Supabase**

The Supabase integration is already connected in v0. Environment variables are automatically available:
- `SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY`

For local development, optionally add:
\`\`\`bash
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
\`\`\`

3. **Initialize Database**

Run the SQL scripts in order (located in `scripts/` folder):
- `001_create_tables.sql` - Creates tables and indexes
- `002_enable_rls.sql` - Enables Row Level Security
- `003_create_profile_trigger.sql` - Auto-creates profiles
- `004_seed_data.sql` - Adds sample services (optional)

4. **Start Development Server**
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### Detailed Setup

See [SETUP.md](./SETUP.md) for comprehensive setup instructions, troubleshooting, and deployment guide.

## Custom Hooks

Client-side data fetching with TypeScript:

- **useJobs(options)** - Fetch jobs with filters (status, employerId, search)
- **useJob(id)** - Fetch single job details
- **useApplications(options)** - Fetch applications (seekerId, jobId, status)
- **useMessages(options)** - Fetch messages, send messages, mark as read
- **useServices(options)** - Fetch support services (category, search)

All hooks include:
- Loading states
- Error handling
- Refetch capabilities
- TypeScript types

## Development Guidelines

### Component Structure
- Use TypeScript for all components
- Follow shadcn/ui patterns for consistency
- Implement proper error boundaries
- Use loading states for async operations
- Leverage custom hooks for data fetching

### API Development
- All routes include authentication checks
- Use RLS for database-level security
- Return consistent error responses
- Log errors with `[v0]` prefix for debugging

### Database Operations
- Never bypass RLS policies
- Use Supabase client utilities (client.ts/server.ts)
- Always check user permissions
- Handle unique constraint violations

## Deployment

### Vercel Deployment

1. **Connect Repository**
   - Push code to GitHub
   - Import in Vercel dashboard
   - Or use "Publish" button in v0

2. **Environment Variables**
   - Supabase variables are auto-configured in v0
   - Add any custom variables in Vercel dashboard

3. **Deploy**
   - Automatic deployments on push to main branch
   - Preview deployments for pull requests

### Database Migration

For production:
1. Run SQL scripts in Supabase dashboard
2. Or use v0 to execute scripts directly
3. Verify RLS policies are active

## Testing

### Manual Testing Checklist

- [ ] Sign up with each role type
- [ ] Confirm email and sign in
- [ ] Create job posting (employer)
- [ ] Apply to job (seeker)
- [ ] Send messages between users
- [ ] Update application status (employer)
- [ ] Browse support services
- [ ] Test role-based access control

## Future Enhancements

- Real-time messaging with Supabase Realtime
- File upload for resumes (Supabase Storage)
- Email notifications for applications
- Advanced search with full-text search
- Analytics dashboard for admins
- Mobile app (React Native)
- API webhooks for integrations
- Automated testing suite
- Performance monitoring

## License

[License information to be added]

## Support

For questions or support, please contact [contact information to be added]

---

Built with ❤️ to support second chances and successful reintegration.
