import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateRequest, validateQuery } from '@/lib/validate-request'
import { createMessageSchema, messageQuerySchema } from '@/lib/validations/messages'

export async function GET(request: NextRequest) {
    try {
        // Validate query parameters
        const { data: query, error: validationError } = validateQuery(
            request,
            messageQuerySchema
        )

        if (validationError) {
            return validationError
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { senderId, receiverId, unreadOnly } = query || {}

        let dbQuery = supabase.from('messages').select(`
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
        dbQuery = dbQuery.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

        // If senderId or receiverId is specified, filter to that conversation
        if (senderId && receiverId) {
            dbQuery = dbQuery.or(
                `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
            )
        }

        // Filter unread messages
        if (unreadOnly) {
            dbQuery = dbQuery.eq('read', false)
        }

        dbQuery = dbQuery.order('created_at', { ascending: false })

        const { data, error } = await dbQuery

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

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Validate request body
        const { data: messageData, error: validationError } = await validateRequest(
            request,
            createMessageSchema
        )

        if (validationError || !messageData) {
            return validationError || NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        // Check that receiver exists
        const { data: receiver } = await supabase
            .from('profiles')
            .select('id, name, role')
            .eq('id', messageData.receiver_id)
            .single()

        if (!receiver) {
            return NextResponse.json({ error: 'Receiver not found' }, { status: 404 })
        }

        // Prevent sending to self
        if (messageData.receiver_id === user.id) {
            return NextResponse.json({ error: 'Cannot send message to yourself' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('messages')
            .insert({
                sender_id: user.id,
                receiver_id: messageData.receiver_id,
                subject: messageData.subject,
                content: messageData.content,
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
