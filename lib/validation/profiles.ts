import { z } from "zod"

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  avatar_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
