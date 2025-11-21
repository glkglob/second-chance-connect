import { z } from "zod"
import { uuidSchema, paginationSchema } from "./common"

export const createMessageSchema = z.object({
  recipient_id: uuidSchema,
  content: z.string().min(1, "Message cannot be empty").max(1000, "Message must be less than 1000 characters"),
})

export const messageFilterSchema = paginationSchema.extend({
  conversation_with: uuidSchema.optional(),
})

export type CreateMessageInput = z.infer<typeof createMessageSchema>
