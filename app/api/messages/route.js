import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const {
      data,
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error, { status: 401 })
    }

    const conversationWith = searchParams.get("conversationWith")

    let query = supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, name, role),
        receiver:profiles!messages_receiver_id_fkey(id, name, role)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending)

    if (conversationWith) {
      query = query.or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},receiver_id.eq.${user.id})`,
      )
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ messages)
  } catch (error) {
    console.error("[v0] Error fetching messages)
    return NextResponse.json({ error, { status: 500 })
  }
export async function POST(request) {
  try {
    const supabase = await createClient()

    const {
      data,
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error, { status: 401 })
    }

    const body = await request.json()
    const { receiver_id, subject, content } = body

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        receiver_id,
        subject,
        content,
        read)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ message, { status: 201 })
  } catch (error) {
    console.error("[v0] Error sending message)
    return NextResponse.json({ error, { status: 500 })
  }
}
