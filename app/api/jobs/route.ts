import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const employerId = searchParams.get("employerId")
    const search = searchParams.get("search")

    let query = supabase
      .from("jobs")
      .select(`
        *,
        employer:profiles!jobs_employer_id_fkey(id, name, location)
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (employerId) {
      query = query.eq("employer_id", employerId)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ jobs: data })
  } catch (error) {
    console.error("[v0] Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is an employer
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Only employers can create jobs" }, { status: 403 })
    }

    const body = await request.json()
    const { title, company, location, description, requirements, salary_range, employment_type, status } = body

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        title,
        company,
        location,
        description,
        requirements,
        salary_range,
        employment_type,
        status: status || "ACTIVE",
        employer_id: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ job: data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
