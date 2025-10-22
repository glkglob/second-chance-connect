# Monitoring and Observability Guide

## Overview

This document describes the monitoring, logging, and observability practices for Second Chance Connect, including error tracking, performance monitoring, and system health checks.

## Table of Contents

- [Monitoring Stack](#monitoring-stack)
- [Logging](#logging)
- [Error Tracking](#error-tracking)
- [Performance Monitoring](#performance-monitoring)
- [Health Checks](#health-checks)
- [Alerts](#alerts)
- [Dashboards](#dashboards)
- [Best Practices](#best-practices)

## Monitoring Stack

### Core Components

- **Vercel Analytics**: Built-in performance and analytics
- **Application Logger**: Custom structured logging (`lib/logger.js`)
- **Error Boundaries**: UI error handling
- **Health Endpoint**: `/api/health` for system status

### Optional Integrations

- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **Custom Endpoint**: Send logs to custom monitoring service

## Logging

### Structured Logging

We use a custom logger (`lib/logger.js`) that provides structured, contextual logging:

```javascript
import { logger } from '@/lib/logger'

// Error logging
logger.error('Database connection failed', error, {
  userId: user.id,
  operation: 'SELECT',
  table: 'jobs'
})

// Warning logging
logger.warn('Rate limit approaching', {
  userId: user.id,
  requestCount: 95,
  limit: 100
})

// Info logging
logger.info('User logged in', {
  userId: user.id,
  role: user.role
})

// Debug logging (development only)
logger.debug('Processing request', {
  requestId: req.id,
  params: req.params
})
```

### Log Levels

| Level | When to Use | Production | Development |
|-------|-------------|------------|-------------|
| ERROR | Errors that need attention | ✅ Logged | ✅ Logged |
| WARN | Potential issues | ✅ Logged | ✅ Logged |
| INFO | Important events | ✅ Logged | ⚠️ Debug mode only |
| DEBUG | Development info | ❌ Not logged | ⚠️ Debug mode only |

### Specialized Logging

```javascript
// API request/response
logger.apiRequest('GET', '/api/jobs', { userId: user.id })
logger.apiResponse('GET', '/api/jobs', 200, 145, { count: 25 })

// Database operations
logger.dbQuery('jobs', 'SELECT', { filters: { status: 'ACTIVE' } })

// Authentication events
logger.authEvent('login', user.id, { provider: 'email' })

// Security events
logger.security('Failed login attempt', { 
  email: email, 
  attempts: 3 
})
```

### Viewing Logs

#### Development
```bash
# Enable debug mode
NEXT_PUBLIC_DEBUG=true npm run dev
```

#### Production (Vercel)
```bash
# View real-time logs
vercel logs

# View logs for specific deployment
vercel logs [deployment-url]

# Follow logs
vercel logs --follow
```

## Error Tracking

### Error Boundaries

React error boundaries catch component errors and display fallback UI:

```javascript
import { ErrorBoundary } from '@/components/error-boundary'

export default function MyApp({ children }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}
```

Error boundaries automatically:
- Display user-friendly error message
- Log error details to monitoring service
- Allow users to retry or return home
- Show stack traces in development mode

### API Error Handling

All API routes include error handling:

```javascript
import { logApiError } from '@/lib/logger'

export async function GET(request) {
  try {
    // API logic
  } catch (error) {
    logApiError(error, request, { 
      operation: 'GET /api/jobs' 
    })
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
```

### Database Error Handling

```javascript
import { logDatabaseError } from '@/lib/logger'

const { data, error } = await supabase
  .from('jobs')
  .select('*')

if (error) {
  logDatabaseError(error, 'SELECT', 'jobs', {
    filters: { status: 'ACTIVE' }
  })
  // Handle error
}
```

### Integrating Sentry (Optional)

1. Install Sentry:
```bash
npm install @sentry/nextjs
```

2. Initialize Sentry:
```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

3. Update logger to send to Sentry (already configured in `lib/logger.js`)

## Performance Monitoring

### Vercel Analytics

Automatically tracks:
- Page load times
- Core Web Vitals (LCP, FID, CLS)
- User navigation patterns

Enable in `app/layout.jsx`:
```javascript
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
```

### Custom Performance Metrics

```javascript
import { logPerformance } from '@/lib/logger'

// Measure operation time
const start = Date.now()
await performOperation()
const duration = Date.now() - start

logPerformance('operation_name', duration, {
  userId: user.id,
  itemCount: items.length
})
```

### API Response Times

Automatically logged by API routes:
```javascript
const startTime = Date.now()
// ... API logic ...
const duration = Date.now() - startTime

logger.apiResponse('GET', '/api/jobs', 200, duration)
```

## Health Checks

### Health Endpoint

`GET /api/health` returns system status:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Connected",
      "responseTime": 45
    },
    "environment": {
      "status": "healthy",
      "message": "All required variables set"
    }
  },
  "responseTime": 52
}
```

Status values:
- `healthy` (200): All systems operational
- `degraded` (207): Some non-critical issues
- `unhealthy` (503): Critical failures

### Monitoring Health

```bash
# Check health locally
curl http://localhost:3000/api/health

# Check health in production
curl https://your-domain.com/api/health
```

### Uptime Monitoring

Use services like:
- **Vercel Monitoring**: Built-in uptime checks
- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring
- **Better Uptime**: Modern uptime monitoring

Configure to check `/api/health` every 5 minutes.

## Alerts

### Setting Up Alerts

#### Vercel Alerts
1. Go to Vercel dashboard
2. Settings → Alerts
3. Configure:
   - Error rate threshold
   - Response time threshold
   - Deployment failures

#### Custom Alerts

Create alert rules based on logs:

```javascript
// Example: Alert on high error rate
if (errorRate > 5) {
  logger.error('High error rate detected', null, {
    type: 'alert',
    errorRate,
    threshold: 5
  })
  
  // Send to Slack, PagerDuty, etc.
  await sendAlert({
    title: 'High Error Rate',
    message: `Error rate: ${errorRate}%`,
    severity: 'critical'
  })
}
```

### Alert Channels

- **Email**: Vercel sends email alerts
- **Slack**: Integrate via webhook
- **PagerDuty**: For on-call rotations
- **SMS**: For critical issues

## Dashboards

### Admin Analytics Dashboard

Navigate to `/admin/analytics` to view:
- User metrics (total users, growth)
- Activity metrics (jobs, applications, messages)
- Performance metrics (response time, error rate, uptime)
- User distribution by role

### Vercel Dashboard

View in Vercel:
- Deployment history
- Function logs
- Analytics data
- Real-time metrics

### Custom Dashboards

Create custom dashboards using:
- **Grafana**: For time-series data
- **Datadog**: Full-stack monitoring
- **New Relic**: Application performance

## Best Practices

### Logging Best Practices

✅ **Do:**
- Log errors with full context
- Use structured logging (JSON)
- Include request IDs for tracing
- Log security events
- Set appropriate log levels

❌ **Don't:**
- Log sensitive data (passwords, tokens)
- Log in tight loops (performance)
- Use console.log in production
- Log personal information (GDPR)
- Ignore errors silently

### Error Handling Best Practices

✅ **Do:**
- Handle all errors gracefully
- Provide user-friendly error messages
- Log errors with context
- Monitor error rates
- Set up alerts for critical errors

❌ **Don't:**
- Expose stack traces to users
- Ignore caught errors
- Use generic error messages
- Let errors crash the application

### Performance Best Practices

✅ **Do:**
- Monitor Core Web Vitals
- Track API response times
- Optimize slow queries
- Cache when appropriate
- Use CDN for static assets

❌ **Don't:**
- Ignore slow endpoints
- Skip performance testing
- Over-fetch data
- Block the main thread

## Monitoring Checklist

- [ ] Logging configured and working
- [ ] Error boundaries in place
- [ ] Health endpoint responding
- [ ] Vercel Analytics enabled
- [ ] Uptime monitoring set up
- [ ] Error alerts configured
- [ ] Performance baseline established
- [ ] Admin dashboard accessible
- [ ] Log retention policy defined
- [ ] Incident response plan created

## Incident Response

### When Something Goes Wrong

1. **Detect**: Receive alert or notice issue
2. **Assess**: Check health endpoint and logs
3. **Respond**: Fix the issue or roll back
4. **Communicate**: Update stakeholders
5. **Document**: Record incident details
6. **Review**: Post-mortem and prevention

### Quick Debugging

```bash
# Check recent errors
vercel logs --filter=error

# Check specific endpoint
vercel logs --filter="/api/jobs"

# Follow logs in real-time
vercel logs --follow

# Check health
curl https://your-domain.com/api/health
```

## Metrics to Track

### Application Metrics
- Request rate (requests/minute)
- Error rate (%)
- Response time (ms)
- Active users
- Database query time

### Business Metrics
- New user signups
- Job postings created
- Applications submitted
- Messages sent
- User engagement rate

### Infrastructure Metrics
- CPU usage
- Memory usage
- Database connections
- API rate limits
- Deployment frequency

## Resources

- [Vercel Analytics](https://vercel.com/analytics)
- [Sentry Documentation](https://docs.sentry.io/)
- [Web Vitals](https://web.dev/vitals/)
- [Logging Best Practices](https://www.loggly.com/ultimate-guide/node-logging-basics/)

## Getting Help

- Check logs first: `vercel logs`
- Review health endpoint: `/api/health`
- Check admin dashboard: `/admin/analytics`
- Contact DevOps: devops@secondchanceconnect.org
- Emergency: Use PagerDuty or on-call phone

---

**Remember**: Good monitoring prevents surprises and enables quick response to issues!
