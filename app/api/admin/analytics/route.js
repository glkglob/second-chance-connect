import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { withErrorHandling, createAuthError, createPermissionError } from '@/lib/api-error-handler'
import { logApiRequest, logApiResponse, startPerformanceMonitor } from '@/lib/logger'

async function handler(request) {
  const monitor = startPerformanceMonitor('admin-analytics')
  logApiRequest('GET', '/api/admin/analytics')

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw createAuthError()
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'ADMIN') {
      throw createPermissionError('Admin access required')
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const metric = searchParams.get('metric')

    // Get analytics data
    const analytics = await fetchAnalytics(supabase, { startDate, endDate, metric })

    const duration = monitor.end()
    logApiResponse('GET', '/api/admin/analytics', 200, duration)

    return NextResponse.json(analytics)
  } catch (error) {
    const duration = monitor.end()
    logApiResponse('GET', '/api/admin/analytics', error.statusCode || 500, duration)
    throw error
  }
}

async function fetchAnalytics(supabase, options = {}) {
  const { startDate, endDate } = options

  // Build date filter
  let dateFilter = {}
  if (startDate) {
    dateFilter.gte = startDate
  }
  if (endDate) {
    dateFilter.lte = endDate
  }

  // Fetch users statistics
  const usersQuery = supabase.from('profiles').select('id, role, created_at', { count: 'exact' })
  if (startDate || endDate) {
    if (startDate) usersQuery.gte('created_at', startDate)
    if (endDate) usersQuery.lte('created_at', endDate)
  }
  const { data: users, count: totalUsers, error: usersError } = await usersQuery

  if (usersError) throw usersError

  // Count users by role
  const usersByRole = users?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {}) || {}

  // Fetch jobs statistics
  const jobsQuery = supabase.from('jobs').select('id, status, created_at', { count: 'exact' })
  if (startDate) jobsQuery.gte('created_at', startDate)
  if (endDate) jobsQuery.lte('created_at', endDate)
  const { data: jobs, count: totalJobs, error: jobsError } = await jobsQuery

  if (jobsError) throw jobsError

  const activeJobs = jobs?.filter(j => j.status === 'ACTIVE').length || 0

  // Fetch applications statistics
  const appsQuery = supabase.from('applications').select('id, status, created_at', { count: 'exact' })
  if (startDate) appsQuery.gte('created_at', startDate)
  if (endDate) appsQuery.lte('created_at', endDate)
  const { data: applications, count: totalApplications, error: appsError } = await appsQuery

  if (appsError) throw appsError

  const successfulPlacements = applications?.filter(a => a.status === 'ACCEPTED').length || 0
  const pendingApplications = applications?.filter(a => a.status === 'PENDING').length || 0

  // Fetch messages statistics
  const { count: totalMessages, error: messagesError } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })

  if (messagesError) throw messagesError

  // Calculate growth metrics
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const { count: newUsersThisMonth } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { count: newJobsThisMonth } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { count: newApplicationsThisMonth } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  // Calculate success rate
  const successRate = totalApplications > 0 
    ? ((successfulPlacements / totalApplications) * 100).toFixed(1)
    : 0

  // Get recent activity
  const { data: recentJobs } = await supabase
    .from('jobs')
    .select('id, title, company, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentApplications } = await supabase
    .from('applications')
    .select('id, status, created_at, jobs(title, company)')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    summary: {
      totalUsers: totalUsers || 0,
      totalJobs: totalJobs || 0,
      activeJobs: activeJobs,
      totalApplications: totalApplications || 0,
      successfulPlacements: successfulPlacements,
      pendingApplications: pendingApplications,
      totalMessages: totalMessages || 0,
      successRate: parseFloat(successRate)
    },
    growth: {
      newUsersThisMonth: newUsersThisMonth || 0,
      newJobsThisMonth: newJobsThisMonth || 0,
      newApplicationsThisMonth: newApplicationsThisMonth || 0
    },
    usersByRole: {
      SEEKER: usersByRole.SEEKER || 0,
      EMPLOYER: usersByRole.EMPLOYER || 0,
      OFFICER: usersByRole.OFFICER || 0,
      ADMIN: usersByRole.ADMIN || 0
    },
    recentActivity: {
      jobs: recentJobs || [],
      applications: recentApplications || []
    }
  }
}

export const GET = withErrorHandling(handler)
