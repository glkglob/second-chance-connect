# Vercel KV Setup Guide

This guide will help you set up Vercel KV (Redis) for rate limiting in your Second Chance Connect application.

## Quick Setup (Automated)

Run the setup script:

```bash
./scripts/setup-vercel-kv.sh
```

This script will:
1. ✅ Install Vercel CLI (if needed)
2. ✅ Log you into Vercel
3. ✅ Link your project
4. ✅ Guide you through KV database creation
5. ✅ Pull environment variables
6. ✅ Verify setup

---

## Manual Setup (Alternative)

If you prefer to set up manually:

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Your Project

```bash
cd /Users/capp/second-chance-connect
vercel link
```

Follow the prompts:
- Set up and deploy? **N** (No, just link)
- Which scope? Choose your account
- Link to existing project? **Y** (Yes)
- What's the project name? **second-chance-connect**

### Step 4: Create KV Database

**Option A: Via Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Select your `second-chance-connect` project
3. Click **"Storage"** tab
4. Click **"Create Database"**
5. Select **"KV"**
6. Configure:
   - **Name:** `second-chance-connect-kv`
   - **Region:** `us-east-1` (or closest to your users)
7. Click **"Create"**
8. Click **"Connect"** to link to your project

**Option B: Via CLI**

```bash
vercel storage create kv
```

This will open your browser to complete the setup.

### Step 5: Pull Environment Variables

```bash
vercel env pull .env.local
```

This downloads all environment variables (including KV credentials) to `.env.local`.

### Step 6: Verify Setup

Check that `.env.local` contains:

```bash
cat .env.local | grep KV
```

Should show:
```
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

---

## Testing

### Test Locally

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test rate limiting:**
   ```bash
   ./scripts/test-rate-limit.sh
   ```

   Expected output:
   ```
   ✓ Request 1: Success
   ✓ Request 10: Success
   ...
   ✓ Request 100: Success
   🛑 Request 101: Rate Limited (HTTP 429)

   Test Result: ✅ PASS
   Rate limiting is working correctly! 🎉
   ```

3. **Manual test:**
   ```bash
   # Make a request
   curl http://localhost:3000/api/jobs

   # Check rate limit headers
   curl -I http://localhost:3000/api/jobs
   ```

   Headers should include:
   ```
   X-RateLimit-Limit: 100
   X-RateLimit-Remaining: 99
   X-RateLimit-Reset: 1234567890
   ```

### Test in Production

After deploying:

```bash
# Deploy to production
git push origin feature/production-readiness

# Test rate limiting
./scripts/test-rate-limit.sh https://your-app.vercel.app/api/jobs
```

---

## Rate Limit Configuration

Current limits set in `lib/rate-limiter.ts`:

| Endpoint Type | Limit | Window | Use Case |
|---------------|-------|--------|----------|
| **API** | 100 req | 1 minute | Jobs, Applications, Messages |
| **Auth** | 5 req | 1 minute | Sign-up, Login |
| **Public** | 200 req | 1 minute | Public pages |
| **Admin** | 500 req | 1 minute | Admin operations |

To modify limits, edit `lib/rate-limiter.ts`:

```typescript
export const rateLimitConfigs = {
  api: { interval: 60 * 1000, limit: 100 },    // Change limit here
  auth: { interval: 60 * 1000, limit: 5 },
  // ...
}
```

---

## Troubleshooting

### Issue: "KV_REST_API_URL is not defined"

**Cause:** Environment variables not loaded

**Solution:**
```bash
# Pull latest env vars
vercel env pull .env.local

# Restart dev server
npm run dev
```

### Issue: Rate limiting not working

**Symptoms:** All requests succeed, no 429 errors

**Solutions:**

1. **Check environment variables:**
   ```bash
   cat .env.local | grep KV
   ```

   Should show 3 KV variables. If not, pull again:
   ```bash
   vercel env pull .env.local
   ```

2. **Restart development server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Verify KV database exists:**
   - Go to Vercel Dashboard → Storage
   - Should see `second-chance-connect-kv`
   - Status should be "Active"

4. **Check API route has rate limiting:**
   ```bash
   grep -n "applyRateLimit" app/api/jobs/route.ts
   ```

   Should show rate limit calls at the start of GET and POST functions.

### Issue: "Failed to connect to Vercel KV"

**Cause:** Wrong credentials or network issue

**Solutions:**

1. **Verify credentials in Vercel dashboard:**
   - Go to Project → Settings → Environment Variables
   - Check KV variables exist for all environments

2. **Check network connectivity:**
   ```bash
   curl https://vercel.com
   ```

3. **Recreate KV database:**
   - Go to Dashboard → Storage
   - Delete old KV database
   - Create new one
   - Pull env vars again

### Issue: Rate limiting works locally but not in production

**Cause:** Environment variables not deployed

**Solution:**
```bash
# Redeploy with latest env vars
vercel --prod

# Or via git
git push origin main
```

Vercel automatically includes environment variables in deployments.

---

## Cost (Free Tier)

Vercel KV Free Tier includes:
- ✅ **256 MB** storage
- ✅ **10,000** commands/day
- ✅ **30** requests/second
- ✅ **3** databases

**Your usage:** ~100-500 commands/day (well within free tier)

**Upgrade needed when:** You exceed 10,000 commands/day (high traffic)

---

## Alternative: Upstash (If Not Using Vercel)

If you can't use Vercel KV, use Upstash Redis:

1. **Create account:** https://upstash.com
2. **Create Redis database**
3. **Copy credentials to `.env.local`:**
   ```bash
   KV_REST_API_URL=https://your-db.upstash.io
   KV_REST_API_TOKEN=your-token
   KV_REST_API_READ_ONLY_TOKEN=your-readonly-token
   ```

The code works with both Vercel KV and Upstash (they use the same API).

---

## Need Help?

If you encounter issues:

1. **Check logs:**
   ```bash
   # Local
   Check terminal where `npm run dev` is running

   # Production
   vercel logs
   ```

2. **Verify setup:**
   ```bash
   ./scripts/setup-vercel-kv.sh
   ```

3. **Test rate limiting:**
   ```bash
   ./scripts/test-rate-limit.sh
   ```

---

## Summary

✅ **Setup:** Run `./scripts/setup-vercel-kv.sh`
✅ **Test:** Run `./scripts/test-rate-limit.sh`
✅ **Deploy:** `git push origin feature/production-readiness`
✅ **Cost:** Free for your use case

Rate limiting protects your app from:
- DDoS attacks
- API abuse
- Brute force attempts
- Resource exhaustion

**You're all set! 🎉**
