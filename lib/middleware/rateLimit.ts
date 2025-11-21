import type { NextRequest } from "next/server"
import { Redis } from "@upstash/redis"
import { createRateLimitError } from "@/lib/api-error-handler"

// Initialize Redis client
// Note: This requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars
const redis = process.env.KV_REST_API_URL ? Redis.fromEnv() : null

// Fallback in-memory store for development/testing without Redis
const memoryStore = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(
  req: NextRequest,
  limit = 100,
  window = 60, // seconds
) {
  const ip = req.ip || "anonymous"
  const key = `rate-limit:${ip}`

  if (redis) {
    try {
      const count = await redis.incr(key)

      if (count === 1) {
        await redis.expire(key, window)
      }

      if (count > limit) {
        throw createRateLimitError()
      }

      return null // Success
    } catch (error) {
      // If Redis fails, fail open or fallback to memory?
      // For now, let's log and fallback to memory if it's a connection error,
      // but simpler to just fail open if Redis is down to avoid blocking users.
      console.error("Rate limit Redis error:", error)
      return null
    }
  } else {
    // In-memory fallback (not suitable for serverless production)
    const now = Date.now()
    const record = memoryStore.get(key)

    if (!record || now > record.resetTime) {
      memoryStore.set(key, {
        count: 1,
        resetTime: now + window * 1000,
      })
      return null
    }

    record.count++

    if (record.count > limit) {
      throw createRateLimitError()
    }

    return null
  }
}
