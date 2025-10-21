export type UserRole = "SEEKER" | "EMPLOYER" | "OFFICER" | "ADMIN"
export type JobStatus = "ACTIVE" | "DRAFT" | "CLOSED"
export type ApplicationStatus = "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED"
export type ServiceCategory = "HOUSING" | "EDUCATION" | "HEALTH" | "LEGAL" | "OTHER"

export interface Profile {
  id: string
  name: string
  role: UserRole
  phone?: string
  location?: string
  bio?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}
