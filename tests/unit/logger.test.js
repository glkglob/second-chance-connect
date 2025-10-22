/**
 * Unit tests for logging utility
 * 
 * These tests verify that the logging functions work correctly
 * and sensitive data is properly sanitized.
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import {
  logError,
  logWarn,
  logInfo,
  sanitizeLogData,
  startPerformanceMonitor
} from '../../lib/logger.js'

describe('Logger', () => {
  let consoleErrorSpy
  let consoleWarnSpy
  let consoleLogSpy

  beforeEach(() => {
    // Mock console methods
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore console methods
    consoleErrorSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleLogSpy.mockRestore()
  })

  describe('logError', () => {
    it('should log error with message and context', () => {
      const error = new Error('Test error')
      const context = { userId: '123', action: 'test' }

      logError('Something failed', error, context)

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      
      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0])
      expect(loggedData.level).toBe('error')
      expect(loggedData.message).toBe('Something failed')
      expect(loggedData.name).toBe('Error')
      expect(loggedData.userId).toBe('123')
    })

    it('should include stack trace', () => {
      const error = new Error('Test error')
      logError('Error occurred', error)

      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0])
      expect(loggedData.stack).toBeDefined()
      expect(typeof loggedData.stack).toBe('string')
    })
  })

  describe('logWarn', () => {
    it('should log warning with message and context', () => {
      const context = { action: 'deprecated_api' }

      logWarn('Using deprecated API', context)

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][0])
      expect(loggedData.level).toBe('warn')
      expect(loggedData.message).toBe('Using deprecated API')
      expect(loggedData.action).toBe('deprecated_api')
    })
  })

  describe('logInfo', () => {
    it('should log info with message and context', () => {
      const context = { userId: '456' }

      logInfo('User logged in', context)

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
      
      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0])
      expect(loggedData.level).toBe('info')
      expect(loggedData.message).toBe('User logged in')
      expect(loggedData.userId).toBe('456')
    })

    it('should include timestamp', () => {
      logInfo('Test message')

      const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0])
      expect(loggedData.timestamp).toBeDefined()
      expect(new Date(loggedData.timestamp)).toBeInstanceOf(Date)
    })
  })

  describe('sanitizeLogData', () => {
    it('should remove password field', () => {
      const data = {
        username: 'john',
        password: 'secret123',
        email: 'john@example.com'
      }

      const sanitized = sanitizeLogData(data)

      expect(sanitized.username).toBe('john')
      expect(sanitized.email).toBe('john@example.com')
      expect(sanitized.password).toBe('***REDACTED***')
    })

    it('should remove multiple sensitive fields', () => {
      const data = {
        user: 'john',
        token: 'abc123',
        apiKey: 'key456',
        secret: 'secret789'
      }

      const sanitized = sanitizeLogData(data)

      expect(sanitized.user).toBe('john')
      expect(sanitized.token).toBe('***REDACTED***')
      expect(sanitized.apiKey).toBe('***REDACTED***')
      expect(sanitized.secret).toBe('***REDACTED***')
    })

    it('should handle non-object values', () => {
      expect(sanitizeLogData(null)).toBeNull()
      expect(sanitizeLogData(undefined)).toBeUndefined()
      expect(sanitizeLogData('string')).toBe('string')
      expect(sanitizeLogData(123)).toBe(123)
    })

    it('should not modify data without sensitive fields', () => {
      const data = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      }

      const sanitized = sanitizeLogData(data)

      expect(sanitized).toEqual(data)
    })
  })

  describe('PerformanceMonitor', () => {
    it('should measure operation duration', (done) => {
      const monitor = startPerformanceMonitor('test-operation')

      setTimeout(() => {
        const duration = monitor.end()
        
        expect(duration).toBeGreaterThan(0)
        expect(duration).toBeLessThan(200) // Should be around 100ms
        done()
      }, 100)
    })

    it('should log slow operations as warnings', () => {
      // Mock Date.now to simulate slow operation
      const originalDateNow = Date.now
      let callCount = 0
      
      Date.now = jest.fn(() => {
        callCount++
        return callCount === 1 ? 0 : 2000 // 2 seconds
      })

      const monitor = startPerformanceMonitor('slow-operation')
      monitor.end()

      expect(consoleWarnSpy).toHaveBeenCalled()
      
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][0])
      expect(loggedData.message).toContain('Slow operation')
      expect(loggedData.operation).toBe('slow-operation')
      expect(loggedData.duration).toBe(2000)

      // Restore Date.now
      Date.now = originalDateNow
    })
  })
})
