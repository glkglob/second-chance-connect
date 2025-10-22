import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { AlertsFeed } from "@/components/alerts-feed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { UsersIcon, BriefcaseIcon, BuildingIcon, ShieldCheckIcon, TrendingUpIcon } from "lucide-react"

export default function AdminDashboardPage() {
  const systemAlerts = [
    {
      id: "1",
      type: "error",
      title: "Flagged Job Posting",
      message: "Job posting #4521 has been reported by multiple users for potential discrimination.",
      timestamp: "2 hours ago",
      read: false,
      actionLabel: "Review Posting",
      actionHref: "/admin/jobs/4521",
    },
    {
      id: "2",
      type: "warning",
      title: "Pending Verifications",
      message: "3 employer accounts are awaiting verification. Review required within 24 hours.",
      timestamp: "5 hours ago",
      read: false,
      actionLabel: "Review Accounts",
      actionHref: "/admin/users?filter=pending",
    },
    {
      id: "3",
      type: "info",
      title: "System Maintenance",
      message: "Scheduled maintenance window this Saturday 2-4 AM EST.",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "4",
      type: "success",
      title: "Milestone Reached",
      message: "Platform has successfully placed 2,000+ job seekers this year!",
      timestamp: "2 days ago",
      read: true,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Platform overview and management" />

      {/* Stats Grid */}
      <div className="grid gap-4 md)
}
