export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMIT: "RATE_LIMIT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  CONFLICT: "CONFLICT",
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: ErrorCode,
    public details?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}
