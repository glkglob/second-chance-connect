/**
 * Centralized logging utility for Second Chance Connect
 * 
 * Provides structured logging with different severity levels
 * and optional integration with external monitoring services.
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
}

/**
 * Format log message with timestamp and context
 */
function formatLogMessage(level, message, context = {}) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    ...context
  }

  // In development, make logs more readable
  if (process.env.NODE_ENV === 'development') {
    return JSON.stringify(logEntry, null, 2)
  }

  // In production, use compact JSON for log aggregation
  return JSON.stringify(logEntry)
}

/**
 * Log error with full stack trace
 */
export function logError(message, error, context = {}) {
  const errorDetails = {
    name: error?.name,
    message: error?.message,
    stack: error?.stack,
    ...context
  }

  const logMessage = formatLogMessage(LOG_LEVELS.ERROR, message, errorDetails)
  console.error(logMessage)

  // Send to external monitoring service if configured
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry integration would go here
    // captureException(error, { contexts: { custom: context } })
  }

  return logMessage
}

/**
 * Log warning
 */
export function logWarn(message, context = {}) {
  const logMessage = formatLogMessage(LOG_LEVELS.WARN, message, context)
  console.warn(logMessage)
  return logMessage
}

/**
 * Log info
 */
export function logInfo(message, context = {}) {
  const logMessage = formatLogMessage(LOG_LEVELS.INFO, message, context)
  console.log(logMessage)
  return logMessage
}

/**
 * Log debug (only in development)
 */
export function logDebug(message, context = {}) {
  if (process.env.NODE_ENV === 'development') {
    const logMessage = formatLogMessage(LOG_LEVELS.DEBUG, message, context)
    console.debug(logMessage)
    return logMessage
  }
}

/**
 * Log API request
 */
export function logApiRequest(method, path, context = {}) {
  logInfo(`API ${method} ${path}`, {
    type: 'api_request',
    method,
    path,
    ...context
  })
}

/**
 * Log API response
 */
export function logApiResponse(method, path, status, duration, context = {}) {
  const level = status >= 500 ? LOG_LEVELS.ERROR : status >= 400 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO
  
  const message = `API ${method} ${path} - ${status} (${duration}ms)`
  
  if (level === LOG_LEVELS.ERROR) {
    logError(message, new Error('API Error'), { status, duration, ...context })
  } else if (level === LOG_LEVELS.WARN) {
    logWarn(message, { status, duration, ...context })
  } else {
    logInfo(message, { type: 'api_response', status, duration, ...context })
  }
}

/**
 * Log authentication event
 */
export function logAuth(event, userId, context = {}) {
  logInfo(`Auth: ${event}`, {
    type: 'auth',
    event,
    userId,
    ...context
  })
}

/**
 * Log database query (debug only)
 */
export function logQuery(query, duration, context = {}) {
  if (process.env.NODE_ENV === 'development') {
    logDebug('Database query executed', {
      type: 'db_query',
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration,
      ...context
    })
  }
}

/**
 * Log security event
 */
export function logSecurity(event, context = {}) {
  logWarn(`Security: ${event}`, {
    type: 'security',
    event,
    ...context
  })
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  constructor(operation) {
    this.operation = operation
    this.startTime = Date.now()
  }

  end(context = {}) {
    const duration = Date.now() - this.startTime
    
    if (duration > 1000) {
      logWarn(`Slow operation: ${this.operation}`, {
        type: 'performance',
        operation: this.operation,
        duration,
        ...context
      })
    } else {
      logDebug(`Operation completed: ${this.operation}`, {
        type: 'performance',
        operation: this.operation,
        duration,
        ...context
      })
    }
    
    return duration
  }
}

/**
 * Create a performance monitor
 */
export function startPerformanceMonitor(operation) {
  return new PerformanceMonitor(operation)
}

/**
 * Sanitize sensitive data from logs
 */
export function sanitizeLogData(data) {
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'apiKey',
    'ssn',
    'creditCard'
  ]

  if (typeof data !== 'object' || data === null) {
    return data
  }

  const sanitized = { ...data }

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '***REDACTED***'
    }
  }

  return sanitized
}

/**
 * Log API error
 */
export function logApiError(error, request, context = {}) {
  logError('API Error', error, {
    type: 'api_error',
    url: request?.url,
    method: request?.method,
    ...context
  })
}

/**
 * Log database error
 */
export function logDatabaseError(error, operation, table, context = {}) {
  logError('Database Error', error, {
    type: 'db_error',
    operation,
    table,
    ...context
  })
}

/**
 * Logger object for method-based usage
 */
export const logger = {
  apiRequest: logApiRequest,
  apiResponse: logApiResponse,
  auth: logAuth,
  dbQuery: logQuery,
  security: logSecurity,
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
  sanitize: sanitizeLogData
}

/**
 * Export all functions as default
 */
export default {
  logError,
  logWarn,
  logInfo,
  logDebug,
  logApiRequest,
  logApiResponse,
  logAuth,
  logQuery,
  logSecurity,
  logApiError,
  logDatabaseError,
  logger,
  startPerformanceMonitor,
  sanitizeLogData
}
