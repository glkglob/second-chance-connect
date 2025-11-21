import { POST } from "@/app/api/jobs/route"
import { NextRequest } from "next/server"
import { mockSupabaseClient } from "../mocks/supabase"
import jest from "jest"

// Mock dependencies
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabaseClient)),
}))

describe("POST /api/jobs", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should create a job with valid input", async () => {
    // Mock authenticated user
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    })

    // Mock employer profile
    mockSupabaseClient.from.mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { role: "employer" }, error: null }),
        }
      }
      if (table === "jobs") {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: "job-123", title: "Senior Developer" },
            error: null,
          }),
        }
      }
      return {}
    })

    const req = new NextRequest("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        title: "Senior Developer",
        description: "We are hiring a senior developer with 5+ years of experience.",
        salary_min: 100000,
        salary_max: 150000,
        location: "New York",
        employment_type: "FULL_TIME",
      }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data.title).toBe("Senior Developer")
  })

  it("should reject invalid input", async () => {
    const req = new NextRequest("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        title: "", // Invalid: empty
      }),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error.code).toBe("VALIDATION_ERROR")
  })

  it("should reject unauthorized users", async () => {
    // Mock unauthenticated
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Not logged in" },
    })

    const req = new NextRequest("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        title: "Senior Developer",
        description: "Valid description...",
        salary_min: 100000,
        salary_max: 150000,
        location: "New York",
        employment_type: "FULL_TIME",
      }),
    })

    const response = await POST(req)
    expect(response.status).toBe(401)
  })
})
