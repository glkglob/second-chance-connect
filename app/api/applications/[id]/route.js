import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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

    const body = await request.json()

    // Verify user can update this application (either the seeker or the employer)
    const { data: application } = await supabase
      .from("applications")
      .select("seeker_id, job:jobs(employer_id)")
      .eq("id", id)
      .single()

    if (!application) {
      return NextResponse.json({ error, { status: 404 })
    }

    const isSeeker = application.seeker_id === user.id
    const isEmployer = application.job?.employer_id === user.id

    if (!isSeeker && !isEmployer) {
      return NextResponse.json({ error, { status: 403 })
    }

    const { data, error } = await supabase.from("applications").update(body).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ application)
  } catch (error) {
    console.error("[v0] Error updating application)
    return NextResponse.json({ error, { status: 500 })
  }
}
