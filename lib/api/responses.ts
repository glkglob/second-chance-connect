import { NextResponse } from "next/server"

export interface SuccessResponse<T> {
  success: true
  data: T
  timestamp: string
}

export interface ErrorResponse {
  success: false
  error: {
    message: string
    code?: string
    details?: any
    timestamp: string
  }
}

export function successResponse<T>(data: T, status = 200): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}

export function errorResponse(
  message: string,
  status = 500,
  code?: string,
  details?: any,
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
        timestamp: new Date().toISOString(),
      },
    },
    { status },
  )
}
