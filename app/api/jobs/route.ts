import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createJobSchema, jobFilterSchema } from "@/lib/validation/jobs"
import { successResponse } from "@/lib/api/responses"
import { ApiError, ErrorCodes } from "@/lib/errors"
import { validateAndCatchErrors } from "@/lib/api/middleware"
import { validateInput, validateQuery } from "@/lib/middleware/validate"

export async function POST(req: NextRequest) {
  return validateAndCatchErrors(async () => {
    // 1. Validate input
    const validatedData = await validateInput(req, createJobSchema)

    // 2. Authenticate
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new ApiError("Unauthorized", 401, ErrorCodes.UNAUTHORIZED)
    }

    // 3. Check authorization (user is employer)
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "employer" && profile?.role !== "admin") {
      throw new ApiError("Only employers can post jobs", 403, ErrorCodes.FORBIDDEN)
    }

    // 4. Database operation
    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          ...validatedData,
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new ApiError("Failed to create job", 500, ErrorCodes.INTERNAL_ERROR, { originalError: error.message })
    }

    // 5. Audit log (TODO: Implement audit logging)
    // await auditLog({ ... })

    return successResponse(data, 201)
  })
}

export async function GET(req: NextRequest) {
  return validateAndCatchErrors(async () => {
    const queryParams = validateQuery(req, jobFilterSchema)
    const supabase = await createClient()

    let query = supabase
      .from("jobs")
      .select("*, profiles:created_by(full_name, avatar_url)")
      .order("created_at", { ascending: false })

    // Apply filters
    if (queryParams.search) {
      query = query.ilike("title", `%${queryParams.search}%`)
    }

    if (queryParams.location) {
      query = query.ilike("location", `%${queryParams.location}%`)
    }

    if (queryParams.type) {
      query = query.eq("employment_type", queryParams.type)
    }

    if (queryParams.min_salary) {
      query = query.gte("salary_min", queryParams.min_salary)
    }

    // Pagination
    const page = queryParams.page || 1
    const limit = queryParams.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw new ApiError("Failed to fetch jobs", 500, ErrorCodes.INTERNAL_ERROR, { originalError: error.message })
    }

    return successResponse({
      jobs: data,
      pagination: {
        page,
        limit,
        total: count || 0, // Note: count requires { count: 'exact' } in select, adding it below
      },
    })
  })
}
