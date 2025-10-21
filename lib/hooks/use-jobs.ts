"use client"

import { useEffect, useState } from "react"

export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements?: string
  salary_range?: string
  employment_type?: string
  status: "ACTIVE" | "DRAFT" | "CLOSED"
  employer_id: string
  created_at: string
  updated_at: string
  employer?: {
    id: string
    name: string
    location?: string
  }
}

interface UseJobsOptions {
  status?: string
  employerId?: string
  search?: string
}

export function useJobs(options: UseJobsOptions = {}) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (options.status) params.append("status", options.status)
        if (options.employerId) params.append("employerId", options.employerId)
        if (options.search) params.append("search", options.search)

        const response = await fetch(`/api/jobs?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch jobs")

        const data = await response.json()
        setJobs(data.jobs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [options.status, options.employerId, options.search])

  const refetch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (options.status) params.append("status", options.status)
      if (options.employerId) params.append("employerId", options.employerId)
      if (options.search) params.append("search", options.search)

      const response = await fetch(`/api/jobs?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch jobs")

      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return { jobs, isLoading, error, refetch }
}

export function useJob(id: string) {
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/jobs/${id}`)
        if (!response.ok) throw new Error("Failed to fetch job")

        const data = await response.json()
        setJob(data.job)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchJob()
    }
  }, [id])

  return { job, isLoading, error }
}
