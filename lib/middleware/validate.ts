import type { NextRequest } from "next/server"
import type { ZodSchema } from "zod"
import { createValidationError } from "@/lib/api-error-handler"

export async function validateInput<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  try {
    const body = await req.json()
    return schema.parse(body)
  } catch (error: any) {
    // If it's a Zod error, format it nicely
    if (error.issues) {
      const fieldErrors: Record<string, string> = {}
      error.issues.forEach((issue: any) => {
        const path = issue.path.join(".")
        fieldErrors[path] = issue.message
      })
      throw createValidationError("Validation failed", fieldErrors)
    }
    // If it's JSON parse error or something else
    throw createValidationError("Invalid request body")
  }
}

export function validateQuery<T>(req: NextRequest, schema: ZodSchema<T>): T {
  try {
    const url = new URL(req.url)
    const params = Object.fromEntries(url.searchParams.entries())
    return schema.parse(params)
  } catch (error: any) {
    if (error.issues) {
      const fieldErrors: Record<string, string> = {}
      error.issues.forEach((issue: any) => {
        const path = issue.path.join(".")
        fieldErrors[path] = issue.message
      })
      throw createValidationError("Invalid query parameters", fieldErrors)
    }
    throw createValidationError("Invalid query parameters")
  }
}
