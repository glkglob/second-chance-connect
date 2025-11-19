import { z } from 'zod'
import { uuidSchema, statusSchema } from './common'

export const createJobSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(200, 'Location must be less than 200 characters')
    .trim(),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  requirements: z.string()
    .min(20, 'Requirements must be at least 20 characters')
    .max(3000, 'Requirements must be less than 3000 characters')
    .trim()
    .optional(),
  salary_range: z.string()
    .max(100, 'Salary range must be less than 100 characters')
    .trim()
    .optional(),
  employment_type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY'], {
    errorMap: () => ({ message: 'Invalid employment type' })
  }),
  status: statusSchema.default('DRAFT')
})

export const updateJobSchema = createJobSchema.partial()

export const jobQuerySchema = z.object({
  status: statusSchema.optional(),
  employerId: uuidSchema.optional(),
  search: z.string().max(200).trim().optional()
})

export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
export type JobQuery = z.infer<typeof jobQuerySchema>
