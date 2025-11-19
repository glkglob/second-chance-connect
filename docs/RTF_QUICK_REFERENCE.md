# Quick Reference — RTF Continuation Prompt

**Repository:** v0-second-chance-connect  
**Status:** Production-ready, database setup pending  
**Format:** RTF JSON prompt for AI development continuation  

---

## 📋 Fast Access

### Main Documents
- **Full JSON Prompt:** `/docs/RTF_CONTINUATION_PROMPT.json`
- **Readable Guide:** `/docs/RTF_CONTINUATION_GUIDE.md`
- **This Quick Ref:** `/docs/RTF_QUICK_REFERENCE.md`

### Critical Next Actions
1. **Database Setup** (15-30 min) → Create Supabase project, apply SQL scripts
2. **Auth Testing** (15-20 min) → Test sign-up/login flows for all roles
3. **API Testing** (20-30 min) → Validate CRUD operations and RLS policies
4. **Deploy** (10-15 min) → Launch to Vercel with HTTPS

---

## 🏗️ Architecture Summary

\`\`\`
Next.js 14 App Router
├── Frontend: 37+ pages, 70+ components
├── API: 8 RESTful endpoints with auth guards
├── Auth: Supabase Auth + middleware protection
├── Database: PostgreSQL with Row Level Security
├── Styling: Tailwind CSS v4 + shadcn/ui
└── Deploy: Vercel (recommended)
\`\`\`

**Roles:** SEEKER → EMPLOYER → OFFICER → ADMIN  
**Security:** RLS policies + middleware + auth guards

---

## 🎯 Current State

| Component | Status |
|-----------|--------|
| Frontend UI | ✅ Complete |
| Components | ✅ 70+ ready |
| API Routes | ✅ 8 endpoints |
| Auth Flow | ✅ Configured |
| Database | ⏳ Needs setup |
| Testing | ⏳ Not done |
| Deployment | ⏳ Not done |

---

## 🚨 Critical Gaps

1. **Database not provisioned** → Blocks all data operations
2. **Env vars not set** → Supabase connection fails
3. **No E2E testing** → Auth flows unverified
4. **Not deployed** → Users can't access

---

## 🔧 Quick Commands

\`\`\`bash
# Install dependencies (React 19 compat)
npm install --legacy-peer-deps

# Start dev server
npm run dev

# Build production
npm run build

# Test API endpoint
curl http://localhost:3000/api/jobs
\`\`\`

---

## 📊 Component Dependencies

\`\`\`
Auth Flow:
  /auth/login → Supabase Auth → middleware.js → Role redirect

API Layer:
  Client → Custom hooks → API routes → Supabase server → Database (RLS)

Protected Routes:
  User request → middleware.js → Check auth → Check role → Allow/Deny
\`\`\`

---

## ✅ Testing Checklist

- [ ] Sign up as SEEKER, EMPLOYER, OFFICER, ADMIN
- [ ] Verify email confirmation works
- [ ] Test role-based dashboard access
- [ ] Create job posting (EMPLOYER)
- [ ] Apply to job (SEEKER)
- [ ] Send messages between users
- [ ] Verify RLS blocks unauthorized access
- [ ] Test logout and session clearing

---

## 🔐 Environment Variables Required

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
\`\`\`

Get from: Supabase Dashboard → Settings → API

---

## 📁 Critical Files

**Must Read:**
- `.github/copilot-instructions.md` — AI agent guidance
- `DEPLOYMENT_CHECKLIST.md` — Step-by-step setup
- `middleware.js` — Route protection logic
- `lib/supabase/client.js` — Browser client
- `lib/supabase/server.js` — Server client

**Database:**
- `scripts/001_create_tables.sql` — Table definitions
- `scripts/002_enable_rls.sql` — Security policies
- `scripts/003_create_profile_trigger.sql` — Auto-profile

---

## 🐛 Quick Troubleshooting

**Build fails:**
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

**Auth not working:**
- Check env vars are set in `.env.local`
- Verify Supabase Auth is enabled
- Check user role in profiles table

**API returns 401:**
- User not authenticated
- Missing session cookie
- Check middleware logs

**RLS blocks query:**
- User doesn't have permission
- Check RLS policies in Supabase
- Verify user role matches policy

---

## 🎓 Code Conventions

| Type | Extension | Example |
|------|-----------|---------|
| App routes | `.jsx` | `app/dashboard/page.jsx` |
| UI components | `.tsx` | `components/ui/button.tsx` |
| Utilities | `.ts` | `lib/utils.ts` |
| Hooks | `.js` | `lib/hooks/use-jobs.js` |

**Always:**
- Use `@/` for absolute imports
- Import Supabase from `lib/supabase/*`
- Apply Tailwind classes (no CSS files)
- Return proper HTTP status codes

---

## 🚀 Success Criteria

| Metric | Target | Current |
|--------|--------|---------|
| Build time | <30s | 16.5s ✅ |
| Build errors | 0 | 0 ✅ |
| API endpoints | ≥4 | 8 ✅ |
| Pages | ≥30 | 37 ✅ |
| Database | Ready | Not yet ⏳ |
| Auth tested | Pass | Not yet ⏳ |
| Deployed | Live | Not yet ⏳ |

---

## 📈 Next Phase After Database Setup

### Immediate (Week 1-2)
- File uploads (resumes, photos)
- Email notifications
- Real-time messaging

### Short-term (Week 3-4)
- Advanced job search
- Analytics dashboard
- PDF resume generation

### Medium-term (Month 2-3)
- Automated testing
- Performance optimization
- Mobile app (React Native)

---

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com

---

## 🎯 Start Here

1. Open `docs/RTF_CONTINUATION_GUIDE.md` for full context
2. Follow Phase 1: Database Setup (30 min)
3. Execute Phase 2: Auth Testing (20 min)
4. Complete Phase 3: API Testing (30 min)
5. Deploy Phase 4: Production (15 min)

**Total Time to Production:** ~2 hours

---

**Document Version:** 1.0  
**Generated:** October 22, 2025  
**JSON Source:** `docs/RTF_CONTINUATION_PROMPT.json`
