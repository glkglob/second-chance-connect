"use client"

import { useEffect, useState } from "react"

export function useJobs(options= {}) {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
export function useJob(id) {
  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
