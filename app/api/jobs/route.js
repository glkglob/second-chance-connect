import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger, logApiError, logDatabaseError } from '@/lib/logger'

export async function GET(request) {
    const startTime = Date.now()
    
    try {
        logger.apiRequest('GET', '/api/jobs')
        
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.warn('Unauthorized access attempt to jobs API', { 
                url: request.url,
                type: 'unauthorized_access' 
            })
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const employerId = searchParams.get('employerId')
        const search = searchParams.get('search')

        logger.dbQuery('jobs', 'SELECT', { status, employerId, search })

        let query = supabase.from('jobs').select(`
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
            query = query.eq('status', status)
        }
        if (employerId) {
            query = query.eq('employer_id', employerId)
        }
        if (search) {
            query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`)
        }

        // Default to active jobs for seekers
        if (!employerId && !status) {
            query = query.eq('status', 'ACTIVE')
        }

        query = query.order('created_at', { ascending: false })

        const { data, error } = await query

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

export async function POST(request) {
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

        const body = await request.json()
        const {
            title,
            company,
            location,
            description,
            requirements,
            salary_range,
            employment_type,
            status = 'DRAFT'
        } = body

        // Validate required fields
        if (!title || !company || !location || !description) {
            logger.warn('Job creation with missing fields', { userId: user.id, fields: { title, company, location, description } })
            return NextResponse.json({
                error: 'Missing required fields: title, company, location, description'
            }, { status: 400 })
        }

        logger.dbQuery('jobs', 'INSERT', { title, company })

        const { data, error } = await supabase
            .from('jobs')
            .insert({
                title,
                company,
                location,
                description,
                requirements,
                salary_range,
                employment_type,
                status,
                employer_id: user.id
            })
            .select()
            .single()

        if (error) {
            logDatabaseError(error, 'INSERT', 'jobs', { title, company })
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
