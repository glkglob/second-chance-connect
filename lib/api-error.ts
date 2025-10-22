import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Custom API Error class with enhanced debugging information
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }

  toJSON() {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isDebug = process.env.NEXT_PUBLIC_DEBUG === 'true'

    return {
      error: this.message,
      code: this.code,
      statusCode: this.statusCode,
      // Only include details in development or debug mode
      ...(isDevelopment || isDebug ? { details: this.details } : {}),
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Standard API error responses
 */
export const APIErrors = {
  Unauthorized: () => new APIError('Unauthorized', 401, 'UNAUTHORIZED'),
  Forbidden: (message = 'Forbidden') => new APIError(message, 403, 'FORBIDDEN'),
  NotFound: (resource = 'Resource') => new APIError(`${resource} not found`, 404, 'NOT_FOUND'),
  BadRequest: (message = 'Bad request') => new APIError(message, 400, 'BAD_REQUEST'),
  Conflict: (message = 'Conflict') => new APIError(message, 409, 'CONFLICT'),
  InternalError: (message = 'Internal server error') => new APIError(message, 500, 'INTERNAL_ERROR'),
  ValidationError: (details: unknown) => new APIError('Validation failed', 400, 'VALIDATION_ERROR', details),
}

/**
 * Handles errors in API routes with consistent formatting
 * Logs errors and returns appropriate HTTP responses
 */
export function handleAPIError(error: unknown): NextResponse {
  // Log the error for debugging
  console.error('[v0] API Error:', {
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  })

  // Handle APIError instances
  if (error instanceof APIError) {
    return NextResponse.json(error.toJSON(), { status: error.statusCode })
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }))

    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: formattedErrors,
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    )
  }

  // Handle Supabase errors (PostgrestError)
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const pgError = error as { code: string; message: string; details?: string; hint?: string }

    // Map common PostgreSQL error codes
    const statusCode = (() => {
      if (pgError.code === '23505') return 409 // Unique violation
      if (pgError.code === '23503') return 400 // Foreign key violation
      if (pgError.code === '42501') return 403 // Insufficient privilege (RLS)
      if (pgError.code === 'PGRST301') return 404 // Not found
      return 500
    })()

    const isDevelopment = process.env.NODE_ENV === 'development'

    return NextResponse.json(
      {
        error: isDevelopment ? pgError.message : 'Database error',
        code: `DB_${pgError.code}`,
        ...(isDevelopment ? { details: pgError.details, hint: pgError.hint } : {}),
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    )
  }

  // Handle generic Error instances
  if (error instanceof Error) {
    const isDevelopment = process.env.NODE_ENV === 'development'

    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(isDevelopment ? { message: error.message, stack: error.stack } : {}),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }

  // Fallback for unknown error types
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  )
}

/**
 * Wraps an API handler with error handling
 * Usage: export const GET = withErrorHandler(async (request) => { ... })
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): (...args: Parameters<T>) => Promise<NextResponse> {
  return async (...args: Parameters<T>) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleAPIError(error)
    }
  }
}

/**
 * Validates request body against a Zod schema
 */
export async function validateRequestBody<T>(request: Request, schema: z.ZodSchema<T>): Promise<T> {
  try {
    const body = await request.json()
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw error
    }
    throw new APIError('Invalid JSON in request body', 400, 'INVALID_JSON')
  }
}

/**
 * Logs API request for debugging
 */
export function logAPIRequest(request: Request, context?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_DEBUG !== 'true') return

  console.log('[v0] API Request:', {
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
    ...context,
  })
}

/**
 * Creates a success response with consistent formatting
 */
export function successResponse<T>(data: T, statusCode: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  )
}
