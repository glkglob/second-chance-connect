<!--
Short, targeted instructions for AI coding agents working on the Second Chance Connect repo.
Keep entries concrete and reference repository files so agents can act without asking for basics.
-->

# Copilot instructions — Second Chance Connect

This file contains comprehensive, actionable guidance for an automated coding agent to be immediately productive in this repository.

## 1. Architecture & Tech Stack
- **App**: Next.js 14 (App Router) with mixed TypeScript/JavaScript + Supabase (Postgres) backend. See `README.md`, `IMPLEMENTATION_SUMMARY.md` and `PROJECT_STRUCTURE.md`.
- **UI**: Tailwind v4 + shadcn/ui components in `components/ui/` (TypeScript) and shared components in `components/` (JavaScript).
- **Auth & data**: Supabase Auth + Row Level Security (RLS). Client/server helpers are in `lib/supabase/`.

## 2. Critical Files to Read Before Changes
- **Route protection**: `lib/supabase/middleware.js` and top-level `middleware.js` (invokes `updateSession`).
- **Supabase clients**: browser client `lib/supabase/client.js` and server client `lib/supabase/server.js` (use these helpers for ALL DB/API code).
- **SQL schema**: `scripts/001_create_tables.sql`, `002_enable_rls.sql`, `003_create_profile_trigger.sql`.
- **Layouts**: `app/layout.jsx` and per-role layouts under `app/{dashboard,employer,officer,admin}/layout.jsx`.

## 3. Environment & Commands
- **Required env vars**: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (see guards in `lib/supabase/*`).
- **Commands**: `npm run dev`, `npm run build`, `npm run lint`
- **Package manager**: Uses pnpm (see `pnpm-lock.yaml`). Use `npm` commands but be aware dependencies were installed with pnpm.

## 4. File Extension & Import Patterns ⚠️
**CRITICAL INCONSISTENCY**: The codebase mixes JavaScript and TypeScript inconsistently:
- **App routes**: All `.jsx` files but some use TypeScript syntax (`import type React`)
- **Components**: Mix of `.jsx` (shared components) and `.tsx` (ui components)
- **Hooks**: All `.js` files (no TypeScript)
- **Utils**: BOTH `utils.js` AND `utils.ts` exist
- **Theme provider**: BOTH `.jsx` AND `.tsx` versions exist

**Rule**: When adding files, match the extension pattern of the directory:
- `app/**` → `.jsx` (even if using TypeScript syntax)
- `components/ui/**` → `.tsx` 
- `components/**` (shared) → `.jsx`
- `lib/hooks/**` → `.js`

## 5. Missing Critical Infrastructure ⚠️
- **No API routes**: All hooks in `lib/hooks/` call `/api/*` endpoints that don't exist yet
- **No auth pages backend**: Login/signup forms exist but need Supabase Auth integration
- **No database**: SQL scripts exist but need to be applied to create tables
- **TypeScript errors**: `.jsx` files use TypeScript syntax causing potential build issues

## 6. Project Patterns & Conventions
- **Role-based dashboards**: URLs are role-prefixed — `/dashboard` (SEEKER), `/employer`, `/officer`, `/admin`. Middleware enforces role checks by reading `profiles.role`.
- **Supabase usage**: ALWAYS use `createServerClient` in server code and `createBrowserClient` in client code. Never create clients directly.
- **Middleware flow**: `middleware.js` → `lib/supabase/middleware.js` → cookie manipulation. Preserve this chain.
- **Loading states**: Use `loading.jsx` in route folders (see existing patterns in `/dashboard/jobs/loading.jsx`).
- **Component structure**: PageHeader + StatCard + main content cards is the standard layout pattern.

## 7. Common Errors to Avoid
- **TypeScript in .jsx files**: Files like `app/auth/login/page.jsx` use `import type` and TypeScript syntax but have `.jsx` extension
- **Duplicate utilities**: Don't create new utils — use existing `utils.js` OR `utils.ts` (choose consistently)  
- **Direct Supabase imports**: Never `import { createClient } from '@supabase/supabase-js'` — always use the helpers in `lib/supabase/`
- **Missing auth checks**: All dashboard routes must check authentication in middleware
- **Bypassing RLS**: Never disable RLS — all database access should respect row-level security

## 8. How to Add API Routes (Examples)
\`\`\`javascript
// app/api/jobs/route.js
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabase.from('jobs').select('*')
  return NextResponse.json({ jobs: data })
}
\`\`\`

## 9. Database & Migrations
- **Raw SQL scripts**: Apply `scripts/` files in order (001, 002, 003, 004) when provisioning DB
- **No migration tool**: Changes require manual SQL script updates
- **RLS required**: All tables MUST have Row Level Security enabled

## 10. Component Guidelines
- **Shared components** (`components/`): Use `.jsx`, import from `@/components/ui/*`
- **UI primitives** (`components/ui/`): Use `.tsx`, follow shadcn/ui patterns
- **Icons**: Import from `lucide-react`, use consistent naming (e.g., `PlusIcon`, not `Plus`)
- **Styling**: Tailwind utilities only, use design tokens from `globals.css`

## 11. Hook & Data Fetching
- **Existing hooks**: `use-jobs.js`, `use-applications.js`, `use-messages.js`, `use-services.js`
- **Pattern**: All hooks call `/api/*` routes (which need to be created)
- **Error handling**: All hooks include `isLoading`, `error`, and `refetch` states
- **Add new hooks to `lib/hooks/`**, don't create inline data fetching

## 12. Authentication Flow
- **Login**: `app/auth/login/page.jsx` exists with Supabase client calls
- **Role routing**: After login, redirect based on `profiles.role` (SEEKER → `/dashboard`, etc.)
- **Protection**: `middleware.js` blocks unauthenticated users from dashboard routes
- **User context**: Use `components/auth-button.jsx` pattern for user state

## 13. Quick Fixes for Immediate Issues
1. **Fix TypeScript syntax in .jsx files**: Remove `import type` or rename files to `.tsx`
2. **Create missing API routes**: All hooks expect `/api/jobs`, `/api/applications`, etc.
3. **Remove duplicate files**: Choose between `utils.js`/`utils.ts`, `theme-provider.jsx`/`.tsx`
4. **Add env var validation**: Follow pattern in `lib/supabase/client.js` for required vars

## 14. Testing & Validation
- **Build check**: `npm run build` will surface TypeScript errors from mixed extensions
- **Lint**: `npm run lint` (ESLint ignored in build but keep code clean)
- **Runtime**: Missing Supabase env vars will cause auth failures — set up Supabase project first

## 15. When to Ask for Human Help
- **Database schema changes**: Modifying SQL scripts in `scripts/` requires DB access
- **Role flow changes**: Affecting multiple dashboards needs UX approval  
- **Environment setup**: Supabase project creation and env var configuration
- **TypeScript migration**: Deciding on consistent file extension strategy

## 16. Documentation Updates
- **Feature additions**: Update `IMPLEMENTATION_SUMMARY.md`
- **DB changes**: Document in `SETUP.md` and update SQL scripts
- **New patterns**: Add examples to this file

**Priority fixes needed**: Create missing API routes, resolve TypeScript/JavaScript file extension inconsistency, apply database schema, set up Supabase Auth integration.
