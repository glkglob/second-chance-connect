import { z } from "zod"
import { paginationSchema } from "./common"

export const createServiceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  contact_info: z.string().min(5, "Contact info is required"),
})

export const updateServiceSchema = createServiceSchema.partial()

export const serviceFilterSchema = paginationSchema.extend({
  category: z.string().optional(),
  search: z.string().optional(),
})

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
