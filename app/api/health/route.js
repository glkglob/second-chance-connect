import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Health check endpoint for monitoring
 * GET /api/health
 * 
 * Returns system status and dependencies health
 */
export async function GET() {
  const startTime = Date.now()
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {},
  }

  // Check Supabase connection
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').select('count').limit(1).single()
    
    health.checks.database = {
      status: error ? 'unhealthy' : 'healthy',
      message: error ? error.message : 'Connected',
      responseTime: Date.now() - startTime,
    }
    
    if (error) {
      health.status = 'degraded'
    }
  } catch (error) {
    health.checks.database = {
      status: 'unhealthy',
      message: error.message,
      responseTime: Date.now() - startTime,
    }
    health.status = 'unhealthy'
  }

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  )

  health.checks.environment = {
    status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
    message: missingEnvVars.length === 0 
      ? 'All required variables set' 
      : `Missing: ${missingEnvVars.join(', ')}`,
  }

  if (missingEnvVars.length > 0) {
    health.status = 'unhealthy'
  }

  // Overall response time
  health.responseTime = Date.now() - startTime

  // Return appropriate status code
  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 207 : 503

  return NextResponse.json(health, { status: statusCode })
}
