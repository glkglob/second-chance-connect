# SQL Schema Deployment Guide

## 🚀 Deploy Your Database Schema to Supabase

Your Second Chance Connect application is ready. Now you need to deploy the database schema. Choose your preferred method below:

---

## ✅ Method 1: Supabase Dashboard (Recommended - Easiest)

### Step-by-Step Instructions

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project: `ymjjvgzyhtdmqianuqse`

2. **Navigate to SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Deploy Schema Files** (in this order)

   ### Step 1: Create Tables
   - Copy all content from: `scripts/001_create_tables.sql`
   - Paste into the SQL editor
   - Click **Run** button ▶️
   - Wait for ✅ confirmation

   ### Step 2: Enable Row Level Security
   - Click **New Query** again
   - Copy all content from: `scripts/002_enable_rls.sql`
   - Paste into the SQL editor
   - Click **Run** button ▶️
   - Wait for ✅ confirmation

   ### Step 3: Create Profile Trigger
   - Click **New Query** again
   - Copy all content from: `scripts/003_create_profile_trigger.sql`
   - Paste into the SQL editor
   - Click **Run** button ▶️
   - Wait for ✅ confirmation

4. **Verify in Table Editor**
   - Click **Table Editor** in left sidebar
   - You should see these new tables:
     - ✅ profiles
     - ✅ jobs
     - ✅ applications
     - ✅ messages
     - ✅ services

---

## 🔧 Method 2: PostgreSQL CLI (psql)

### Prerequisites
- PostgreSQL installed (`psql` command available)
- Supabase database password

### Instructions

1. **Get Your Database Password**
   - Supabase Dashboard → Settings → Database
   - Copy the "Password" field

2. **Run SQL Scripts**
   \`\`\`bash
   # Replace [PASSWORD] with your actual password
   
   psql "postgresql://postgres:[PASSWORD]@db.ymjjvgzyhtdmqianuqse.supabase.co:5432/postgres" < scripts/001_create_tables.sql
   
   psql "postgresql://postgres:[PASSWORD]@db.ymjjvgzyhtdmqianuqse.supabase.co:5432/postgres" < scripts/002_enable_rls.sql
   
   psql "postgresql://postgres:[PASSWORD]@db.ymjjvgzyhtdmqianuqse.supabase.co:5432/postgres" < scripts/003_create_profile_trigger.sql
   \`\`\`

3. **Verify Success**
   \`\`\`bash
   curl http://localhost:3000/api/health | jq .
   \`\`\`

---

## 📦 Method 3: Supabase CLI (Advanced)

### Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Supabase database password

### Instructions

1. **Authenticate**
   \`\`\`bash
   supabase login
   \`\`\`

2. **Link Your Project**
   \`\`\`bash
   supabase link --project-ref ymjjvgzyhtdmqianuqse
   \`\`\`
   When prompted, enter your database password.

3. **Push Migrations**
   \`\`\`bash
   # Preview changes first
   supabase db push --dry-run
   
   # Deploy to remote database
   supabase db push
   \`\`\`

---

## ✅ Verification Steps

After deploying the schema using any method above:

### 1. Check API Health
\`\`\`bash
curl http://localhost:3000/api/health | jq .
\`\`\`

Expected response:
\`\`\`json
{
  "status": "healthy",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection successful"
    }
  }
}
\`\`\`

### 2. Verify Tables in Supabase
- Supabase Dashboard → Table Editor
- You should see: profiles, jobs, applications, messages, services

### 3. Test Authentication Flow
- Visit http://localhost:3000/auth/sign-up
- Create a test account
- Verify you're redirected to the dashboard

---

## 📋 What Each Script Does

### 001_create_tables.sql (86 lines)
- Creates 5 main tables:
  - `profiles` - User profiles with roles
  - `jobs` - Job postings
  - `applications` - Job applications
  - `messages` - Direct messaging
  - `services` - Reintegration services
- Creates enums for roles and statuses
- Creates indexes for performance

### 002_enable_rls.sql (88 lines)
- Enables Row Level Security (RLS) on all tables
- Creates security policies for:
  - Profile viewing/updating
  - Job browsing/creation
  - Application management
  - Messaging
  - Service access

### 003_create_profile_trigger.sql (59 lines)
- Auto-creates user profile on signup
- Adds timestamp triggers for updated_at

---

## 🆘 Troubleshooting

### Error: "Password authentication failed"
- Verify you have the correct database password
- Try resetting it in Supabase → Settings → Database

### Error: "Table already exists"
- Tables may have been created partially
- Safe to re-run - scripts use "CREATE TABLE IF NOT EXISTS"

### Error: "Role doesn't exist"
- This is normal during first deployment
- Run scripts again - enums will be created

### No tables showing in Table Editor
- Wait 30 seconds and refresh
- Check Supabase logs: Dashboard → Logs

---

## 🎯 Next Steps

After successful deployment:

1. **Test Application**
   - Sign up at http://localhost:3000/auth/sign-up
   - Try different roles (SEEKER, EMPLOYER, OFFICER, ADMIN)
   - Explore dashboards

2. **Add Sample Data** (Optional)
   - Run: `scripts/004_seed_data.sql` in SQL Editor
   - Creates test jobs and services

3. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel
   - See DEPLOYMENT_CHECKLIST.md

---

## 📞 Need Help?

- **Setup Issues**: See SETUP.md
- **Database Questions**: See SUPABASE_QUICK_START.md
- **Debugging**: See DEBUGGING_GUIDE.md

Happy coding! 🚀
