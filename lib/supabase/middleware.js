import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function updateSession(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Middleware - Supabase URL:", supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "NOT SET")
  console.log(
    "[v0] Middleware - Supabase Anon Key:",
    supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "NOT SET",
  )

  const isValidUrl = supabaseUrl && (supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://"))
  const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 20

  if (!isValidUrl || !isValidKey) {
    console.warn(
      "[v0] Supabase configuration invalid:\n" +
        `  - URL valid: ${isValidUrl}\n` +
        `  - Key valid: ${isValidKey}\n` +
        "Authentication is disabled. Please add valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
    return NextResponse.next({ request })
  }

  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect dashboard routes
    if (
      !user &&
      (request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/employer") ||
        request.nextUrl.pathname.startsWith("/officer") ||
        request.nextUrl.pathname.startsWith("/admin"))
    ) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    // Role-based access control
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (profile) {
        // Check role-specific routes
        if (request.nextUrl.pathname.startsWith("/dashboard") && profile.role !== "SEEKER") {
          return NextResponse.redirect(new URL("/", request.url))
        }
        if (request.nextUrl.pathname.startsWith("/employer") && profile.role !== "EMPLOYER") {
          return NextResponse.redirect(new URL("/", request.url))
        }
        if (request.nextUrl.pathname.startsWith("/officer") && profile.role !== "OFFICER") {
          return NextResponse.redirect(new URL("/", request.url))
        }
        if (request.nextUrl.pathname.startsWith("/admin") && profile.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/", request.url))
        }
      }
    }

    return supabaseResponse
  } catch (error) {
    console.error("[v0] Error in Supabase middleware:", error.message)
    console.warn("[v0] Continuing without authentication due to Supabase error")
    return NextResponse.next({ request })
  }
}
