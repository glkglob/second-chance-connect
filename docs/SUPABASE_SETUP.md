# Supabase Setup Guide

## Required Environment Variables

You need to add the following environment variables to your project:

### 1. Add Environment Variables in v0

Go to the **Vars** section in the in-chat sidebar and add:

**SUPABASE_NEXT_PUBLIC_SUPABASE_URL**
- Get this from your Supabase project dashboard: Settings → API → Project URL
- Example: `https://xxxxxxxxxxxxx.supabasSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY**
- Get this from your Supabase project dashboard: Settings → API → Project API keys → `anon` `public`
- This is a public key that's safe to use in the browser

### 2. Run Database Migrations

Execute the SQL scripts in order through the v0 interface:

1. `scripts/001_create_tables.sql` - Creates all database tables
2. `scripts/002_enable_rls.sql` - Enables Row Level Security policies
3. `scripts/003_create_profile_trigger.sql` - Auto-creates user profiles on signup
4. `scripts/004_seed_data.sql` - Adds demo data (optional)

### 3. Verify Setup

After adding the environment variables and running the migrations:

1. Refresh your preview
2. Try signing up at `/auth/sign-up`
3. Check that you can log in at `/auth/login`
4. Verify role-based access to dashboards

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are added in the Vars section
- Refresh the preview after adding variables

**Error: "relation 'profiles' does not exist"**
- Run the database migration scripts in order
- Check the Supabase dashboard to verify tables were created

**Can't access dashboard after login**
- Make sure the profile trigger script ran successfully
- Check that your user has a profile with the correct role in the `profiles` table
