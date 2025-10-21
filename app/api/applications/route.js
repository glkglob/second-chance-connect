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

    const seekerId = searchParams.get("seekerId")
    const jobId = searchParams.get("jobId")
    const status = searchParams.get("status")

    let query = supabase
      .from("applications")
      .select(`
        *,
        seeker:profiles!applications_seeker_id_fkey(id, name, location, bio),
        job:jobs(id, title, company, location, status)
      `)
      .order("created_at", { ascending)

    if (seekerId) {
      query = query.eq("seeker_id", seekerId)
    }

    if (jobId) {
      query = query.eq("job_id", jobId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ applications)
  } catch (error) {
    console.error("[v0] Error fetching applications)
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

    // Verify user is a seeker
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "SEEKER") {
      return NextResponse.json({ error, { status: 403 })
    }

    const body = await request.json()
    const { job_id, cover_letter, resume_url } = body

    // Check if already applied
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("seeker_id", user.id)
      .eq("job_id", job_id)
      .single()

    if (existing) {
      return NextResponse.json({ error, { status: 400 })
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        seeker_id: user.id,
        job_id,
        cover_letter,
        resume_url,
        status)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ application, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating application)
    return NextResponse.json({ error, { status: 500 })
  }
}
