import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger, logApiError } from '@/lib/logger'

/**
 * Admin Analytics API
 * GET /api/admin/analytics
 * 
 * Returns aggregated analytics data for admin dashboard
 * Requires ADMIN role
 */
export async function GET(request) {
  const startTime = Date.now()
  
  try {
    logger.apiRequest('GET', '/api/admin/analytics')
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      logger.warn('Unauthorized access attempt to admin analytics', { 
        type: 'unauthorized_access' 
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check user role - only admins can access analytics
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'ADMIN') {
      logger.security('Non-admin attempted to access analytics', { 
        userId: user.id, 
        userRole: profile?.role 
      })
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required' 
      }, { status: 403 })
    }

    // Fetch analytics data
    const analytics = await fetchAnalyticsData(supabase)

    const duration = Date.now() - startTime
    logger.apiResponse('GET', '/api/admin/analytics', 200, duration)

    return NextResponse.json(analytics)
  } catch (error) {
    logApiError(error, request, { operation: 'GET /api/admin/analytics' })
    return NextResponse.json({ 
      error: 'Failed to fetch analytics' 
    }, { status: 500 })
  }
}

/**
 * Fetch all analytics data from database
 */
async function fetchAnalyticsData(supabase) {
  // Get total users and breakdown by role
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('role, created_at')

  if (profilesError) {
    logger.error('Failed to fetch profiles for analytics', profilesError)
  }

  const totalUsers = profiles?.length || 0
  const usersByRole = profiles?.reduce((acc, profile) => {
    acc[profile.role] = (acc[profile.role] || 0) + 1
    return acc
  }, {}) || {}

  // Get total jobs
  const { count: totalJobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  if (jobsError) {
    logger.error('Failed to fetch jobs count', jobsError)
  }

  // Get active jobs
  const { count: activeJobs, error: activeJobsError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ACTIVE')

  if (activeJobsError) {
    logger.error('Failed to fetch active jobs count', activeJobsError)
  }

  // Get total applications
  const { count: totalApplications, error: applicationsError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })

  if (applicationsError) {
    logger.error('Failed to fetch applications count', applicationsError)
  }

  // Get total messages
  const { count: totalMessages, error: messagesError } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })

  if (messagesError) {
    logger.error('Failed to fetch messages count', messagesError)
  }

  // Get recent activity (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: newUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { count: jobsPosted } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { count: applicationsSubmitted } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  const { count: messagesSent } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())

  // Calculate growth percentages (mock for now)
  // In production, compare with previous period
  const userGrowth = calculateGrowth(newUsers, totalUsers)
  const jobGrowth = calculateGrowth(jobsPosted, totalJobs)
  const applicationGrowth = calculateGrowth(applicationsSubmitted, totalApplications)
  const messageGrowth = calculateGrowth(messagesSent, totalMessages)

  return {
    overview: {
      totalUsers: totalUsers || 0,
      userGrowth: userGrowth || 0,
      activeJobs: activeJobs || 0,
      jobGrowth: jobGrowth || 0,
      totalApplications: totalApplications || 0,
      applicationGrowth: applicationGrowth || 0,
      totalMessages: totalMessages || 0,
      messageGrowth: messageGrowth || 0,
      usersByRole: {
        SEEKER: usersByRole.SEEKER || 0,
        EMPLOYER: usersByRole.EMPLOYER || 0,
        OFFICER: usersByRole.OFFICER || 0,
        ADMIN: usersByRole.ADMIN || 0,
      },
      recentActivity: {
        newUsers: newUsers || 0,
        jobsPosted: jobsPosted || 0,
        applicationsSubmitted: applicationsSubmitted || 0,
        messagesSent: messagesSent || 0,
      },
    },
    performance: {
      avgResponseTime: 0, // Would need to track in production
      errorRate: 0, // Would need to track in production
      uptime: 100, // Would need to track in production
    },
  }
}

/**
 * Calculate growth percentage
 */
function calculateGrowth(recent, total) {
  if (!total || total === 0) return 0
  return Math.round((recent / total) * 100 * 10) / 10 // Round to 1 decimal
}
