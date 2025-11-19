import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  interval: number // milliseconds
  limit: number // max requests per interval
}

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

// Rate limit configurations for different endpoint types
export const rateLimitConfigs = {
  // API routes: 100 requests per minute
  api: { interval: 60 * 1000, limit: 100 },

  // Auth routes: 5 requests per minute (stricter)
  auth: { interval: 60 * 1000, limit: 5 },

  // Public routes: 200 requests per minute
  public: { interval: 60 * 1000, limit: 200 },

  // Admin routes: 500 requests per minute
  admin: { interval: 60 * 1000, limit: 500 }
}

/**
 * Get client identifier from request
 * Uses IP address or user ID if authenticated
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from headers (works on Vercel)
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  return ip
}

/**
 * Check rate limit using Vercel KV (Redis)
 * Implements sliding window algorithm
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowStart = now - config.interval

  try {
    // Remove old entries outside the current window
    await kv.zremrangebyscore(key, 0, windowStart)

    // Count requests in current window
    const count = await kv.zcount(key, windowStart, now)

    if (count >= config.limit) {
      // Rate limit exceeded
      const oldestEntry = await kv.zrange(key, 0, 0, { withScores: true })
      const resetTime = oldestEntry.length > 0
        ? Number(oldestEntry[1]) + config.interval
        : now + config.interval

      return {
        success: false,
        remaining: 0,
        reset: resetTime
      }
    }

    // Add current request to the window
    await kv.zadd(key, { score: now, member: `${now}:${Math.random()}` })

    // Set expiration on the key
    await kv.expire(key, Math.ceil(config.interval / 1000))

    return {
      success: true,
      remaining: config.limit - count - 1,
      reset: now + config.interval
    }
  } catch (error) {
    // If Redis fails, allow the request (fail open)
    console.error('Rate limit check failed:', error)
    return {
      success: true,
      remaining: config.limit,
      reset: now + config.interval
    }
  }
}

/**
 * Apply rate limiting middleware to API routes
 */
export async function applyRateLimit(
  request: NextRequest,
  type: keyof typeof rateLimitConfigs = 'api'
): Promise<NextResponse | null> {
  const identifier = getClientIdentifier(request)
  const config = rateLimitConfigs[type]

  const result = await checkRateLimit(identifier, config)

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)

    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: result.reset
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': retryAfter.toString()
        }
      }
    )
  }

  // Rate limit passed, return null to continue
  return null
}
