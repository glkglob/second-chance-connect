import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger, logApiError, logDatabaseError } from '@/lib/logger'
import { validateRequest, validateQuery } from '@/lib/validate-request'
import { createJobSchema, jobQuerySchema } from '@/lib/validations/jobs'

export async function GET(request: NextRequest) {
    const startTime = Date.now()

    try {
        logger.apiRequest('GET', '/api/jobs')

        // Validate query parameters
        const { data: query, error: validationError } = validateQuery(
            request,
            jobQuerySchema
        )

        if (validationError) {
            logger.warn('Job query validation failed')
            return validationError
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('Unauthorized access attempt to jobs API', {
                url: request.url,
                type: 'unauthorized_access'
            })
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { status, employerId, search } = query || {}

        logger.dbQuery('jobs', 'SELECT', { status, employerId, search })

        let dbQuery = supabase.from('jobs').select(`
      id,
      title,
      company,
      location,
      description,
      requirements,
      salary_range,
      employment_type,
      status,
      created_at,
      employer_id,
      profiles:employer_id (
        name,
        location
      )
    `)

        // Apply filters
        if (status) {
            dbQuery = dbQuery.eq('status', status)
        }
        if (employerId) {
            dbQuery = dbQuery.eq('employer_id', employerId)
        }
        if (search) {
            dbQuery = dbQuery.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`)
        }

        // Default to active jobs for seekers
        if (!employerId && !status) {
            dbQuery = dbQuery.eq('status', 'ACTIVE')
        }

        dbQuery = dbQuery.order('created_at', { ascending: false })

        const { data, error } = await dbQuery

        if (error) {
            logDatabaseError(error, 'SELECT', 'jobs', { status, employerId, search })
            return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
        }

        const duration = Date.now() - startTime
        logger.apiResponse('GET', '/api/jobs', 200, duration, { count: data?.length || 0 })

        return NextResponse.json({ jobs: data || [] })
    } catch (error) {
        logApiError(error, request, { operation: 'GET /api/jobs' })
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const startTime = Date.now()

    try {
        logger.apiRequest('POST', '/api/jobs')

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('Unauthorized job creation attempt', { type: 'unauthorized_access' })
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check user role - only employers can create jobs
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'EMPLOYER') {
            logger.security('Non-employer attempted to create job', {
                userId: user.id,
                userRole: profile?.role
            })
            return NextResponse.json({ error: 'Forbidden - Only employers can create jobs' }, { status: 403 })
        }

        // Validate request body
        const { data: jobData, error: validationError } = await validateRequest(
            request,
            createJobSchema
        )

        if (validationError || !jobData) {
            logger.warn('Job creation validation failed', { userId: user.id })
            return validationError || NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        logger.dbQuery('jobs', 'INSERT', { title: jobData.title, company: jobData.company })

        const { data, error } = await supabase
            .from('jobs')
            .insert({
                ...jobData,
                employer_id: user.id
            })
            .select()
            .single()

        if (error) {
            logDatabaseError(error, 'INSERT', 'jobs', { title: jobData.title, company: jobData.company })
            return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
        }

        const duration = Date.now() - startTime
        logger.apiResponse('POST', '/api/jobs', 201, duration, { jobId: data.id })

        return NextResponse.json({ job: data }, { status: 201 })
    } catch (error) {
        logApiError(error, request, { operation: 'POST /api/jobs' })
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
