/**
 * Rate Limiting Middleware
 * 
 * Implements token bucket algorithm for API rate limiting
 * to prevent abuse and ensure fair resource usage.
 */

import { createRateLimitError } from './api-error-handler'
import { logWarn, logSecurity } from './logger'

/**
 * In-memory store for rate limit tracking
 * In production, use Redis or similar distributed cache
 */
const rateLimitStore = new Map()

/**
 * Clean up old entries periodically
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.resetTime > 60000) { // 1 minute past reset time
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Run every minute

/**
 * Rate limit configuration
 */
const RATE_LIMITS = {
  // Authenticated requests: 100 per minute
  authenticated: {
    maxRequests: 100,
    windowMs: 60000 // 1 minute
  },
  // Unauthenticated requests: 20 per minute
  unauthenticated: {
    maxRequests: 20,
    windowMs: 60000
  },
  // POST requests: 20 per minute
  post: {
    maxRequests: 20,
    windowMs: 60000
  },
  // Sensitive endpoints (login, signup): 5 per minute
  sensitive: {
    maxRequests: 5,
    windowMs: 60000
  }
}

/**
 * Get client identifier from request
 */
function getClientId(request, user) {
  // Use user ID if authenticated
  if (user?.id) {
    return `user:${user.id}`
  }

  // Use IP address for unauthenticated requests
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `ip:${ip}`
}

/**
 * Get rate limit key
 */
function getRateLimitKey(clientId, endpoint) {
  return `${clientId}:${endpoint}`
}

/**
 * Check if rate limit exceeded
 */
function isRateLimited(key, config) {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record) {
    // First request
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    }
  }

  // Check if window has expired
  if (now > record.resetTime) {
    // Reset counter
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    }
  }

  // Increment counter
  record.count++

  if (record.count > config.maxRequests) {
    // Rate limit exceeded
    return {
      limited: true,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    }
  }

  return {
    limited: false,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime
  }
}

/**
 * Rate limit middleware
 */
export async function rateLimit(request, user = null, options = {}) {
  const { endpoint = 'default', type = 'authenticated' } = options

  // Get rate limit configuration
  let config = RATE_LIMITS[type] || RATE_LIMITS.authenticated

  // Override for sensitive endpoints
  if (endpoint.includes('login') || endpoint.includes('signup')) {
    config = RATE_LIMITS.sensitive
  }

  // Get client identifier
  const clientId = getClientId(request, user)
  const key = getRateLimitKey(clientId, endpoint)

  // Check rate limit
  const result = isRateLimited(key, config)

  if (result.limited) {
    // Log rate limit violation
    logSecurity('Rate limit exceeded', {
      clientId,
      endpoint,
      attempts: rateLimitStore.get(key)?.count
    })

    // Throw rate limit error
    throw createRateLimitError(result.retryAfter)
  }

  // Log warning if approaching limit
  if (result.remaining < 10) {
    logWarn('Approaching rate limit', {
      clientId,
      endpoint,
      remaining: result.remaining
    })
  }

  return {
    remaining: result.remaining,
    resetTime: result.resetTime,
    headers: {
      'X-RateLimit-Limit': config.maxRequests,
      'X-RateLimit-Remaining': result.remaining,
      'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000)
    }
  }
}

/**
 * Rate limit middleware wrapper
 */
export function withRateLimit(handler, options = {}) {
  return async (request, context) => {
    try {
      // Get user from context if available
      const user = context?.user || null

      // Check rate limit
      const rateLimitResult = await rateLimit(request, user, {
        endpoint: new URL(request.url).pathname,
        type: user ? 'authenticated' : 'unauthenticated',
        ...options
      })

      // Call handler
      const response = await handler(request, context)

      // Add rate limit headers if response is NextResponse
      if (response?.headers) {
        Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
      }

      return response
    } catch (error) {
      throw error
    }
  }
}

/**
 * Clear rate limit for a client (admin function)
 */
export function clearRateLimit(clientId, endpoint = null) {
  if (endpoint) {
    const key = getRateLimitKey(clientId, endpoint)
    rateLimitStore.delete(key)
  } else {
    // Clear all entries for client
    for (const key of rateLimitStore.keys()) {
      if (key.startsWith(clientId)) {
        rateLimitStore.delete(key)
      }
    }
  }
}

/**
 * Get rate limit stats (admin function)
 */
export function getRateLimitStats() {
  const stats = {
    totalKeys: rateLimitStore.size,
    byClientType: {
      user: 0,
      ip: 0
    },
    topClients: []
  }

  const clientCounts = new Map()

  for (const [key, value] of rateLimitStore.entries()) {
    const [clientId] = key.split(':')
    
    // Count by type
    if (clientId.startsWith('user:')) {
      stats.byClientType.user++
    } else {
      stats.byClientType.ip++
    }

    // Track request counts
    const count = clientCounts.get(clientId) || 0
    clientCounts.set(clientId, count + value.count)
  }

  // Get top 10 clients by request count
  stats.topClients = Array.from(clientCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([clientId, count]) => ({ clientId, count }))

  return stats
}

export default {
  rateLimit,
  withRateLimit,
  clearRateLimit,
  getRateLimitStats
}
