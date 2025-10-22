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
        const conversationWith = searchParams.get('conversationWith')

        let query = supabase.from('messages').select(`
      id,
      subject,
      content,
      read,
      created_at,
      sender_id,
      receiver_id,
      sender:sender_id (
        name,
        role
      ),
      receiver:receiver_id (
        name,
        role
      )
    `)

        // Filter messages where user is sender or receiver
        query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

        // If conversationWith is specified, filter to that conversation
        if (conversationWith) {
            query = query.or(
                `and(sender_id.eq.${user.id},receiver_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},receiver_id.eq.${user.id})`
            )
        }

        query = query.order('created_at', { ascending: false })

        const { data, error } = await query

        if (error) {
            console.error('[v0] Messages API error:', error)
            return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
        }

        return NextResponse.json({ messages: data || [] })
    } catch (error) {
        console.error('[v0] Messages API error:', error)
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

        const body = await request.json()
        const { receiver_id, subject, content } = body

        // Validate required fields
        if (!receiver_id || !content) {
            return NextResponse.json({
                error: 'Missing required fields: receiver_id, content'
            }, { status: 400 })
        }

        // Check that receiver exists
        const { data: receiver } = await supabase
            .from('profiles')
            .select('id, name, role')
            .eq('id', receiver_id)
            .single()

        if (!receiver) {
            return NextResponse.json({ error: 'Receiver not found' }, { status: 404 })
        }

        // Prevent sending to self
        if (receiver_id === user.id) {
            return NextResponse.json({ error: 'Cannot send message to yourself' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('messages')
            .insert({
                sender_id: user.id,
                receiver_id,
                subject: subject || 'No Subject',
                content,
                read: false
            })
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
            console.error('[v0] Send message error:', error)
            return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
        }

        return NextResponse.json({ message: data }, { status: 201 })
    } catch (error) {
        console.error('[v0] Send message error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}