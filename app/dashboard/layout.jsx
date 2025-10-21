import React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav, jobSeekerNavItems } from "@/components/dashboard-nav"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName="John Doe" userEmail="john.doe@example.com" />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/50 lg:block">
          <div className="sticky top-16 p-6">
            <DashboardNav items={jobSeekerNavItems} />
          </div>
        </aside>
        <main className="flex-1">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
