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

        // Get message details
        const { data: message } = await supabase
            .from('messages')
            .select('sender_id, receiver_id')
            .eq('id', id)
            .single()

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 })
        }

        // Only the receiver can mark as read
        if (message.receiver_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden - Only message receiver can mark as read' }, { status: 403 })
        }

        const { read } = body

        const { data, error } = await supabase
            .from('messages')
            .update({ read: read || true })
            .eq('id', id)
            .select(`
        *,
        sender:sender_id (
          name,
          role
        ),
        receiver:receiver_id (
          name,
          role
        )
      `)
            .single()

        if (error) {
            console.error('[v0] Message update error:', error)
            return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
        }

        return NextResponse.json({ message: data })
    } catch (error) {
        console.error('[v0] Message update error:', error)
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

        // Get message details
        const { data: message } = await supabase
            .from('messages')
            .select('sender_id, receiver_id')
            .eq('id', id)
            .single()

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 })
        }

        // Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // Only sender, receiver, or admin can delete
        const canDelete =
            message.sender_id === user.id ||
            message.receiver_id === user.id ||
            profile?.role === 'ADMIN'

        if (!canDelete) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('[v0] Message delete error:', error)
            return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Message deleted successfully' })
    } catch (error) {
        console.error('[v0] Message delete error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}