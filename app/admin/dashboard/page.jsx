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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="2,847"
          description="+12% from last month"
          icon={UsersIcon}
        />
        <StatCard
          title="Active Jobs"
          value="156"
          description="23 posted this week"
          icon={BriefcaseIcon}
        />
        <StatCard
          title="Employers"
          value="89"
          description="15 pending verification"
          icon={BuildingIcon}
        />
        <StatCard
          title="Successful Placements"
          value="234"
          description="+8% this month"
          icon={ShieldCheckIcon}
        />
      </div>

      {/* System Alerts and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertsFeed alerts={systemAlerts} maxHeight="500px" />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/jobs">Review Jobs</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/reports">Generate Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
// cleaned up duplicated trailing content; component ends above
