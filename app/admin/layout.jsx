import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav, adminNavItems } from "@/components/dashboard-nav"

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName="Admin User" userEmail="admin@secondchanceconnect.org" />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/50 lg)
}
