/**
 * Structured logging utility for Second Chance Connect
 * Provides consistent logging with context, levels, and monitoring integration
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
}

const isProduction = process.env.NODE_ENV === 'production'
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true'

/**
 * Format log entry with timestamp and context
 */
function formatLogEntry(level, message, context = {}) {
  const timestamp = new Date().toISOString()
  const entry = {
    timestamp,
    level,
    message,
    ...context,
  }

  // Add environment info in production
  if (isProduction) {
    entry.env = 'production'
    entry.version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  }

  return entry
}

/**
 * Send log to external monitoring service (e.g., Sentry, Vercel)
 */
function sendToMonitoring(level, message, context) {
  if (!isProduction) return

  // Integration point for monitoring services
  // Example: Sentry, Vercel Analytics, custom endpoint
  try {
    // If Sentry is configured
    if (typeof window !== 'undefined' && window.Sentry) {
      if (level === LOG_LEVELS.ERROR) {
        window.Sentry.captureException(context.error || new Error(message), {
          extra: context,
        })
      } else {
        window.Sentry.captureMessage(message, {
          level,
          extra: context,
        })
      }
    }

    // If custom monitoring endpoint is configured
    if (process.env.NEXT_PUBLIC_MONITORING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_MONITORING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatLogEntry(level, message, context)),
      }).catch(() => {
        // Silently fail to prevent logging loops
      })
    }
  } catch (e) {
    // Prevent logging errors from breaking the app
    console.error('[Logger] Failed to send to monitoring:', e)
  }
}

/**
 * Core logging function
 */
function log(level, message, context = {}) {
  const entry = formatLogEntry(level, message, context)

  // Console output
  const consoleMethod = console[level] || console.log
  const prefix = `[v0:${level}]`

  if (isDebugEnabled || level === LOG_LEVELS.ERROR || level === LOG_LEVELS.WARN) {
    consoleMethod(prefix, message, context)
  }

  // Send to monitoring in production
  if (isProduction && (level === LOG_LEVELS.ERROR || level === LOG_LEVELS.WARN)) {
    sendToMonitoring(level, message, context)
  }

  return entry
}

/**
 * Logger API
 */
export const logger = {
  /**
   * Log error - always logged and sent to monitoring
   */
  error(message, error, context = {}) {
    return log(LOG_LEVELS.ERROR, message, {
      ...context,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : undefined,
    })
  },

  /**
   * Log warning - logged in production and dev
   */
  warn(message, context = {}) {
    return log(LOG_LEVELS.WARN, message, context)
  },

  /**
   * Log info - production only
   */
  info(message, context = {}) {
    if (isProduction || isDebugEnabled) {
      return log(LOG_LEVELS.INFO, message, context)
    }
  },

  /**
   * Log debug - debug mode only
   */
  debug(message, context = {}) {
    if (isDebugEnabled) {
      return log(LOG_LEVELS.DEBUG, message, context)
    }
  },

  /**
   * Log API request
   */
  apiRequest(method, path, context = {}) {
    return this.info(`API Request: ${method} ${path}`, {
      ...context,
      type: 'api_request',
      method,
      path,
    })
  },

  /**
   * Log API response
   */
  apiResponse(method, path, status, duration, context = {}) {
    const level = status >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO
    return log(level, `API Response: ${method} ${path} ${status}`, {
      ...context,
      type: 'api_response',
      method,
      path,
      status,
      duration,
    })
  },

  /**
   * Log database query
   */
  dbQuery(table, operation, context = {}) {
    return this.debug(`DB Query: ${operation} on ${table}`, {
      ...context,
      type: 'db_query',
      table,
      operation,
    })
  },

  /**
   * Log authentication event
   */
  authEvent(event, userId, context = {}) {
    return this.info(`Auth Event: ${event}`, {
      ...context,
      type: 'auth_event',
      event,
      userId,
    })
  },

  /**
   * Log security event - always logged
   */
  security(message, context = {}) {
    return log(LOG_LEVELS.WARN, `Security: ${message}`, {
      ...context,
      type: 'security',
    })
  },
}

/**
 * Error boundary logger
 */
export function logComponentError(error, errorInfo, componentStack) {
  logger.error('React Component Error', error, {
    type: 'component_error',
    componentStack,
    errorInfo,
  })
}

/**
 * API route error logger with request context
 */
export function logApiError(error, request, context = {}) {
  const method = request.method
  const url = request.url
  const headers = Object.fromEntries(request.headers.entries())

  logger.error('API Route Error', error, {
    ...context,
    type: 'api_error',
    method,
    url,
    headers: {
      userAgent: headers['user-agent'],
      referer: headers['referer'],
    },
  })
}

/**
 * Database error logger
 */
export function logDatabaseError(error, operation, table, context = {}) {
  logger.error('Database Error', error, {
    ...context,
    type: 'database_error',
    operation,
    table,
  })
}

/**
 * Performance logger
 */
export function logPerformance(metric, value, context = {}) {
  if (isProduction) {
    logger.info(`Performance: ${metric}`, {
      ...context,
      type: 'performance',
      metric,
      value,
    })
  }
}

export default logger
