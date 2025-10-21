import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request, { params }{ params: Promise<{ id) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        employer:profiles!jobs_employer_id_fkey(id, name, location, bio)
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return NextResponse.json({ job)
  } catch (error) {
    console.error("[v0] Error fetching job)
    return NextResponse.json({ error, { status: 500 })
  }
export async function PATCH(request, { params }{ params: Promise<{ id) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const {
      data,
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error, { status: 401 })
    }

    // Verify user owns this job
    const { data: job } = await supabase.from("jobs").select("employer_id").eq("id", id).single()

    if (!job || job.employer_id !== user.id) {
      return NextResponse.json({ error, { status: 403 })
    }

    const body = await request.json()

    const { data, error } = await supabase.from("jobs").update(body).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ job)
  } catch (error) {
    console.error("[v0] Error updating job)
    return NextResponse.json({ error, { status: 500 })
  }
export async function DELETE(request, { params }{ params: Promise<{ id) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const {
      data,
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error, { status: 401 })
    }

    // Verify user owns this job
    const { data: job } = await supabase.from("jobs").select("employer_id").eq("id", id).single()

    if (!job || job.employer_id !== user.id) {
      return NextResponse.json({ error, { status: 403 })
    }

    const { error } = await supabase.from("jobs").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success)
  } catch (error) {
    console.error("[v0] Error deleting job)
    return NextResponse.json({ error, { status: 500 })
  }
}
