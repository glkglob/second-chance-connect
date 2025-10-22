import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params
        const body = await request.json()

        // Get application details
        const { data: application } = await supabase
            .from('applications')
            .select(`
        *,
        jobs (
          employer_id
        )
      `)
            .eq('id', id)
            .single()

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Get user profile to check permissions
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // Check permissions - only application owner, job employer, or admin can update
        const canUpdate =
            application.seeker_id === user.id || // Applicant can update their own application
            application.jobs.employer_id === user.id || // Employer can update status
            profile?.role === 'ADMIN' // Admin can update any application

        if (!canUpdate) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Restrict what seekers can update vs employers
        let allowedFields = {}
        if (application.seeker_id === user.id) {
            // Seekers can only update their own content
            const { cover_letter, resume_url } = body
            allowedFields = { cover_letter, resume_url }
        } else {
            // Employers and admins can update status and notes
            const { status, notes } = body
            allowedFields = { status, notes }
        }

        const { data, error } = await supabase
            .from('applications')
            .update(allowedFields)
            .eq('id', id)
            .select(`
        *,
        jobs (
          title,
          company
        ),
        profiles:seeker_id (
          name,
          location
        )
      `)
            .single()

        if (error) {
            console.error('[v0] Application update error:', error)
            return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
        }

        return NextResponse.json({ application: data })
    } catch (error) {
        console.error('[v0] Application update error:', error)
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

        // Get application details
        const { data: application } = await supabase
            .from('applications')
            .select('seeker_id')
            .eq('id', id)
            .single()

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // Only the applicant or admin can delete
        if (application.seeker_id !== user.id && profile?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('[v0] Application delete error:', error)
            return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Application deleted successfully' })
    } catch (error) {
        console.error('[v0] Application delete error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
