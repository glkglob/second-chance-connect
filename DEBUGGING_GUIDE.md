# Debugging Guide - Second Chance Connect

> **Role**: Senior full-stack engineer specializing in debugging and stabilizing Next.js 14 applications with Supabase integration.
>
> **Scope**: Error detection, logging, debugging, dependency fixes, and verification steps for production/staging environments.

---

## Error Overview

### Critical Issues Identified

1. **Dependency Conflict** - React 19 incompatibility with `vaul@0.9.9`
   - **Impact**: Prevents `npm install` without `--legacy-peer-deps` flag
   - **Severity**: High - Blocks clean dependency installation
   - **Status**: ⚠️ Requires fix

2. **Missing Environment Variables** - Supabase configuration undefined
   - **Impact**: Authentication features disabled, API calls fail
   - **Severity**: Critical - Core functionality broken
   - **Status**: ⚠️ Configuration required

3. **Build Failures** - Google Fonts network access blocked
   - **Impact**: Production builds fail in restricted environments
   - **Severity**: Medium - Deployment blocker in certain environments
   - **Status**: ⚠️ Needs graceful fallback

4. **TypeScript Configuration** - Mixed .jsx/.tsx files with inconsistent TypeScript usage
   - **Impact**: Potential runtime errors, type safety compromised
   - **Severity**: Medium - Technical debt
   - **Status**: ℹ️ Documented, non-blocking

---

## Root Cause Analysis

### 1. Dependency Conflict

**Error Message:**
```
ERESOLVE unable to resolve dependency tree
peer react@"^16.8 || ^17.0 || ^18.0" from vaul@0.9.9
Found: react@19.2.0
```

**Root Cause:**
- Project uses React 19.2.0 (latest)
- `vaul` package (drawer component) only supports React 16-18
- npm peer dependency resolution fails

**Technical Details:**
- `vaul@0.9.9` has strict peer dependency requirements
- React 19 introduces breaking changes in concurrent features
- Package maintainer hasn't updated for React 19 compatibility

**Workaround in Use:**
```bash
npm install --legacy-peer-deps
```

### 2. Missing Environment Variables

**Error Pattern:**
```javascript
// lib/supabase/client.js
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[v0] Supabase configuration invalid");
  return null;
}
```

**Root Cause:**
- No `.env.local` file in repository (correctly excluded by `.gitignore`)
- Required variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Runtime checks exist but no build-time validation

**Impact Chain:**
1. Supabase client returns `null`
2. Auth features silently disabled
3. API routes fail with 401 Unauthorized
4. Users see generic error messages

### 3. Build Failure - Font Loading

**Error Message:**
```
Failed to compile.
`next/font` error:
Failed to fetch `Inter` from Google Fonts.
getaddrinfo ENOTFOUND fonts.googleapis.com
```

**Root Cause:**
- `app/layout.jsx` imports `Inter` font from Google Fonts
- Build process attempts network request to fonts.googleapis.com
- Fails in network-restricted environments (CI/CD, firewalls, offline builds)

**Affected Code:**
```javascript
// app/layout.jsx
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"] })
```

### 4. File Extension Inconsistencies

**Pattern:**
- App routes: All `.jsx` but use TypeScript syntax
- Components: Mix of `.jsx` (shared) and `.tsx` (UI)
- Hooks: All `.js` files

**Example:**
```javascript
// app/auth/login/page.jsx - .jsx extension but TypeScript syntax
export default function LoginPage() {
  const router = useRouter() // TypeScript types expected
  // ...
}
```

**Impact:**
- No build errors (allowJs: true in tsconfig.json)
- Inconsistent type checking across files
- Developer confusion about which syntax to use

---

## Fix Recommendations

### Fix 1: Resolve Dependency Conflict

**Option A: Update vaul (Recommended)**
```bash
# Check for React 19 compatible version
npm info vaul versions
npm install vaul@latest --legacy-peer-deps
```

**Option B: Replace vaul**
```bash
# Use Radix UI Dialog or Sheet instead
npm uninstall vaul
npm install @radix-ui/react-dialog
```

**Option C: Temporary - Use legacy peer deps**
```json
// package.json
{
  "scripts": {
    "install": "npm install --legacy-peer-deps"
  }
}
```

### Fix 2: Environment Variable Validation

