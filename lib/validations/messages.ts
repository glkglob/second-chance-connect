import { z } from 'zod'
import { uuidSchema } from './common'

export const createMessageSchema = z.object({
  receiver_id: uuidSchema,
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  content: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim()
})

export const messageQuerySchema = z.object({
  senderId: uuidSchema.optional(),
  receiverId: uuidSchema.optional(),
  unreadOnly: z.coerce.boolean().optional()
})

export type CreateMessageInput = z.infer<typeof createMessageSchema>
export type MessageQuery = z.infer<typeof messageQuerySchema>
