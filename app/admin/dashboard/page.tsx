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
      type: "error" as const,
      title: "Flagged Job Posting",
      message: "Job posting #4521 has been reported by multiple users for potential discrimination.",
      timestamp: "2 hours ago",
      read: false,
      actionLabel: "Review Posting",
      actionHref: "/admin/jobs/4521",
    },
    {
      id: "2",
      type: "warning" as const,
      title: "Pending Verifications",
      message: "3 employer accounts are awaiting verification. Review required within 24 hours.",
      timestamp: "5 hours ago",
      read: false,
      actionLabel: "Review Accounts",
      actionHref: "/admin/users?filter=pending",
    },
    {
      id: "3",
      type: "info" as const,
      title: "System Maintenance",
      message: "Scheduled maintenance window this Saturday 2-4 AM EST.",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "4",
      type: "success" as const,
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
          value="3,247"
          icon={UsersIcon}
          description="All platform users"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Job Postings"
          value="156"
          icon={BriefcaseIcon}
          description="Currently open positions"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Registered Employers"
          value="850"
          icon={BuildingIcon}
          description="Partner companies"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Success Rate"
          value="92%"
          icon={ShieldCheckIcon}
          description="Job placement success"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <AlertsFeed alerts={systemAlerts} maxHeight="400px" />

      {/* Platform Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Registrations</CardTitle>
            <CardDescription>New users in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <div className="font-medium">John Smith</div>
                  <div className="text-sm text-muted-foreground">Job Seeker • Registered 2 hours ago</div>
                </div>
                <Badge variant="secondary">Job Seeker</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <div className="font-medium">Tech Solutions Inc</div>
                  <div className="text-sm text-muted-foreground">Employer • Registered 5 hours ago</div>
                </div>
                <Badge variant="secondary">Employer</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Sarah Williams</div>
                  <div className="text-sm text-muted-foreground">Job Seeker • Registered 1 day ago</div>
                </div>
                <Badge variant="secondary">Job Seeker</Badge>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/admin/users">View All Users</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Latest positions added to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <div className="font-medium">Warehouse Associate</div>
                  <div className="text-sm text-muted-foreground">ABC Logistics • Posted 3 hours ago</div>
                </div>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <div className="font-medium">Delivery Driver</div>
                  <div className="text-sm text-muted-foreground">QuickShip • Posted 6 hours ago</div>
                </div>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Kitchen Staff</div>
                  <div className="text-sm text-muted-foreground">Fresh Start Cafe • Posted 1 day ago</div>
                </div>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/admin/jobs">View All Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Job Seekers</span>
                <TrendingUpIcon className="h-4 w-4 text-success" />
              </div>
              <div className="text-2xl font-bold">2,397</div>
              <div className="text-xs text-muted-foreground">+12% from last month</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Applications Sent</span>
                <TrendingUpIcon className="h-4 w-4 text-success" />
              </div>
              <div className="text-2xl font-bold">4,521</div>
              <div className="text-xs text-muted-foreground">+18% from last month</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Successful Placements</span>
                <TrendingUpIcon className="h-4 w-4 text-success" />
              </div>
              <div className="text-2xl font-bold">1,847</div>
              <div className="text-xs text-muted-foreground">+8% from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
