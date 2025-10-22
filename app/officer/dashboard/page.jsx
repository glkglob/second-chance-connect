import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { AlertsFeed } from "@/components/alerts-feed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UsersIcon, BriefcaseIcon, CheckCircleIcon, CalendarIcon } from "lucide-react"

export default function OfficerDashboardPage() {
  const alerts = [
    {
      id: "1",
      type: "error",
      title: "Missed Check-in",
      message: "John Doe has not checked in for 5 days. Immediate follow-up required.",
      timestamp: "5 days ago",
      read: false,
      actionLabel: "Review Client",
      actionHref: "/officer/clients/1",
    },
    {
      id: "2",
      type: "warning",
      title: "Employment Status Change",
      message: "Michael Chen reported job loss yesterday. Schedule follow-up meeting.",
      timestamp: "1 day ago",
      read: false,
      actionLabel: "View Details",
      actionHref: "/officer/clients/2",
    },
    {
      id: "3",
      type: "info",
      title: "Upcoming Check-in",
      message: "James Rodriguez has a scheduled check-in today at 2:00 PM.",
      timestamp: "2 hours ago",
      read: true,
      actionLabel: "Start Check-in",
      actionHref: "/officer/clients/3",
    },
    {
      id: "4",
      type: "success",
      title: "New Employment",
      message: "David Thompson started new position Driver.",
      timestamp: "3 days ago",
      read: true,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Officer Dashboard" description="Monitor and support your clients' reintegration progress" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Clients" value="24" icon={UsersIcon} trend={{ value: 2, label: "new this month" }} />
        <StatCard
          title="Employed Clients"
          value="18"
          icon={BriefcaseIcon}
          trend={{ value: 3, label: "vs last month" }}
        />
        <StatCard
          title="Compliance Rate"
          value="92%"
          icon={CheckCircleIcon}
          trend={{ value: 5, label: "vs last month" }}
        />
        <StatCard title="Upcoming Check-ins" value="7" icon={CalendarIcon} trend={{ value: 0, label: "this week" }} />
      </div>

      {/* Alerts Feed */}
      <AlertsFeed alerts={alerts} />

      {/* Client Support Card */}
      <Card>
        <CardHeader>
          <CardTitle>Client Support</CardTitle>
          <CardDescription>Actions to help your clients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Employment Assistance</span>
              <span className="font-medium">21/24 (87%)</span>
            </div>
            <Progress value={87} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Education Support</span>
              <span className="font-medium">19/24 (79%)</span>
            </div>
            <Progress value={79} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Health Services</span>
              <span className="font-medium">20/24 (83%)</span>
            </div>
            <Progress value={83} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Financial Stability</span>
              <span className="font-medium">22/24 (92%)</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
