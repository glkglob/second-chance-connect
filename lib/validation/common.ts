import { z } from "zod"

export const uuidSchema = z.string().uuid()

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

export const idParamsSchema = z.object({
  id: uuidSchema,
})
