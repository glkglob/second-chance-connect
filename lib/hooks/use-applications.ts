"use client"

import { useEffect, useState } from "react"

export interface Application {
  id: string
  seeker_id: string
  job_id: string
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED"
  cover_letter?: string
  resume_url?: string
  notes?: string
  created_at: string
  updated_at: string
  seeker?: {
    id: string
    name: string
    location?: string
    bio?: string
  }
  job?: {
    id: string
    title: string
    company: string
    location: string
    status: string
  }
}

interface UseApplicationsOptions {
  seekerId?: string
  jobId?: string
  status?: string
}

export function useApplications(options: UseApplicationsOptions = {}) {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (options.seekerId) params.append("seekerId", options.seekerId)
        if (options.jobId) params.append("jobId", options.jobId)
        if (options.status) params.append("status", options.status)

        const response = await fetch(`/api/applications?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch applications")

        const data = await response.json()
        setApplications(data.applications || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [options.seekerId, options.jobId, options.status])

  const refetch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (options.seekerId) params.append("seekerId", options.seekerId)
      if (options.jobId) params.append("jobId", options.jobId)
      if (options.status) params.append("status", options.status)

      const response = await fetch(`/api/applications?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch applications")

      const data = await response.json()
      setApplications(data.applications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return { applications, isLoading, error, refetch }
}
