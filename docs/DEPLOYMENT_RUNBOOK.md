# Deployment Runbook

## Overview

This runbook provides step-by-step instructions for deploying Second Chance Connect to production. It covers initial deployment, updates, rollbacks, and troubleshooting.

## Prerequisites

### Required Accounts
- [ ] Vercel account (recommended) or alternative hosting
- [ ] Supabase account with project created
- [ ] GitHub account with repository access
- [ ] Domain name (optional, but recommended)

### Required Access
- [ ] Repository write access
- [ ] Vercel project admin access
- [ ] Supabase project admin access
- [ ] DNS management access (if using custom domain)

### Required Tools
\`\`\`bash
# Vercel CLI
npm install -g vercel

# Supabase CLI (optional)
npm install -g supabase

# Git
git --version
\`\`\`

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] Linter passes (`npm run lint`)
- [ ] TypeScript compilation succeeds (`npm run type-check`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No sensitive data in code

### Database
- [ ] SQL scripts validated
- [ ] RLS policies tested
- [ ] Backup strategy defined
- [ ] Connection strings secured

### Configuration
- [ ] Environment variables documented
- [ ] `.env.example` up to date
- [ ] Secrets rotated (if needed)
- [ ] Feature flags configured

### Documentation
- [ ] README updated
- [ ] API docs current
- [ ] Changelog updated
- [ ] Release notes prepared

## Initial Deployment

### Step 1: Prepare Supabase

1. **Create Supabase Project**
   \`\`\`bash
   # Via Supabase Dashboard
   1. Go to https://app.supabase.com
   2. Click "New Project"
   3. Fill in project details
   4. Wait for provisioning (2-3 minutes)
   \`\`\`

2. **Run Database Migrations**
   \`\`\`sql
   -- In Supabase SQL Editor, run scripts in order:
   -- 1. scripts/001_create_tables.sql
   -- 2. scripts/002_enable_rls.sql
   -- 3. scripts/003_create_profile_trigger.sql
   -- 4. scripts/004_seed_data.sql (optional)
   \`\`\`

3. **Verify RLS**
   \`\`\`sql
   -- Check RLS is enabled
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   
   -- Should return rowsecurity = true for all tables
   \`\`\`

4. **Get Connection Details**
   \`\`\`bash
   # From Supabase Dashboard > Settings > API
   # Save these for environment variables:
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (keep secret!)
   \`\`\`

### Step 2: Configure Vercel

1. **Connect Repository**
   \`\`\`bash
   # Option A: Via Vercel Dashboard
   1. Go to https://vercel.com/dashboard
   2. Click "Add New Project"
   3. Import Git Repository
   4. Select your GitHub repo
   
   # Option B: Via CLI
   vercel link
   \`\`\`

2. **Set Environment Variables**
   \`\`\`bash
   # Via Vercel Dashboard
   Project Settings > Environment Variables
   
   # Add the following:
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (Production only)
   NODE_ENV=production
   
   # Optional:
   NEXT_PUBLIC_SENTRY_DSN=https://...
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   \`\`\`

3. **Configure Build Settings**
   \`\`\`bash
   # In vercel.json or Vercel Dashboard
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Development Command: npm run dev
   Node.js Version: 18.x
   \`\`\`

### Step 3: Initial Deploy

1. **Deploy to Production**
   \`\`\`bash
   # Option A: Via Git Push
   git checkout main
   git pull origin main
   git push origin main
   # Vercel automatically deploys
   
   # Option B: Via CLI
   vercel --prod
   \`\`\`

2. **Verify Deployment**
   \`\`\`bash
   # Check deployment status
   vercel ls
   
   # View deployment logs
   vercel logs [deployment-url]
   \`\`\`

3. **Health Check**
   \`\`\`bash
   # Test health endpoint
   curl https://your-domain.com/api/health
   
   # Should return:
   {
     "status": "healthy",
     "checks": {
       "database": { "status": "healthy" },
       "environment": { "status": "healthy" }
     }
   }
   \`\`\`

### Step 4: Post-Deployment Verification

1. **Smoke Tests**
   - [ ] Home page loads
   - [ ] Auth flow works (sign up, login)
   - [ ] API endpoints respond
   - [ ] Database connections work
   - [ ] RLS policies enforced

2. **Create Test Users**
   \`\`\`bash
   # Create one user of each role
   # Verify each dashboard loads correctly
   \`\`\`

3. **Monitor for Errors**
   \`\`\`bash
   # Check Vercel logs
   vercel logs --follow
   
   # Check Supabase logs
   # Dashboard > Logs
   \`\`\`

## Custom Domain Setup

1. **Add Domain to Vercel**
   \`\`\`bash
   # Via Dashboard
   Project Settings > Domains > Add Domain
   
   # Or via CLI
   vercel domains add yourdomain.com
   \`\`\`

2. **Configure DNS**
   \`\`\`bash
   # Add DNS records at your registrar:
   # A Record or CNAME
   
   # For apex domain:
   A @ 76.76.21.21
   
   # For subdomain:
   CNAME www cname.vercel-dns.com
   \`\`\`

3. **Enable HTTPS**
   \`\`\`bash
   # Vercel automatically provisions SSL
   # Wait 24-48 hours for propagation
   # Verify at https://yourdomain.com
   \`\`\`

4. **Update Environment Variables**
   \`\`\`bash
   # Update app URL
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   \`\`\`

## Update Deployment

### Minor Updates (Features/Fixes)

1. **Prepare Update**
   \`\`\`bash
   git checkout main
   git pull origin main
   
   # Create feature branch
   git checkout -b feature/new-feature
   
   # Make changes
   # Run tests
   npm run test
   npm run build
   \`\`\`

2. **Create Pull Request**
   \`\`\`bash
   git push origin feature/new-feature
   # Create PR on GitHub
   # Wait for review and CI checks
   \`\`\`

3. **Deploy**
   \`\`\`bash
   # Merge PR to main
   # Vercel auto-deploys
   
   # Or manual deploy
   git checkout main
   git pull origin main
   vercel --prod
   \`\`\`

### Database Migrations

1. **Test Migration Locally**
   \`\`\`sql
   -- Test on local/dev database first
   -- Verify no breaking changes
   -- Test rollback if needed
   \`\`\`

2. **Backup Production Database**
   \`\`\`bash
   # Supabase Dashboard > Database > Backups
   # Create manual backup before migration
   \`\`\`

3. **Run Migration**
   \`\`\`sql
   -- In Supabase SQL Editor
   BEGIN;
   -- Run migration script
   -- Verify changes
   COMMIT; -- or ROLLBACK if issues
   \`\`\`

4. **Verify Application**
   \`\`\`bash
   # Test affected features
   # Monitor for errors
   \`\`\`

## Rollback Procedures

### Application Rollback

1. **Via Vercel Dashboard**
   \`\`\`bash
   # Deployments > Select previous deployment
   # Click "Promote to Production"
   \`\`\`

2. **Via CLI**
   \`\`\`bash
   # List deployments
   vercel ls
   
   # Rollback to specific deployment
   vercel alias set [deployment-url] yourdomain.com
   \`\`\`

3. **Via Git**
   \`\`\`bash
   # Revert commit
   git revert HEAD
   git push origin main
   # Triggers new deployment
   \`\`\`

### Database Rollback

1. **Restore from Backup**
   \`\`\`bash
   # Supabase Dashboard > Database > Backups
   # Select backup
   # Click "Restore"
   # Confirm and wait
   \`\`\`

2. **Manual Rollback**
   \`\`\`sql
   -- Run rollback script
   -- Reverse migration changes
   \`\`\`

## Monitoring & Maintenance

### Health Monitoring

\`\`\`bash
# Set up uptime monitoring
# Options:
# - UptimeRobot
# - Pingdom
# - Better Uptime
# - Vercel Monitoring

# Monitor these endpoints:
# - https://yourdomain.com/api/health
# - https://yourdomain.com/
\`\`\`

### Log Monitoring

\`\`\`bash
# Vercel Logs
vercel logs --follow

# Supabase Logs
# Dashboard > Logs > API/Database

# Optional: Set up Sentry
# For error tracking and alerting
\`\`\`

### Performance Monitoring

\`\`\`bash
# Vercel Analytics
# Enable in Dashboard > Analytics

# Core Web Vitals
# - LCP < 2.5s
# - FID < 100ms
# - CLS < 0.1
\`\`\`

### Database Maintenance

\`\`\`bash
# Weekly tasks:
# - Review slow queries
# - Check index usage
# - Monitor storage usage
# - Review connection pool

# Monthly tasks:
# - Analyze table statistics
# - Vacuum database
# - Review backup strategy
\`\`\`

## Troubleshooting

### Build Failures

\`\`\`bash
# Check build logs
vercel logs [deployment-url]

# Common issues:
# 1. Missing dependencies
npm install

# 2. TypeScript errors
npm run type-check

# 3. Environment variables
# Verify all required vars set

# 4. Out of memory
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096"
\`\`\`

### Database Connection Issues

\`\`\`bash
# Verify connection
curl https://yourdomain.com/api/health

# Check Supabase status
# https://status.supabase.com

# Verify environment variables
# Ensure SUPABASE_URL and ANON_KEY correct

# Check connection pooling
# Supabase Dashboard > Database > Connection Pooling
\`\`\`

### RLS Policy Issues

\`\`\`sql
-- Check policy exists
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test policy
SET request.jwt.claims.sub = 'user-uuid';
SELECT * FROM your_table;

-- Verify auth context
SELECT auth.uid();
\`\`\`

### Performance Issues

\`\`\`bash
# Check slow queries
# Supabase Dashboard > Database > Query Performance

# Verify indexes
SELECT * FROM pg_indexes WHERE tablename = 'your_table';

# Check connection pool
# Supabase Dashboard > Database > Connection Pooling

# Review Vercel metrics
# Dashboard > Analytics > Performance
\`\`\`

## Emergency Contacts

### Escalation Path

1. **Development Team Lead**: [INSERT CONTACT]
2. **DevOps Engineer**: [INSERT CONTACT]
3. **CTO/Technical Lead**: [INSERT CONTACT]

### Service Status Pages

- Vercel: https://www.vercel-status.com
- Supabase: https://status.supabase.com
- GitHub: https://www.githubstatus.com

## Scheduled Maintenance

### Weekly
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Review security alerts
- [ ] Update dependencies (dev)

### Monthly
- [ ] Security updates
- [ ] Database optimization
- [ ] Backup verification
- [ ] Incident review

### Quarterly
- [ ] Security audit
- [ ] Disaster recovery test
- [ ] Capacity planning
- [ ] Documentation review

## Disaster Recovery

### Backup Strategy

\`\`\`bash
# Daily automatic backups (Supabase)
# Retention: 7 days (free tier), 30 days (pro)

# Manual backups before:
# - Major releases
# - Database migrations
# - Configuration changes
\`\`\`

### Recovery Time Objectives

- **RTO** (Recovery Time Objective): 1 hour
- **RPO** (Recovery Point Objective): 24 hours

### Recovery Procedures

1. **Application Failure**
   - Rollback to last known good deployment
   - Estimated time: 5-10 minutes

2. **Database Failure**
   - Restore from latest backup
   - Estimated time: 15-30 minutes

3. **Complete Outage**
   - Deploy to new infrastructure
   - Restore database
   - Estimated time: 1-2 hours

## Security Considerations

### Secrets Management

\`\`\`bash
# Never commit secrets to Git
# Use environment variables
# Rotate secrets regularly

# Supabase keys:
# - Anon key: Public, safe to expose
# - Service key: Secret, server-only

# Regular rotation:
# - Every 90 days
# - After team member departure
# - After suspected compromise
\`\`\`

### Access Control

\`\`\`bash
# Principle of least privilege
# Separate dev/staging/prod environments
# Use team accounts (not personal)
# Enable 2FA on all accounts
# Regular access review
\`\`\`

## Compliance & Auditing

\`\`\`bash
# Track all deployments
# Log all database changes
# Monitor access patterns
# Regular security scans
# Compliance checks
\`\`\`

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-22  
**Next Review**: 2025-04-22  
**Owner**: DevOps Team
