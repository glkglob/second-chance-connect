"use client"

import { useEffect, useState } from "react"

export function useServices(options= {}) {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (options.category) params.append("category", options.category)
        if (options.search) params.append("search", options.search)

        const response = await fetch(`/api/services?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch services")

        const data = await response.json()
        setServices(data.services || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [options.category, options.search])

  return { services, isLoading, error }
}