**Create `lib/config.ts`:**
```typescript
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
})

export function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map(e => e.path.join('.')).join(', ')
      throw new Error(
        `Missing or invalid environment variables: ${missing}\n` +
        `Please check your .env.local file.`
      )
    }
    throw error
  }
}
```

**Usage in API routes:**
```typescript
// app/api/jobs/route.js
import { validateEnv } from '@/lib/config'

export async function GET(request) {
  try {
    validateEnv() // Throws descriptive error if invalid
    // ... rest of handler
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### Fix 3: Font Loading Resilience

**Update `app/layout.jsx`:**
```javascript
import { Inter } from "next/font/google"

// Add fallback configuration
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

**Alternative - Local Font:**
```javascript
// Download Inter and place in /public/fonts/
import localFont from 'next/font/local'

const inter = localFont({
  src: '../public/fonts/Inter-Variable.woff2',
  display: 'swap',
  variable: '--font-inter',
})
```

### Fix 4: Enhanced Error Handling

**Create `lib/api-error.ts`:**
```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      details: process.env.NODE_ENV === 'development' ? this.details : undefined,
    }
  }
}

export function handleAPIError(error: unknown) {
  console.error('[v0] API Error:', error)

  if (error instanceof APIError) {
    return NextResponse.json(error.toJSON(), { status: error.statusCode })
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors,
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    },
    { status: 500 }
  )
}
```

---

## Debugging Workflow

### Step 1: Local Environment Setup

**Create `.env.local`:**
```bash
# Required - Get from Supabase Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional - Development debugging
NEXT_PUBLIC_DEBUG=true
NODE_ENV=development
```

**Install dependencies:**
```bash
npm install --legacy-peer-deps
```

### Step 2: Enable Debug Mode

**Set environment variable:**
```bash
export NEXT_PUBLIC_DEBUG=true
```

**Add to Supabase client:**
```javascript
// lib/supabase/client.js
const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true'

if (DEBUG) {
  console.log('[v0] Client initialized', {
    url: supabaseUrl?.substring(0, 30),
    hasKey: !!supabaseAnonKey,
  })
}
```

### Step 3: Test API Endpoints

**Using Next.js DevTools:**
```bash
npm run dev
# Open http://localhost:3000
```

**Test authentication:**
```bash
# Terminal
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Test jobs API:**
```bash
curl http://localhost:3000/api/jobs \
  -H "Cookie: sb-access-token=YOUR_TOKEN"
```

### Step 4: Supabase Logging

**Enable Supabase logs:**
1. Open Supabase Dashboard
2. Navigate to Logs → Postgres Logs
3. Filter by table: `jobs`, `applications`, `profiles`
4. Check for RLS policy denials

**Common issues:**
- 401 errors → Check auth token in cookies
- 403 errors → Review RLS policies
- 500 errors → Check Postgres logs for query errors

### Step 5: Browser DevTools

**Console checks:**
```javascript
// Check Supabase client status
console.log('Supabase client:', window.supabase)

