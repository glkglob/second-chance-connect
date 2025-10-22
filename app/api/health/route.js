import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Health Check Endpoint
 * 
 * Returns the health status of the application and its dependencies.
 * This endpoint does not require authentication and can be used by:
 * - Load balancers
 * - Monitoring services
 * - Uptime checkers
 * 
 * GET /api/health
 */
export async function GET() {
  const startTime = Date.now()
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {}
  }

  try {
    // Check database connection
    const dbCheck = await checkDatabase()
    health.checks.database = dbCheck

    // Check environment variables
    const envCheck = checkEnvironmentVariables()
    health.checks.environment = envCheck

    // Overall status
    const allHealthy = Object.values(health.checks).every(check => check.status === 'healthy')
    health.status = allHealthy ? 'healthy' : 'degraded'

    // Response time
    health.responseTime = Date.now() - startTime

    // Return appropriate status code
    const statusCode = allHealthy ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    health.status = 'unhealthy'
    health.error = error.message
    health.responseTime = Date.now() - startTime

    return NextResponse.json(health, { status: 503 })
  }
}

/**
 * Check database connectivity
 */
async function checkDatabase() {
  const check = {
    name: 'database',
    status: 'healthy',
    message: 'Database connection successful'
  }

  try {
    const startTime = Date.now()
    const supabase = await createClient()
    
    // Simple query to test connection
    const { error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    if (error) {
      check.status = 'unhealthy'
      check.message = `Database error: ${error.message}`
      check.error = error.code
    } else {
      check.responseTime = Date.now() - startTime
      check.message = `Database connection successful (${check.responseTime}ms)`
    }
  } catch (error) {
    check.status = 'unhealthy'
    check.message = `Database connection failed: ${error.message}`
  }

  return check
}

/**
 * Check required environment variables
 */
function checkEnvironmentVariables() {
  const check = {
    name: 'environment',
    status: 'healthy',
    message: 'All required environment variables are set'
  }

  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = []

  for (const envVar of required) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  if (missing.length > 0) {
    check.status = 'unhealthy'
    check.message = `Missing required environment variables: ${missing.join(', ')}`
    check.missing = missing
  }

  return check
}

/**
 * Detailed health check (authenticated, admin only)
 * This would include more checks like:
 * - External API availability
 * - Cache status
 * - Queue status
 * - File storage status
 */
export async function POST(request) {
  // This would require admin authentication
  // For now, return basic health check
  return GET()
}
