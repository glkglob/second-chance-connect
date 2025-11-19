import { z } from 'zod'

// Common validation patterns
export const uuidSchema = z.string().uuid('Invalid UUID format')

export const emailSchema = z.string().email('Invalid email address')

export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number format'
).optional()

export const urlSchema = z.string().url('Invalid URL format').optional()

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
})

export const statusSchema = z.enum(['ACTIVE', 'DRAFT', 'CLOSED'])

export const roleSchema = z.enum(['SEEKER', 'EMPLOYER', 'OFFICER', 'ADMIN'])
