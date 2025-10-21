"use client"

import { useEffect, useState } from "react"

  receiver?: {
    id: string
    name: string
    role: string
  }
export function useMessages(options= {}) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (options.conversationWith) params.append("conversationWith", options.conversationWith)

        const response = await fetch(`/api/messages?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch messages")

        const data = await response.json()
        setMessages(data.messages || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [options.conversationWith])

  const refetch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (options.conversationWith) params.append("conversationWith", options.conversationWith)

      const response = await fetch(`/api/messages?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch messages")

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (receiverId, subject, content) => {
    try {
      const response = await fetch("/api/messages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver_id),
      })

      if (!response.ok) throw new Error("Failed to send message")

      await refetch()
      return { success: true }
    } catch (err) {
      return { success, error: err instanceof Error ? err.message : "An error occurred" }
    }
  }

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read),
      })

      if (!response.ok) throw new Error("Failed to mark message")

      await refetch()
      return { success: true }
    } catch (err) {
      return { success, error: err instanceof Error ? err.message, markAsRead }
}
