import { z } from "zod"
import { uuidSchema, paginationSchema } from "./common"

export const applicationStatusSchema = z.enum(["applied", "reviewed", "accepted", "rejected"])

export const createApplicationSchema = z.object({
  job_id: uuidSchema,
  cover_letter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters")
    .max(2000, "Cover letter must be less than 2000 characters"),
})

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusSchema,
})

export const applicationFilterSchema = paginationSchema.extend({
  job_id: uuidSchema.optional(),
  status: applicationStatusSchema.optional(),
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>
