# Production Deployment Checklist

Use this checklist before deploying to production to ensure all critical requirements are met.

## Pre-Deployment

### Environment Configuration
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` in production environment
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` in production environment
- [ ] Set `NEXT_PUBLIC_APP_VERSION` (e.g., "1.0.0")
- [ ] Verify `NODE_ENV=production` is set
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL/TLS certificates (handled by Vercel automatically)

### Database Setup
- [ ] Run database migrations in order:
  - [ ] `001_create_tables.sql`
  - [ ] `002_enable_rls.sql`
  - [ ] `003_create_profile_trigger.sql`
  - [ ] `004_seed_data.sql` (optional)
- [ ] Verify all tables are created
- [ ] Confirm Row Level Security is enabled on all tables
- [ ] Test RLS policies with different user roles
- [ ] Set up database backups (Supabase handles this)
- [ ] Configure database connection pooling if needed

### Authentication & Security
- [ ] Configure Supabase Auth providers (Email, OAuth, etc.)
- [ ] Set up email templates for authentication
- [ ] Configure redirect URLs for auth callbacks
- [ ] Verify RLS policies are working correctly
- [ ] Test role-based access control
- [ ] Enable HTTPS-only cookies
- [ ] Configure CORS if needed
- [ ] Review and update security headers

### Testing
- [ ] Run all unit tests: `npm run test:ci`
- [ ] Run integration tests
- [ ] Test all API endpoints
- [ ] Verify RLS policies
- [ ] Test user registration flow
- [ ] Test login/logout functionality
- [ ] Test each user role (SEEKER, EMPLOYER, OFFICER, ADMIN)
- [ ] Test error handling and edge cases
- [ ] Run accessibility audit
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS, Android)

### Performance
- [ ] Run Lighthouse audit (score > 90)
- [ ] Optimize images and assets
- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Test page load times
- [ ] Verify Core Web Vitals
- [ ] Test with slow network conditions
- [ ] Check bundle size

### Monitoring & Logging
- [ ] Enable Vercel Analytics
- [ ] Configure error logging (Sentry if using)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure health check endpoint monitoring
- [ ] Set up log aggregation
- [ ] Configure alerts for errors and downtime
- [ ] Test error boundary components
- [ ] Verify structured logging is working

### Documentation
- [ ] Update README with deployment instructions
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Document backup and restore procedures
- [ ] Update API documentation
- [ ] Review and update SECURITY.md
- [ ] Verify all links in documentation work

## Deployment

### Build & Deploy
- [ ] Create production build: `npm run build`
- [ ] Verify build is successful
- [ ] Test production build locally: `npm start`
- [ ] Deploy to staging environment first (if available)
- [ ] Run smoke tests on staging
- [ ] Deploy to production
- [ ] Verify deployment was successful

### Post-Deployment Verification
- [ ] Check health endpoint: `/api/health`
- [ ] Verify homepage loads correctly
- [ ] Test user registration
- [ ] Test user login
- [ ] Verify database connections
- [ ] Check error logs for any issues
- [ ] Test critical user flows:
  - [ ] Job seeker can browse jobs
  - [ ] Employer can post a job
  - [ ] User can send a message
  - [ ] Admin can access analytics
- [ ] Verify all static assets load
- [ ] Check performance metrics
- [ ] Verify analytics tracking

### Rollback Plan
- [ ] Document rollback procedure
- [ ] Keep previous deployment accessible
- [ ] Test rollback process in staging
- [ ] Monitor metrics for first 24 hours
- [ ] Have team member on-call for issues

## Post-Deployment

### Monitoring (First 24 Hours)
- [ ] Monitor error rates
- [ ] Watch response times
- [ ] Check server resources (CPU, memory)
- [ ] Monitor database performance
- [ ] Review user feedback
- [ ] Check for broken links or 404s
- [ ] Monitor authentication issues

### Communication
- [ ] Announce deployment to team
- [ ] Update status page (if applicable)
- [ ] Notify stakeholders
- [ ] Send release notes to users (if applicable)
- [ ] Post in community channels

### Optimization
- [ ] Review analytics data
- [ ] Identify slow queries
- [ ] Optimize based on user behavior
- [ ] Address any reported issues
- [ ] Plan next iteration improvements

## Ongoing Maintenance

### Weekly
- [ ] Review error logs
- [ ] Check uptime and performance metrics
- [ ] Review security alerts
- [ ] Update dependencies if needed
- [ ] Review user feedback

### Monthly
- [ ] Run security audit
- [ ] Review and rotate secrets
- [ ] Update documentation
- [ ] Review RLS policies
- [ ] Analyze usage patterns
- [ ] Plan feature updates

### Quarterly
- [ ] Conduct security review
- [ ] Review and update dependencies
- [ ] Performance optimization review
- [ ] Database maintenance and optimization
- [ ] Review backup and disaster recovery procedures
- [ ] Update incident response plan

## Emergency Contacts

- **DevOps Lead**: devops@secondchanceconnect.org
- **Database Admin**: dba@secondchanceconnect.org
- **Security Team**: security@secondchanceconnect.org
- **On-Call**: Use PagerDuty or on-call phone

## Useful Commands

```bash
# Build for production
npm run build

# Start production server locally
npm start

# Check environment variables
npm run validate

# Run tests
npm run test:ci

# Check health
curl https://your-domain.com/api/health

# View Vercel logs
vercel logs --follow

# Deploy to production
vercel --prod
```

## Rollback Procedure

If critical issues are discovered:

1. **Assess the issue**: Determine severity and impact
2. **Communicate**: Notify team and stakeholders
3. **Rollback**: Revert to previous deployment
   ```bash
   vercel rollback [deployment-url]
   ```
4. **Verify**: Test rolled-back version
5. **Root cause**: Investigate and fix the issue
6. **Post-mortem**: Document what happened and how to prevent it

## Resources

- [SETUP.md](SETUP.md) - Initial setup instructions
- [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md) - Troubleshooting
- [docs/MONITORING.md](docs/MONITORING.md) - Monitoring setup
- [docs/TESTING.md](docs/TESTING.md) - Testing guide
- [SECURITY.md](SECURITY.md) - Security practices

## Sign-Off

- [ ] Technical lead reviewed and approved
- [ ] Product owner reviewed and approved
- [ ] Security team reviewed and approved
- [ ] All checklist items completed
- [ ] Deployment scheduled and communicated

---

**Date**: _______________
**Deployed by**: _______________
**Version**: _______________
**Notes**: _______________
