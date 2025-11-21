import { z } from "zod"
import { paginationSchema } from "./common"

export const jobStatusSchema = z.enum(["active", "draft", "closed"])
export const employmentTypeSchema = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY", "INTERNSHIP"])

export const createJobSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(5000, "Description must be less than 5000 characters"),
    salary_min: z.number().positive("Minimum salary must be positive"),
    salary_max: z.number().positive("Maximum salary must be positive"),
    location: z.string().min(2, "Location is required"),
    employment_type: z.string().min(1, "Employment type is required"), // Using string to allow flexibility or match DB exactly if it's just a string column
    status: jobStatusSchema.default("active"),
  })
  .refine((data) => data.salary_max >= data.salary_min, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salary_max"],
  })

export const updateJobSchema = createJobSchema.partial()

export const jobFilterSchema = paginationSchema.extend({
  search: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  min_salary: z.coerce.number().optional(),
})

export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
export type JobFilterInput = z.infer<typeof jobFilterSchema>
