import { z } from 'zod'
import { uuidSchema } from './common'

const applicationStatusSchema = z.enum([
  'PENDING',
  'REVIEWED',
  'ACCEPTED',
  'REJECTED'
])

export const createApplicationSchema = z.object({
  job_id: uuidSchema,
  cover_letter: z.string()
    .min(100, 'Cover letter must be at least 100 characters')
    .max(2000, 'Cover letter must be less than 2000 characters')
    .trim(),
  resume_url: z.string()
    .url('Invalid resume URL')
    .optional(),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .trim()
    .optional()
})

export const updateApplicationSchema = z.object({
  status: applicationStatusSchema,
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .trim()
    .optional()
})

export const applicationQuerySchema = z.object({
  seekerId: uuidSchema.optional(),
  jobId: uuidSchema.optional(),
  status: applicationStatusSchema.optional()
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>
export type ApplicationQuery = z.infer<typeof applicationQuerySchema>
