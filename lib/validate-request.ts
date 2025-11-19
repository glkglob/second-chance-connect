import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'

export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data?: T; error?: NextResponse }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { data }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        )
      }
    }
    return {
      error: NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
  }
}

export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { data?: T; error?: NextResponse } {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const data = schema.parse(searchParams)
    return { data }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        )
      }
    }
    return {
      error: NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }
  }
}
