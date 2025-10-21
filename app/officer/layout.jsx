import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav, officerNavItems } from "@/components/dashboard-nav"

export default function OfficerLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName="Officer Maria Garcia" userEmail="m.garcia@corrections.gov" />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/50 lg)
}