// Check auth state
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// Test query
const { data, error } = await supabase.from('jobs').select('*').limit(1)
console.log('Query result:', { data, error })
```

**Network tab:**
- Filter: `api/`
- Look for: 401 Unauthorized, 500 Internal Server Error
- Check response bodies for error details

### Step 6: TypeScript Compiler

**Run type checking:**
```bash
npx tsc --noEmit
```

**Common errors:**
- Module not found → Check import paths
- Type mismatch → Verify Supabase types in `lib/types/database.ts`
- Cannot find name → Missing type declarations

---

## Verification Checklist

### Pre-Deployment Checks

- [ ] **Environment variables set** - All required vars in `.env.local`
- [ ] **Dependencies installed** - `npm install` completes without errors
- [ ] **Build succeeds** - `npm run build` completes successfully
- [ ] **No TypeScript errors** - `npx tsc --noEmit` passes
- [ ] **Linter passes** - `npm run lint` (ignore .next/ errors)

### Authentication Flow

- [ ] **Sign up** - Create account with each role (SEEKER, EMPLOYER, OFFICER, ADMIN)
- [ ] **Email confirmation** - Receive and click confirmation link
- [ ] **Sign in** - Login redirects to correct dashboard based on role
- [ ] **Protected routes** - Unauthenticated users redirected to login
- [ ] **Role enforcement** - Users cannot access other roles' dashboards

### API Endpoints

- [ ] **GET /api/jobs** - Returns active jobs, respects filters
- [ ] **POST /api/jobs** - Employers can create, seekers cannot
- [ ] **GET /api/applications** - Returns user-specific applications
- [ ] **POST /api/applications** - Seekers can apply, prevents duplicates
- [ ] **GET /api/messages** - Returns user conversations
- [ ] **POST /api/messages** - Can send messages, prevents self-messaging

### Error Handling

- [ ] **Missing env vars** - Shows helpful error message
- [ ] **API errors** - Returns structured JSON with error details
- [ ] **Network failures** - Displays user-friendly error in UI
- [ ] **Validation errors** - Shows field-specific error messages
- [ ] **401 Unauthorized** - Redirects to login page
- [ ] **403 Forbidden** - Shows permission denied message

### Performance

- [ ] **Page load** - < 3 seconds on 3G network
- [ ] **API response** - < 500ms for basic queries
- [ ] **No console errors** - Clean console in production mode
- [ ] **No memory leaks** - Profile with Chrome DevTools
- [ ] **Lighthouse score** - > 80 for Performance, Accessibility

### Security

- [ ] **RLS enabled** - All tables have Row Level Security
- [ ] **No exposed secrets** - No API keys in client-side code
- [ ] **HTTPS only** - Production uses secure connections
- [ ] **CORS configured** - API endpoints restrict origins
- [ ] **SQL injection** - Parameterized queries only

---

## Common Errors & Solutions

### Error: "Unauthorized" on API calls

**Symptoms:**
- API returns 401 status
- User is logged in but API rejects requests

**Diagnosis:**
```javascript
// Check auth state
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session) // Should not be null
```

**Solutions:**
1. Clear cookies and re-login
2. Check middleware isn't blocking routes
3. Verify Supabase URL/key are correct
4. Check session expiration (default 1 hour)

### Error: "Failed to fetch jobs"

**Symptoms:**
- Empty job list
- 500 error in network tab

**Diagnosis:**
```bash
# Check Supabase logs
# Look for RLS policy denials or query syntax errors
```

**Solutions:**
1. Verify RLS policies allow SELECT on jobs table
2. Check user has valid session
3. Run query directly in Supabase SQL Editor
4. Check for foreign key constraint issues

### Error: Build fails with font error

**Symptoms:**
- Build process hangs or fails
- Error mentions fonts.googleapis.com

**Solutions:**
1. Use `fallback` option in font config
2. Switch to local fonts
3. Add network proxy configuration
4. Use system fonts as fallback

### Error: React version conflict

**Symptoms:**
- `npm install` fails
- Peer dependency warnings

**Solutions:**
```bash
# Option 1: Use legacy peer deps
npm install --legacy-peer-deps

# Option 2: Update package
npm update vaul --legacy-peer-deps

# Option 3: Remove incompatible package
npm uninstall vaul
```

---

## Development Tools

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Tailwind CSS IntelliSense** - Autocomplete for Tailwind
- **Prettier** - Code formatting
- **ESLint** - Linting
- **Supabase** - Database schema visualization

### Debugging Scripts

**Add to `package.json`:**
```json
{
  "scripts": {
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    "type-check": "tsc --noEmit",
    "lint:fix": "eslint . --fix",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### Browser Extensions

- **React Developer Tools** - Component inspection
- **Redux DevTools** - State management debugging
- **Supabase Toolkit** - Database query builder

---

## Additional Resources

### Official Documentation

- [Next.js 14 Debugging](https://nextjs.org/docs/app/building-your-application/configuring/debugging)
- [Supabase Logs](https://supabase.com/docs/guides/platform/logs)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)

### Debugging Tools

- **Next.js DevTools** - Built-in performance profiler
- **Supabase Studio** - Database management UI
- **Chrome DevTools** - Network, console, performance tabs

### Best Practices

1. **Always validate environment variables** at application start
2. **Use structured logging** with consistent prefixes (`[v0]`)
3. **Return specific error messages** in development mode
4. **Enable source maps** for production debugging
5. **Monitor API response times** with performance marks

---

## Contact & Support

For unresolved issues:

1. Check [GitHub Issues](https://github.com/bischoff99/v0-second-chance-connect/issues)
2. Review [Supabase Community](https://github.com/supabase/supabase/discussions)
3. Consult [Next.js Discord](https://discord.gg/nextjs)

**Last Updated:** October 2025  
**Maintained By:** Development Team
