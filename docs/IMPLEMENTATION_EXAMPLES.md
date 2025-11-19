# Implementation Examples

## Overview

This document provides concrete examples of implementing security, monitoring, and testing features in the Second Chance Connect application.

## Table of Contents

1. [API Route with Full Security](#api-route-with-full-security)
2. [Component with Error Boundary](#component-with-error-boundary)
3. [Testing API Routes](#testing-api-routes)
4. [Monitoring Integration](#monitoring-integration)
5. [Rate Limited Endpoint](#rate-limited-endpoint)

---

## API Route with Full Security

### Example: Enhanced Jobs API

\`\`\`javascript
// app/api/jobs/route.js
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  withErrorHandling,
  createAuthError,
  validateRequiredFields,
  validateRole
} from '@/lib/api-error-handler'
import {
  logApiRequest,
  logApiResponse,
  startPerformanceMonitor
} from '@/lib/logger'
import { withRateLimit } from '@/lib/rate-limiter'

/**
 * GET /api/jobs
 * List jobs with filtering
 */
async function getHandler(request) {
  const monitor = startPerformanceMonitor('get-jobs')
  logApiRequest('GET', '/api/jobs')

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw createAuthError()
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const employerId = searchParams.get('employerId')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('jobs')
      .select(`
        id,
        title,
        company,
        location,
        description,
        requirements,
        salary_range,
        employment_type,
        status,
        created_at,
        employer_id,
        profiles:employer_id (
          name,
          location
        )
      `)

    // Apply filters
    if (status) query = query.eq('status', status)
    if (employerId) query = query.eq('employer_id', employerId)
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    // Default to active jobs for non-employers
    if (!employerId && !status) {
      query = query.eq('status', 'ACTIVE')
    }

    query = query.order('created_at', { ascending: false })

    // Execute query
    const { data, error } = await query

    if (error) {
      throw error
    }

    const duration = monitor.end()
    logApiResponse('GET', '/api/jobs', 200, duration, {
      count: data?.length || 0
    })

    return NextResponse.json({ jobs: data || [] })
  } catch (error) {
    const duration = monitor.end()
    logApiResponse('GET', '/api/jobs', error.statusCode || 500, duration)
    throw error
  }
}

/**
 * POST /api/jobs
 * Create a new job posting (Employer only)
 */
async function postHandler(request) {
  const monitor = startPerformanceMonitor('create-job')
  logApiRequest('POST', '/api/jobs')

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw createAuthError()
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      throw createAuthError('Profile not found')
    }

    validateRole(profile.role, ['EMPLOYER'])

    // Parse and validate request body
    const body = await request.json()
    validateRequiredFields(body, ['title', 'company', 'location', 'description'])

    const {
      title,
      company,
      location,
      description,
      requirements,
      salary_range,
      employment_type,
      status = 'DRAFT'
    } = body

    // Create job
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title,
        company,
        location,
        description,
        requirements,
        salary_range,
        employment_type,
        status,
        employer_id: user.id
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    const duration = monitor.end()
    logApiResponse('POST', '/api/jobs', 201, duration, {
      jobId: data.id
    })

    return NextResponse.json({ job: data }, { status: 201 })
  } catch (error) {
    const duration = monitor.end()
    logApiResponse('POST', '/api/jobs', error.statusCode || 500, duration)
    throw error
  }
}

// Export with middleware wrappers
export const GET = withRateLimit(withErrorHandling(getHandler))
export const POST = withRateLimit(withErrorHandling(postHandler), {
  type: 'post' // Apply stricter rate limit for POST requests
})
\`\`\`

---

## Component with Error Boundary

### Example: Dashboard with Error Handling

\`\`\`javascript
// app/dashboard/page.jsx
'use client'

import { useState, useEffect } from 'react'
import ErrorBoundary, { ErrorDisplay } from '@/components/error-boundary'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function DashboardContent() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  async function fetchDashboardStats() {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Dashboard error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorDisplay
        error={{ message: error }}
        reset={fetchDashboardStats}
      />
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Applications</h3>
          <p className="text-3xl font-bold">{stats?.applications || 0}</p>
        </Card>
        {/* More stats cards */}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  )
}
\`\`\`

---

## Testing API Routes

### Example: Comprehensive API Tests

\`\`\`javascript
// app/api/jobs/__tests__/route.test.js
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { GET, POST } from '../route'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase
jest.mock('@/lib/supabase/server')

describe('/api/jobs', () => {
  let mockSupabase

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: jest.fn()
      },
      from: jest.fn()
    }
    createClient.mockResolvedValue(mockSupabase)
  })

  describe('GET /api/jobs', () => {
    it('returns 401 when not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null }
      })

      const request = new Request('http://localhost/api/jobs')
      const response = await GET(request)

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Authentication required')
    })

    it('returns active jobs for authenticated user', async () => {
      const mockUser = { id: 'user-123' }
      const mockJobs = [
        { id: '1', title: 'Job 1', status: 'ACTIVE' },
        { id: '2', title: 'Job 2', status: 'ACTIVE' }
      ]

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser }
      })

      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockJobs,
          error: null
        })
      }

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockQuery)
      })

      const request = new Request('http://localhost/api/jobs')
      const response = await GET(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.jobs).toHaveLength(2)
      expect(data.jobs[0].title).toBe('Job 1')
    })

    it('filters jobs by search query', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } }
      })

      const mockQuery = {
        or: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      }

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockQuery)
      })

      const request = new Request('http://localhost/api/jobs?search=developer')
      await GET(request)

      expect(mockQuery.or).toHaveBeenCalled()
    })
  })

  describe('POST /api/jobs', () => {
    it('creates job for employer', async () => {
      const mockUser = { id: 'employer-123' }
      const mockProfile = { role: 'EMPLOYER' }
      const mockJob = {
        id: 'job-123',
        title: 'Software Developer',
        employer_id: 'employer-123'
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser }
      })

      // Mock profile check
      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockProfile,
                error: null
              })
            })
          })
        })
        // Mock job insert
        .mockReturnValueOnce({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockJob,
                error: null
              })
            })
          })
        })

      const request = new Request('http://localhost/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Software Developer',
          company: 'Tech Co',
          location: 'Remote',
          description: 'We are hiring'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.job.id).toBe('job-123')
    })

    it('rejects job creation for non-employers', async () => {
      const mockUser = { id: 'seeker-123' }
      const mockProfile = { role: 'SEEKER' }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser }
      })

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null
            })
          })
        })
      })

      const request = new Request('http://localhost/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Job',
          company: 'Co',
          location: 'Remote',
          description: 'Desc'
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(403)
    })

    it('validates required fields', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'employer-123' } }
      })

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { role: 'EMPLOYER' },
              error: null
            })
          })
        })
      })

      const request = new Request('http://localhost/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Job'
          // missing required fields
        })
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('Missing required fields')
    })
  })
})
\`\`\`

---

## Monitoring Integration

### Example: Custom Monitoring Hook

\`\`\`javascript
// lib/hooks/use-monitoring.js
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function usePageViewTracking() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname
      })
    }

    // Custom analytics
    fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname })
    }).catch(() => {
      // Silent fail for analytics
    })
  }, [pathname])
}

export function useErrorTracking(error) {
  useEffect(() => {
    if (error && process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          url: window.location.href
        })
      }).catch(() => {
        // Silent fail
      })
    }
  }, [error])
}

// Usage in component
export function useMonitoring() {
  usePageViewTracking()
  return { trackEvent, trackError }
}

function trackEvent(eventName, properties = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

function trackError(error, context = {}) {
  console.error('Error tracked:', error, context)
  // Send to monitoring service
}
\`\`\`

---

## Rate Limited Endpoint

### Example: Auth Endpoint with Rate Limiting

\`\`\`javascript
// app/api/auth/login/route.js
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  withErrorHandling,
  createAuthError,
  validateRequiredFields
} from '@/lib/api-error-handler'
import { withRateLimit } from '@/lib/rate-limiter'
import { logAuth, logSecurity } from '@/lib/logger'

async function loginHandler(request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    validateRequiredFields(body, ['email', 'password'])

    const { email, password } = body

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      // Log failed attempt
      logSecurity('Failed login attempt', {
        email,
        error: error.message
      })

      throw createAuthError('Invalid credentials')
    }

    // Log successful login
    logAuth('user_login', data.user.id, {
      email: data.user.email
    })

    return NextResponse.json({
      user: data.user,
      session: data.session
    })
  } catch (error) {
    throw error
  }
}

// Export with strict rate limiting for sensitive endpoint
export const POST = withRateLimit(
  withErrorHandling(loginHandler),
  { type: 'sensitive' } // 5 requests per minute
)
\`\`\`

---

## Database Query with Monitoring

### Example: Monitored Database Operation

\`\`\`javascript
// lib/db/queries.js
import { createClient } from '@/lib/supabase/server'
import { logQuery, startPerformanceMonitor } from '@/lib/logger'

export async function getJobsWithAnalytics(filters = {}) {
  const monitor = startPerformanceMonitor('get-jobs-with-analytics')
  const supabase = await createClient()

  try {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles!employer_id(*),
        applications(count),
        _count:applications(count)
      `)

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    const { data, error } = await query

    if (error) throw error

    const duration = monitor.end()
    logQuery('get-jobs-with-analytics', duration, {
      filters,
      resultCount: data?.length || 0
    })

    return { data, error: null }
  } catch (error) {
    monitor.end()
    return { data: null, error }
  }
}
\`\`\`

---

## Environment-Specific Configuration

### Example: Config with Validation

\`\`\`javascript
// lib/config.js
const config = {
  app: {
    name: 'Second Chance Connect',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development'
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY // Server-only
  },
  monitoring: {
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: process.env.NODE_ENV === 'production'
  },
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000')
  }
}

// Validate required config
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

export default config
\`\`\`

---

## Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Client Libraries](https://supabase.com/docs/reference/javascript/introduction)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Jest Testing](https://jestjs.io/docs/getting-started)

---

**Last Updated**: 2025-01-22
