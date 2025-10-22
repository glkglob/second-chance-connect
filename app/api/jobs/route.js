import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const employerId = searchParams.get('employerId')
        const search = searchParams.get('search')

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
            console.error('[v0] Jobs API error:', error)
            return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
        }

        return NextResponse.json({ jobs: data || [] })
    } catch (error) {
        console.error('[v0] Jobs API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check user role - only employers can create jobs
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'EMPLOYER') {
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
            return NextResponse.json({
                error: 'Missing required fields: title, company, location, description'
            }, { status: 400 })
        }

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
            console.error('[v0] Create job error:', error)
            return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
        }

        return NextResponse.json({ job: data }, { status: 201 })
    } catch (error) {
        console.error('[v0] Create job error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}