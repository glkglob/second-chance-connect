# Monitoring & Observability Setup

## Overview

This guide covers setting up comprehensive monitoring and observability for Second Chance Connect using industry-standard tools and services.

## Monitoring Stack

### Recommended Services

1. **Error Tracking**: Sentry
2. **Application Performance**: Vercel Analytics
3. **Uptime Monitoring**: UptimeRobot or Pingdom
4. **Log Aggregation**: Vercel Logs or Datadog
5. **Database Monitoring**: Supabase built-in monitoring

## Sentry Integration

### Setup

1. **Create Sentry Account**
   \`\`\`bash
   # Sign up at https://sentry.io
   # Create new project: Next.js
   \`\`\`

2. **Install Sentry SDK**
   \`\`\`bash
   npm install @sentry/nextjs
   \`\`\`

3. **Initialize Sentry**
   \`\`\`bash
   npx @sentry/wizard -i nextjs
   \`\`\`

4. **Configuration Files**

   **sentry.client.config.js**
   \`\`\`javascript
   import * as Sentry from '@sentry/nextjs'

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     
     // Set tracesSampleRate to 1.0 to capture 100% of transactions
     // In production, consider reducing this
     tracesSampleRate: 0.1,
     
     // Capture replay sessions
     replaysSessionSampleRate: 0.1,
     replaysOnErrorSampleRate: 1.0,
     
     environment: process.env.NODE_ENV,
     
     // Performance monitoring
     integrations: [
       new Sentry.BrowserTracing({
         tracePropagationTargets: [
           'localhost',
           /^https:\/\/your-domain\.com/
         ]
       }),
       new Sentry.Replay()
     ],
     
     // Filter sensitive data
     beforeSend(event, hint) {
       // Don't send errors in development
       if (process.env.NODE_ENV === 'development') {
         return null
       }
       
       // Filter sensitive data from breadcrumbs
       if (event.breadcrumbs) {
         event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
           if (breadcrumb.data?.password) {
             breadcrumb.data.password = '[Filtered]'
           }
           return breadcrumb
         })
       }
       
       return event
     }
   })
   \`\`\`

   **sentry.server.config.js**
   \`\`\`javascript
   import * as Sentry from '@sentry/nextjs'

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     tracesSampleRate: 0.1,
     environment: process.env.NODE_ENV,
     
     // Server-specific integrations
     integrations: [
       new Sentry.Integrations.Http({ tracing: true })
     ]
   })
   \`\`\`

5. **Update Error Handlers**

   \`\`\`javascript
   // lib/logger.js
   import * as Sentry from '@sentry/nextjs'

   export function logError(message, error, context = {}) {
     // ... existing logging code ...
     
     if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
       Sentry.captureException(error, {
         contexts: { custom: context },
         tags: { component: context.component }
       })
     }
   }
   \`\`\`

6. **Environment Variables**
   \`\`\`bash
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_ORG=your-org
   SENTRY_PROJECT=your-project
   SENTRY_AUTH_TOKEN=xxx
   \`\`\`

## Vercel Analytics

### Setup

1. **Enable in Vercel Dashboard**
   \`\`\`bash
   # Project > Analytics > Enable
   # No additional configuration needed
   \`\`\`

2. **Add to Application**
   \`\`\`javascript
   // app/layout.jsx
   import { Analytics } from '@vercel/analytics/react'

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   \`\`\`

3. **Custom Events** (Optional)
   \`\`\`javascript
   import { track } from '@vercel/analytics'

   // Track custom events
   track('job_application_submitted', {
     jobId: 'xxx',
     userId: 'yyy'
   })
   \`\`\`

## Uptime Monitoring

### UptimeRobot Setup

1. **Create Account**
   \`\`\`bash
   # Sign up at https://uptimerobot.com
   \`\`\`

2. **Add Monitors**
   \`\`\`bash
   # Create HTTP(s) monitors for:
   
   # Main application
   URL: https://your-domain.com
   Type: HTTPS
   Interval: 5 minutes
   
   # Health check endpoint
   URL: https://your-domain.com/api/health
   Type: HTTPS (Keyword)
   Keyword: "healthy"
   Interval: 5 minutes
   
   # API endpoint
   URL: https://your-domain.com/api/jobs
   Type: HTTPS
   Interval: 5 minutes
   \`\`\`

3. **Configure Alerts**
   \`\`\`bash
   # Email alerts
   # SMS alerts (optional)
   # Webhook alerts (for Slack/Discord)
   \`\`\`

### Pingdom Alternative

\`\`\`bash
# If using Pingdom instead:
# 1. Create account at pingdom.com
# 2. Add similar monitors
# 3. Configure alert contacts
# 4. Set up status page (optional)
\`\`\`

## Database Monitoring

### Supabase Built-in Monitoring

1. **Access Monitoring Dashboard**
   \`\`\`bash
   # Supabase Dashboard > Database > Logs
   # View:
   # - Query performance
   # - Slow queries
   # - Connection pool usage
   # - Storage usage
   \`\`\`

2. **Set Up Alerts**
   \`\`\`bash
   # Dashboard > Project Settings > Database
   # Configure alerts for:
   # - High CPU usage
   # - Storage threshold
   # - Connection limit
   \`\`\`

3. **Query Performance**
   \`\`\`sql
   -- View slow queries
   SELECT 
     query,
     calls,
     total_time,
     mean_time,
     max_time
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;
   \`\`\`

## Log Aggregation

### Vercel Logs

\`\`\`bash
# Real-time logs
vercel logs --follow

# Filter logs
vercel logs --filter "error"

# Export logs
vercel logs --since 1h --output logs.txt
\`\`\`

### Datadog Integration (Optional)

1. **Install Integration**
   \`\`\`bash
   npm install dd-trace
   \`\`\`

2. **Configure**
   \`\`\`javascript
   // instrumentation.js (Next.js 13+)
   export function register() {
     if (process.env.NEXT_RUNTIME === 'nodejs') {
       require('dd-trace').init({
         env: process.env.NODE_ENV,
         service: 'second-chance-connect',
         version: '1.0.0'
       })
     }
   }
   \`\`\`

## Custom Dashboards

### Key Metrics to Track

1. **Application Metrics**
   - Request rate (requests/minute)
   - Error rate (%)
   - Response time (p50, p95, p99)
   - Availability (uptime %)

2. **Business Metrics**
   - User signups (daily/weekly)
   - Job postings (daily)
   - Applications submitted (daily)
   - Successful placements (weekly)

3. **Database Metrics**
   - Query performance (ms)
   - Connection pool usage (%)
   - Storage usage (GB)
   - Slow query count

4. **Security Metrics**
   - Failed login attempts
   - Rate limit violations
   - RLS policy violations
   - Suspicious activity events

### Creating Admin Dashboard

See `app/admin/analytics/page.jsx` for implementation.

## Alerting Rules

### Critical Alerts (Immediate Response)

\`\`\`yaml
# Error rate > 5%
condition: error_rate > 0.05
severity: critical
notify: pagerduty, sms

# API response time > 5s
condition: p95_response_time > 5000
severity: critical
notify: pagerduty, email

# Database connection failures
condition: db_connection_errors > 0
severity: critical
notify: pagerduty, sms

# Service down
condition: uptime < 100%
severity: critical
notify: pagerduty, sms, slack
\`\`\`

### Warning Alerts (Action Required)

\`\`\`yaml
# Error rate > 1%
condition: error_rate > 0.01
severity: warning
notify: email, slack

# API response time > 2s
condition: p95_response_time > 2000
severity: warning
notify: email, slack

# High database CPU
condition: db_cpu > 80%
severity: warning
notify: email

# Storage usage > 80%
condition: storage_usage > 0.80
severity: warning
notify: email
\`\`\`

### Info Alerts (Monitoring Only)

\`\`\`yaml
# High traffic spike
condition: request_rate > 2x_average
severity: info
notify: slack

# Unusual user activity
condition: new_users > 2x_average
severity: info
notify: slack
\`\`\`

## Alert Channels

### Slack Integration

1. **Create Webhook**
   \`\`\`bash
   # In Slack: Apps > Incoming Webhooks
   # Create webhook URL
   \`\`\`

2. **Configure in Monitoring Service**
   \`\`\`bash
   # Add webhook URL to alert contacts
   # Test notification
   \`\`\`

### PagerDuty (For Critical Alerts)

1. **Create Service**
   \`\`\`bash
   # PagerDuty > Services > New Service
   # Get integration key
   \`\`\`

2. **Configure Escalation Policy**
   \`\`\`bash
   # Set up on-call schedule
   # Define escalation rules
   # Add team members
   \`\`\`

## Performance Monitoring

### Core Web Vitals

Monitor these metrics:

1. **Largest Contentful Paint (LCP)**
   - Target: < 2.5s
   - Measures: Loading performance

2. **First Input Delay (FID)**
   - Target: < 100ms
   - Measures: Interactivity

3. **Cumulative Layout Shift (CLS)**
   - Target: < 0.1
   - Measures: Visual stability

### Monitoring in Code

\`\`\`javascript
// app/layout.jsx
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    console.log(metric)
    
    // Send to custom endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      body: JSON.stringify(metric)
    })
  })
}
\`\`\`

## Security Monitoring

### Failed Login Attempts

\`\`\`javascript
// Track in API route
if (authError) {
  logSecurity('Failed login attempt', {
    email: email,
    ip: request.ip,
    timestamp: Date.now()
  })
  
  // Alert if threshold exceeded
  if (failedAttempts > 5) {
    // Send alert
  }
}
\`\`\`

### Rate Limit Violations

\`\`\`javascript
// Automatic via rate-limiter.js
// Logs security event when limit exceeded
\`\`\`

### Suspicious Activity

\`\`\`javascript
// Monitor for:
// - Multiple account creation from same IP
// - Unusual access patterns
// - Data scraping attempts
// - SQL injection attempts
\`\`\`

## Incident Response

### Runbook

1. **Detect**: Alert received
2. **Assess**: Check dashboards and logs
3. **Respond**: Execute runbook procedures
4. **Resolve**: Fix issue and verify
5. **Review**: Post-incident review

### Communication

\`\`\`bash
# Status page updates
# Team notifications (Slack)
# Customer communications (if needed)
# Incident log documentation
\`\`\`

## Regular Reviews

### Daily
- [ ] Check error logs
- [ ] Review performance metrics
- [ ] Check for security alerts

### Weekly
- [ ] Review slow queries
- [ ] Analyze traffic patterns
- [ ] Check resource usage trends

### Monthly
- [ ] Performance report
- [ ] Security audit
- [ ] Capacity planning
- [ ] Alert tuning

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [UptimeRobot Docs](https://uptimerobot.com/api/)
- [Supabase Monitoring](https://supabase.com/docs/guides/platform/metrics)

---

**Last Updated**: 2025-01-22  
**Owner**: DevOps Team
