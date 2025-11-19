import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateRequest, validateQuery } from '@/lib/validate-request'
import { createApplicationSchema, applicationQuerySchema } from '@/lib/validations/applications'

export async function GET(request: NextRequest) {
    try {
        // Validate query parameters
        const { data: query, error: validationError } = validateQuery(
            request,
            applicationQuerySchema
        )

        if (validationError) {
            return validationError
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { seekerId, jobId, status } = query || {}

        let dbQuery = supabase.from('applications').select(`
      id,
      status,
      cover_letter,
      resume_url,
      notes,
      created_at,
      updated_at,
      seeker_id,
      job_id,
      jobs (
        id,
        title,
        company,
        employment_type,
        salary_range
      ),
      profiles:seeker_id (
        name,
        location,
        phone
      )
    `)

        // Get user profile to check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // Role-based filtering
        if (profile?.role === 'SEEKER') {
            dbQuery = dbQuery.eq('seeker_id', user.id)
        } else if (profile?.role === 'EMPLOYER') {
            // Employers see applications for their jobs
            dbQuery = dbQuery.eq('jobs.employer_id', user.id)
        } else if (profile?.role === 'OFFICER') {
            // Officers see applications for their assigned clients
            // Note: This would need a client_officers table for proper implementation
            if (seekerId) {
                dbQuery = dbQuery.eq('seeker_id', seekerId)
            }
        }

        // Apply additional filters
        if (seekerId && (profile?.role === 'EMPLOYER' || profile?.role === 'ADMIN')) {
            dbQuery = dbQuery.eq('seeker_id', seekerId)
        }
        if (jobId) {
            dbQuery = dbQuery.eq('job_id', jobId)
        }
        if (status) {
            dbQuery = dbQuery.eq('status', status)
        }

        dbQuery = dbQuery.order('created_at', { ascending: false })

        const { data, error } = await dbQuery

        if (error) {
            console.error('[v0] Applications API error:', error)
            return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
        }

        return NextResponse.json({ applications: data || [] })
    } catch (error) {
        console.error('[v0] Applications API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check user role - only seekers can apply for jobs
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'SEEKER') {
            return NextResponse.json({ error: 'Forbidden - Only job seekers can apply for jobs' }, { status: 403 })
        }

        // Validate request body
        const { data: applicationData, error: validationError } = await validateRequest(
            request,
            createApplicationSchema
        )

        if (validationError || !applicationData) {
            return validationError || NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        // Check if job exists and is active
        const { data: job } = await supabase
            .from('jobs')
            .select('id, status')
            .eq('id', applicationData.job_id)
            .single()

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        if (job.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Job is not accepting applications' }, { status: 400 })
        }

        // Check if user already applied
        const { data: existingApplication } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', applicationData.job_id)
            .eq('seeker_id', user.id)
            .single()

        if (existingApplication) {
            return NextResponse.json({ error: 'You have already applied for this job' }, { status: 409 })
        }

        const { data, error } = await supabase
            .from('applications')
            .insert({
                ...applicationData,
                seeker_id: user.id,
                status: 'PENDING'
            })
            .select(`
        *,
        jobs (
          title,
          company
        )
      `)
            .single()

        if (error) {
            console.error('[v0] Create application error:', error)
            return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
        }

        return NextResponse.json({ application: data }, { status: 201 })
    } catch (error) {
        console.error('[v0] Create application error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
