import type { NextResponse } from "next/server"
import { ApiError, ErrorCodes } from "@/lib/errors"
import { errorResponse } from "./responses"
import { ZodError } from "zod"
import { logError } from "@/lib/logger"

export async function validateAndCatchErrors(handler: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await handler()
  } catch (error: any) {
    // Log the error
    logError("[API Error]", error)

    if (error instanceof ApiError) {
      return errorResponse(error.message, error.status, error.code, error.details)
    }

    if (error instanceof ZodError) {
      return errorResponse("Validation error", 400, ErrorCodes.VALIDATION_ERROR, error.issues)
    }

    // Handle Supabase errors if they leak through
    if (error.code && typeof error.code === "string" && error.code.length === 5) {
      // Simple heuristic for Postgres error codes
      return errorResponse(
        "Database operation failed",
        500,
        ErrorCodes.INTERNAL_ERROR,
        process.env.NODE_ENV === "development" ? error : undefined,
      )
    }

    return errorResponse(
      "Internal server error",
      500,
      ErrorCodes.INTERNAL_ERROR,
      process.env.NODE_ENV === "development" ? { originalError: error.message } : undefined,
    )
  }
}
