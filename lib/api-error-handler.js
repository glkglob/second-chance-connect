/**
 * Centralized API error handling
 * 
 * Provides consistent error responses and logging across all API routes
 */

import { NextResponse } from 'next/server'
import { logError, logWarn, sanitizeLogData } from './logger'

/**
 * Standard error codes
 */
export const ErrorCodes = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INVALID_INPUT: 'INVALID_INPUT',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
}

/**
 * Error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, code = ErrorCodes.INTERNAL_ERROR, details = {}) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

/**
 * Create standardized error response
 */
export function createErrorResponse(error, statusCode = 500, context = {}) {
  // Determine if error is an ApiError or generic error
  const isApiError = error instanceof ApiError

  const errorResponse = {
    error: error.message || 'An unexpected error occurred',
    code: isApiError ? error.code : ErrorCodes.INTERNAL_ERROR
  }
  
  // Only expose stack traces and error details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack
    errorResponse.details = isApiError ? error.details : {}
  }

  // Log the error with context
  const logContext = sanitizeLogData({
    ...context,
    statusCode: isApiError ? error.statusCode : statusCode,
    code: errorResponse.code,
    details: isApiError ? error.details : {}
  })

  if (statusCode >= 500) {
    logError(`API Error: ${error.message}`, error, logContext)
  } else {
    logWarn(`API Warning: ${error.message}`, logContext)
  }

  return NextResponse.json(
    errorResponse,
    { status: isApiError ? error.statusCode : statusCode }
  )
}

/**
 * Wrap async API handler with error handling
 */
export function withErrorHandling(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (error) {
      // Handle specific error types
      if (error instanceof ApiError) {
        return createErrorResponse(error, error.statusCode, {
          path: request.url,
          method: request.method
        })
      }

      // Handle Supabase errors
      if (error.code) {
        return handleSupabaseError(error, {
          path: request.url,
          method: request.method
        })
      }

      // Generic error handling
      return createErrorResponse(error, 500, {
        path: request.url,
        method: request.method
      })
    }
  }
}

/**
 * Handle Supabase-specific errors
 */
function handleSupabaseError(error, context) {
  const supabaseErrorMap = {
    '23505': { // Unique constraint violation
      statusCode: 409,
      code: ErrorCodes.DUPLICATE_ENTRY,
      message: 'Resource already exists'
    },
    '23503': { // Foreign key violation
      statusCode: 400,
      code: ErrorCodes.INVALID_INPUT,
      message: 'Referenced resource does not exist'
    },
    '42501': { // Insufficient privilege (RLS)
      statusCode: 403,
      code: ErrorCodes.INSUFFICIENT_PERMISSIONS,
      message: 'Insufficient permissions'
    },
    'PGRST116': { // No rows returned
      statusCode: 404,
      code: ErrorCodes.RESOURCE_NOT_FOUND,
      message: 'Resource not found'
    }
  }

  const errorMapping = supabaseErrorMap[error.code]

  if (errorMapping) {
    const apiError = new ApiError(
      errorMapping.message,
      errorMapping.statusCode,
      errorMapping.code,
      { originalError: error.message }
    )
    return createErrorResponse(apiError, errorMapping.statusCode, context)
  }

  // Unknown Supabase error
  logError('Unknown Supabase error', error, context)
  return createErrorResponse(
    new Error('Database operation failed'),
    500,
    context
  )
}

/**
 * Validation error helper
 */
export function createValidationError(message, fields = {}) {
  return new ApiError(
    message,
    400,
    ErrorCodes.VALIDATION_ERROR,
    { fields }
  )
}

/**
 * Authentication error helper
 */
export function createAuthError(message = 'Authentication required') {
  return new ApiError(
    message,
    401,
    ErrorCodes.AUTH_REQUIRED
  )
}

/**
 * Permission error helper
 */
export function createPermissionError(message = 'Insufficient permissions') {
  return new ApiError(
    message,
    403,
    ErrorCodes.INSUFFICIENT_PERMISSIONS
  )
}

/**
 * Not found error helper
 */
export function createNotFoundError(resource = 'Resource') {
  return new ApiError(
    `${resource} not found`,
    404,
    ErrorCodes.RESOURCE_NOT_FOUND
  )
}

/**
 * Rate limit error helper
 */
export function createRateLimitError(retryAfter = 60) {
  return new ApiError(
    'Too many requests, please try again later',
    429,
    ErrorCodes.RATE_LIMIT_EXCEEDED,
    { retryAfter }
  )
}

/**
 * Middleware to catch and handle errors
 */
export function errorMiddleware(handler) {
  return async (request, context) => {
    const startTime = Date.now()

    try {
      const response = await handler(request, context)
      
      // Log successful response
      const duration = Date.now() - startTime
      const status = response?.status || 200
      
      if (status >= 400) {
        logWarn('API request completed with client error', {
          method: request.method,
          path: request.url,
          status,
          duration
        })
      }

      return response
    } catch (error) {
      const duration = Date.now() - startTime
      
      logError('API request failed', error, {
        method: request.method,
        path: request.url,
        duration
      })

      return createErrorResponse(error, 500, {
        method: request.method,
        path: request.url,
        duration
      })
    }
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(body, requiredFields) {
  const missingFields = []
  
  for (const field of requiredFields) {
    if (!body[field] && body[field] !== 0 && body[field] !== false) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    throw createValidationError(
      `Missing required fields: ${missingFields.join(', ')}`,
      { missingFields }
    )
  }
}

/**
 * Validate user role
 */
export function validateRole(userRole, allowedRoles) {
  if (!allowedRoles.includes(userRole)) {
    throw createPermissionError(
      `Only ${allowedRoles.join(', ')} can perform this action`
    )
  }
}

/**
 * Export all utilities
 */
export default {
  ApiError,
  ErrorCodes,
  createErrorResponse,
  withErrorHandling,
  createValidationError,
  createAuthError,
  createPermissionError,
  createNotFoundError,
  createRateLimitError,
  errorMiddleware,
  validateRequiredFields,
  validateRole
}
