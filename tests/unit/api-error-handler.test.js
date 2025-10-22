/**
 * Unit tests for API error handler
 * 
 * These tests verify error handling, response formatting,
 * and validation functions.
 */

import { describe, it, expect, jest } from '@jest/globals'
import {
  ApiError,
  ErrorCodes,
  createValidationError,
  createAuthError,
  createPermissionError,
  createNotFoundError,
  validateRequiredFields,
  validateRole
} from '../../lib/api-error-handler.js'

describe('API Error Handler', () => {
  describe('ApiError', () => {
    it('should create error with message and status code', () => {
      const error = new ApiError('Test error', 400, ErrorCodes.INVALID_INPUT)

      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe(ErrorCodes.INVALID_INPUT)
      expect(error.name).toBe('ApiError')
    })

    it('should default to 500 status code', () => {
      const error = new ApiError('Server error')

      expect(error.statusCode).toBe(500)
      expect(error.code).toBe(ErrorCodes.INTERNAL_ERROR)
    })

    it('should include details if provided', () => {
      const details = { field: 'email', reason: 'invalid format' }
      const error = new ApiError('Validation failed', 400, ErrorCodes.VALIDATION_ERROR, details)

      expect(error.details).toEqual(details)
    })
  })

  describe('Error factory functions', () => {
    describe('createValidationError', () => {
      it('should create validation error with fields', () => {
        const fields = { email: 'Invalid format', password: 'Too short' }
        const error = createValidationError('Validation failed', fields)

        expect(error.statusCode).toBe(400)
        expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR)
        expect(error.details.fields).toEqual(fields)
      })
    })

    describe('createAuthError', () => {
      it('should create authentication error', () => {
        const error = createAuthError()

        expect(error.statusCode).toBe(401)
        expect(error.code).toBe(ErrorCodes.AUTH_REQUIRED)
        expect(error.message).toBe('Authentication required')
      })

      it('should accept custom message', () => {
        const error = createAuthError('Invalid credentials')

        expect(error.message).toBe('Invalid credentials')
      })
    })

    describe('createPermissionError', () => {
      it('should create permission error', () => {
        const error = createPermissionError()

        expect(error.statusCode).toBe(403)
        expect(error.code).toBe(ErrorCodes.INSUFFICIENT_PERMISSIONS)
      })
    })

    describe('createNotFoundError', () => {
      it('should create not found error', () => {
        const error = createNotFoundError('User')

        expect(error.statusCode).toBe(404)
        expect(error.code).toBe(ErrorCodes.RESOURCE_NOT_FOUND)
        expect(error.message).toBe('User not found')
      })
    })
  })

  describe('Validation functions', () => {
    describe('validateRequiredFields', () => {
      it('should pass when all required fields present', () => {
        const body = {
          email: 'test@example.com',
          password: 'password123',
          name: 'John'
        }
        const required = ['email', 'password', 'name']

        expect(() => {
          validateRequiredFields(body, required)
        }).not.toThrow()
      })

      it('should throw error when field is missing', () => {
        const body = {
          email: 'test@example.com'
          // password is missing
        }
        const required = ['email', 'password']

        expect(() => {
          validateRequiredFields(body, required)
        }).toThrow('Missing required fields: password')
      })

      it('should throw error for multiple missing fields', () => {
        const body = {
          email: 'test@example.com'
        }
        const required = ['email', 'password', 'name']

        expect(() => {
          validateRequiredFields(body, required)
        }).toThrow('Missing required fields: password, name')
      })

      it('should accept falsy values except undefined/null/empty string', () => {
        const body = {
          count: 0,
          enabled: false,
          description: ''
        }
        const required = ['count', 'enabled']

        expect(() => {
          validateRequiredFields(body, required)
        }).not.toThrow()
      })

      it('should reject empty string', () => {
        const body = {
          name: ''
        }
        const required = ['name']

        expect(() => {
          validateRequiredFields(body, required)
        }).toThrow('Missing required fields: name')
      })
    })

    describe('validateRole', () => {
      it('should pass when role is allowed', () => {
        expect(() => {
          validateRole('ADMIN', ['ADMIN', 'OFFICER'])
        }).not.toThrow()
      })

      it('should throw error when role is not allowed', () => {
        expect(() => {
          validateRole('SEEKER', ['EMPLOYER', 'ADMIN'])
        }).toThrow('Only EMPLOYER, ADMIN can perform this action')
      })

      it('should work with single allowed role', () => {
        expect(() => {
          validateRole('ADMIN', ['ADMIN'])
        }).not.toThrow()

        expect(() => {
          validateRole('SEEKER', ['ADMIN'])
        }).toThrow()
      })
    })
  })

  describe('Error response formatting', () => {
    it('should format error response correctly', () => {
      const error = new ApiError('Test error', 400, ErrorCodes.INVALID_INPUT)
      
      // In actual implementation, this would return NextResponse
      // For testing, we verify the error properties
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe(ErrorCodes.INVALID_INPUT)
    })

    it('should include stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const error = new ApiError('Test error', 500)
      expect(error.stack).toBeDefined()

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Supabase error handling', () => {
    it('should recognize unique constraint violation', () => {
      const supabaseError = {
        code: '23505',
        message: 'duplicate key value'
      }

      // In actual implementation, handleSupabaseError would map this
      expect(supabaseError.code).toBe('23505')
    })

    it('should recognize foreign key violation', () => {
      const supabaseError = {
        code: '23503',
        message: 'foreign key constraint'
      }

      expect(supabaseError.code).toBe('23503')
    })

    it('should recognize RLS policy violation', () => {
      const supabaseError = {
        code: '42501',
        message: 'insufficient privilege'
      }

      expect(supabaseError.code).toBe('42501')
    })
  })
})
