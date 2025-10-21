"use client"

import { useEffect, useState } from "react"

export interface Service {
  id: string
  name: string
  category: "HOUSING" | "EDUCATION" | "HEALTH" | "LEGAL" | "OTHER"
  contact_email: string
  contact_phone?: string
  location: string
  address?: string
  description: string
  website_url?: string
  created_at: string
  updated_at: string
}

interface UseServicesOptions {
  category?: string
  search?: string
}

export function useServices(options: UseServicesOptions = {}) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
