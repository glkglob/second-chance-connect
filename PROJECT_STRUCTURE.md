# Second Chance Connect - Project Structure

## Directory Tree

\`\`\`
second-chance-connect/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx                    # Home page with hero and features
│   │   ├── about/page.tsx              # About page with mission and impact
│   │   ├── services/page.tsx           # Support services directory
│   │   └── register/page.tsx           # Registration wizard page
│   │
│   ├── (job seeker dashboard)
│   │   └── dashboard/
│   │       ├── layout.tsx              # Dashboard layout with sidebar
│   │       ├── page.tsx                # Main dashboard with stats & progress
│   │       ├── jobs/
│   │       │   ├── page.tsx            # Job listings with filters
│   │       │   └── loading.tsx         # Loading state
│   │       ├── applications/page.tsx   # Application tracker
│   │       ├── profile/page.tsx        # Profile management
│   │       ├── messages/
│   │       │   ├── page.tsx            # Messaging interface
│   │       │   └── loading.tsx         # Loading state
│   │       └── settings/page.tsx       # Account settings
│   │
│   ├── (employer dashboard)
│   │   └── employer/
│   │       ├── layout.tsx              # Employer layout
│   │       ├── dashboard/page.tsx      # Employer overview
│   │       ├── jobs/page.tsx           # Job posting management
│   │       ├── candidates/
│   │       │   ├── page.tsx            # Candidate browser
│   │       │   └── loading.tsx         # Loading state
│   │       ├── messages/
│   │       │   ├── page.tsx            # Employer messaging
│   │       │   └── loading.tsx         # Loading state
│   │       └── settings/page.tsx       # Company settings
│   │
│   ├── (officer dashboard)
│   │   └── officer/
│   │       ├── layout.tsx              # Officer layout
│   │       ├── dashboard/page.tsx      # Officer overview with alerts
│   │       ├── clients/
│   │       │   ├── page.tsx            # Client management
│   │       │   └── loading.tsx         # Loading state
│   │       ├── reports/page.tsx        # Report generation
│   │       ├── messages/
│   │       │   ├── page.tsx            # Officer messaging
│   │       │   └── loading.tsx         # Loading state
│   │       └── settings/page.tsx       # Officer settings
│   │
│   ├── (admin dashboard)
│   │   └── admin/
│   │       ├── layout.tsx              # Admin layout
│   │       ├── dashboard/page.tsx      # Platform overview with alerts
│   │       ├── users/
│   │       │   ├── page.tsx            # User management
│   │       │   └── loading.tsx         # Loading state
│   │       ├── jobs/
│   │       │   ├── page.tsx            # Job moderation
│   │       │   └── loading.tsx         # Loading state
│   │       ├── reports/page.tsx        # System reports
│   │       ├── content/page.tsx        # Content management
│   │       └── settings/page.tsx       # Platform settings
│   │
│   ├── layout.tsx                      # Root layout with Inter font
│   └── globals.css                     # Global styles with design tokens
│
├── components/
│   ├── (shared components)
│   │   ├── site-header.tsx             # Public site header
│   │   ├── site-footer.tsx             # Public site footer
│   │   ├── dashboard-header.tsx        # Dashboard header
│   │   ├── dashboard-nav.tsx           # Dashboard navigation
│   │   ├── page-header.tsx             # Page title component
│   │   ├── stat-card.tsx               # Statistics card
│   │   ├── job-card.tsx                # Job listing card
│   │   ├── progress-tracker.tsx        # Progress tracking widget
│   │   ├── alerts-feed.tsx             # Alerts notification feed
│   │   ├── registration-wizard.tsx     # Multi-step registration
│   │   ├── resume-builder.tsx          # Resume creation tool
│   │   └── theme-provider.tsx          # Dark mode provider
│   │
│   └── ui/                             # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── progress.tsx
│       ├── tabs.tsx
│       ├── ... (60+ components)
│       └── spinner.tsx
│
├── lib/
│   └── utils.ts                        # Utility functions (cn, etc.)
│
├── docs/
│   ├── DESIGN_TOKENS.md                # Design system documentation
│   └── PROJECT_STRUCTURE.md            # This file
│
├── tailwind.config.ts                  # Tailwind configuration
├── components.json                     # shadcn/ui config
├── tsconfig.json                       # TypeScript config
├── next.config.mjs                     # Next.js config
├── package.json                        # Dependencies
└── README.md                           # Setup instructions

\`\`\`

## Key Features by Dashboard

### Job Seeker Dashboard
- Profile completion tracker with progress visualization
- Job search with filters (location, type, salary)
- Application tracking with status badges
- Resume builder with multiple sections
- Messaging system for employer communication
- Comprehensive settings (account, notifications, preferences)

### Employer Dashboard
- Job posting management (create, edit, close)
- Candidate browsing and shortlisting
- Application review interface
- Messaging system for candidate communication
- Company profile management
- Tax credit information (WOTC)

### Officer Dashboard
- Client caseload overview with metrics
- Alerts feed for urgent client issues
- Check-in scheduling and tracking
- Employment status monitoring
- Report generation tools
- Client messaging system

### Admin Dashboard
- Platform-wide statistics and metrics
- User management (all roles)
- Job posting moderation queue
- System alerts feed
- Content management
- Platform configuration

## Design System

### Color Palette
- **Primary (Navy)**: #003366 - Trust, professionalism
- **Secondary (Light Blue)**: #4A90E2 - Hope, opportunity
- **Success (Green)**: For positive actions and status
- **Destructive (Red)**: For errors and urgent alerts
- **Muted**: For subtle backgrounds and secondary text

### Typography
- **Font Family**: Inter (sans-serif)
- **Headings**: Bold, tracking-tight
- **Body**: Regular, leading-relaxed
- **Small Text**: text-sm, text-muted-foreground

### Accessibility
- WCAG-AA compliant contrast ratios
- Semantic HTML elements (main, header, nav)
- ARIA labels and roles
- Keyboard navigation support
- Screen reader optimized
- 44px minimum touch targets

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Component Architecture

### Shared Components
All dashboards use consistent shared components:
- `DashboardNav` - Role-specific navigation
- `DashboardHeader` - User info and actions
- `StatCard` - Metric display with trends
- `PageHeader` - Page titles with actions
- `ProgressTracker` - Step-by-step progress
- `AlertsFeed` - Notification system

### Layout Pattern
\`\`\`tsx
<DashboardLayout>
  <DashboardNav items={roleNavItems} />
  <main>
    <PageHeader title="..." description="..." />
    <StatCards />
    <ContentCards />
  </main>
</DashboardLayout>
\`\`\`

## Next Steps

### Authentication Layer
- Implement Supabase Auth or NextAuth.js
- Add protected routes with middleware
- Role-based access control (RBAC)
- Session management

### Data Layer
- Set up Supabase or Neon PostgreSQL
- Create database schema (users, jobs, applications, messages)
- Implement Row Level Security (RLS)
- Add API routes for CRUD operations

### API Integration
- Job posting API endpoints
- Application submission handlers
- Messaging system backend
- File upload for resumes (Vercel Blob)
- Email notifications (Resend)

### Additional Features
- Real-time messaging with WebSockets
- Advanced job search with Algolia/Upstash
- Resume PDF generation
- Analytics dashboard with charts
- Email notification system
- Mobile app (React Native)
