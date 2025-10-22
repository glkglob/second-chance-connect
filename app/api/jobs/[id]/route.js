import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params

        const { data, error } = await supabase
            .from('jobs')
            .select(`
        *,
        profiles:employer_id (
          name,
          location
        )
      `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('[v0] Job fetch error:', error)
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        return NextResponse.json({ job: data })
    } catch (error) {
        console.error('[v0] Job fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request, { params }) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params
        const body = await request.json()

        // Check if user owns this job or is admin
        const { data: job } = await supabase
            .from('jobs')
            .select('employer_id')
            .eq('id', id)
            .single()

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (job.employer_id !== user.id && profile?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { data, error } = await supabase
            .from('jobs')
            .update(body)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('[v0] Job update error:', error)
            return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
        }

        return NextResponse.json({ job: data })
    } catch (error) {
        console.error('[v0] Job update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params

        // Check if user owns this job or is admin
        const { data: job } = await supabase
            .from('jobs')
            .select('employer_id')
            .eq('id', id)
            .single()

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (job.employer_id !== user.id && profile?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('[v0] Job delete error:', error)
            return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Job deleted successfully' })
    } catch (error) {
        console.error('[v0] Job delete error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
