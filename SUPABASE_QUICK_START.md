# Supabase Setup Quick Start

**Estimated Time:** 15-30 minutes  
**Difficulty:** Beginner-friendly  

---

## Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or sign in if you have an account
3. Click **"New Project"**
4. Fill in project details:
   - **Name:** `second-chance-connect`
   - **Database Password:** Create a strong password (save securely!)
   - **Region:** Choose closest to your users (e.g., `us-east-1` for US)
5. Click **"Create new project"**
6. Wait 2-5 minutes for provisioning to complete

---

## Step 2: Get API Keys

1. In Supabase dashboard, go to **Settings → API**
2. Copy the following values into your `.env.local`:

```env
# Copy from Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important:** The `NEXT_PUBLIC_*` prefix means these are public-facing keys (safe to expose). The database password and `service_role` key should stay private.

---

## Step 3: Apply Database Schema

In Supabase dashboard, go to **SQL Editor** and run each script in order:

### 3a. Run `001_create_tables.sql`

1. Click **"New Query"** in SQL Editor
2. Open `/scripts/001_create_tables.sql` from your project
3. Copy and paste the entire content
4. Click **"Run"** button
5. Expected result: ✅ Success (creates 6 tables: users, profiles, jobs, applications, messages, services)

### 3b. Run `002_enable_rls.sql`

1. Click **"New Query"** in SQL Editor
2. Open `/scripts/002_enable_rls.sql` from your project
3. Copy and paste the entire content
4. Click **"Run"** button
5. Expected result: ✅ Success (enables Row Level Security on all tables)

### 3c. Run `003_create_profile_trigger.sql`

1. Click **"New Query"** in SQL Editor
2. Open `/scripts/003_create_profile_trigger.sql` from your project
3. Copy and paste the entire content
4. Click **"Run"** button
5. Expected result: ✅ Success (creates trigger for auto-populating user profiles)

### 3d. Run `004_seed_data.sql` (Optional - for testing)

1. Click **"New Query"** in SQL Editor
2. Open `/scripts/004_seed_data.sql` from your project
3. Copy and paste the entire content
4. Click **"Run"** button
5. Expected result: ✅ Success (inserts sample jobs, employers, and services for testing)

---

## Step 4: Verify Setup

### In Supabase Dashboard:

1. Go to **Table Editor**
2. Verify you can see these tables:
   - ✅ `auth.users` (from Supabase Auth)
   - ✅ `public.profiles`
   - ✅ `public.jobs`
   - ✅ `public.applications`
   - ✅ `public.messages`
   - ✅ `public.services`

3. Each table should show:
   - **Columns:** Correct fields as per schema
   - **RLS Enabled:** Toggle should be ON (indicated by lock icon)

### In Your Application:

1. Update `.env.local` with Supabase keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

2. Start dev server:
```bash
npm run dev
```

3. Navigate to `http://localhost:3000/auth/sign-up`

4. Try signing up with test data:
   - **Name:** Test User
   - **Email:** test@example.com
   - **Password:** SecurePassword123!
   - **Role:** SEEKER (or choose your role)

5. Expected: Redirected to `/auth/sign-up-success` page

---

## Troubleshooting

### Error: "Failed to fetch from Supabase"
- [ ] Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Verify no trailing slash in URL (should be `https://xxxx.supabase.co`, not `https://xxxx.supabase.co/`)
- [ ] Restart dev server after updating `.env.local`

### Error: "CORS policy: Cross-Origin Request Blocked"
- [ ] Go to Supabase **Settings → API → CORS Allowed origins**
- [ ] Add `http://localhost:3000` to allowed origins
- [ ] In production, add your domain (e.g., `https://yourdomain.com`)

### Error: "No table named 'profiles'"
- [ ] Run SQL script `001_create_tables.sql` (creates all tables)
- [ ] Check in **Table Editor** that tables exist

### Error: "Permission denied for schema 'public'"
- [ ] Run SQL script `002_enable_rls.sql` (enables Row Level Security)
- [ ] Verify RLS toggle is ON for each table

### Error: "User profile not automatically created on signup"
- [ ] Run SQL script `003_create_profile_trigger.sql` (creates the trigger)
- [ ] Verify trigger exists in **SQL Editor → Triggers**

### Error: "Auth email verification not working"
- [ ] Go to Supabase **Authentication → Email Templates**
- [ ] Verify templates are configured
- [ ] For development, you can disable email verification in **Authentication → Providers → Email**

---

## Next Steps After Setup

1. ✅ Start application: `npm run dev`
2. ✅ Test authentication flow (sign-up → sign-in)
3. ✅ Verify API endpoints: `curl http://localhost:3000/api/jobs`
4. ✅ Check role-based redirects work correctly
5. ✅ Proceed to production deployment

---

## Commands Cheat Sheet

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Test API endpoint
curl http://localhost:3000/api/jobs

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Production Deployment

After testing locally, deploy to production:

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
# Add environment variables during deployment
```

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Add environment variables
4. Deploy

### Option 3: Docker/Self-Hosted
```bash
npm run build
docker build -t second-chance-connect .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  second-chance-connect
```

---

**Status:** Ready for database setup ✅  
**Need help?** Check `DEPLOYMENT_CHECKLIST.md` for detailed troubleshooting

