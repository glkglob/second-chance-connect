import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Client - Supabase URL:", supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "NOT SET")
  console.log(
    "[v0] Client - Supabase Anon Key:",
    supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "NOT SET",
  )

  const isValidUrl = supabaseUrl && (supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://"))
  const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 20

  if (!isValidUrl || !isValidKey) {
    console.warn(
      "[v0] Supabase configuration invalid:\n" +
        `  - URL valid: ${isValidUrl}\n` +
        `  - Key valid: ${isValidKey}\n` +
        "Authentication features will be disabled. " +
        "Add valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication.",
    )
    return null
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("[v0] Failed to create Supabase client:", error.message)
    return null
  }
}
