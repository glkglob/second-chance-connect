/**
 * Example API Route with Enhanced Error Handling
 * 
 * This file demonstrates best practices for API routes in this project:
 * - Environment validation
 * - Structured error handling
 * - Request validation with Zod
 * - Proper authentication checks
 * - Debug logging
 * 
 * Copy this pattern when creating new API routes
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { APIErrors, handleAPIError, validateRequestBody, logAPIRequest } from '@/lib/api-error'
import { getEnvSafe } from '@/lib/config'

// Request body schema
const ExampleRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

/**
 * GET /api/example
 * Fetches example data with proper error handling
 */
export async function GET(request: Request) {
  try {
    // Log request in debug mode
    logAPIRequest(request)

    // Check environment configuration
    const env = getEnvSafe()
    if (!env.isValid) {
      throw new Error('Supabase configuration is invalid. Check your environment variables.')
    }

    // Create authenticated Supabase client
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw APIErrors.Unauthorized()
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Validate query parameters
    if (limit < 1 || limit > 100) {
      throw APIErrors.BadRequest('Limit must be between 1 and 100')
    }

    // Example database query with proper error handling
    let query = supabase
      .from('jobs')
      .select('id, title, company, status, created_at')
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('[v0] Database error:', error)
      throw APIErrors.InternalError('Failed to fetch data')
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: data || [],
      meta: {
        count: data?.length || 0,
        limit,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return handleAPIError(error)
  }
}

/**
 * POST /api/example
 * Creates example data with validation
 */
export async function POST(request: Request) {
  try {
    logAPIRequest(request)

    // Check environment
    const env = getEnvSafe()
    if (!env.isValid) {
      throw new Error('Supabase configuration is invalid')
    }

    // Authenticate user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw APIErrors.Unauthorized()
    }

    // Check user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw APIErrors.InternalError('Failed to fetch user profile')
    }

    // Example: Only employers can create jobs
    if (profile.role !== 'EMPLOYER') {
      throw APIErrors.Forbidden('Only employers can create jobs')
    }

    // Validate request body
    const body = await validateRequestBody(request, ExampleRequestSchema)

    // Insert data
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title: body.title,
        description: body.description,
        employer_id: user.id,
        status: 'DRAFT',
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Insert error:', error)
      
      // Handle specific database errors
      if (error.code === '23505') {
        throw APIErrors.Conflict('A job with this title already exists')
      }
      
      throw APIErrors.InternalError('Failed to create job')
    }

    // Return created resource
    return NextResponse.json(
      {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    return handleAPIError(error)
  }
}
