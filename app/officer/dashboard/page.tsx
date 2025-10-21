import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { AlertsFeed } from "@/components/alerts-feed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { UsersIcon, BriefcaseIcon, CheckCircleIcon, CalendarIcon, TrendingUpIcon } from "lucide-react"

export default function OfficerDashboardPage() {
  const alerts = [
    {
      id: "1",
      type: "error" as const,
      title: "Missed Check-in",
      message: "John Doe has not checked in for 5 days. Immediate follow-up required.",
      timestamp: "5 days ago",
      read: false,
      actionLabel: "Review Client",
      actionHref: "/officer/clients/1",
    },
    {
      id: "2",
      type: "warning" as const,
      title: "Employment Status Change",
      message: "Michael Chen reported job loss yesterday. Schedule follow-up meeting.",
      timestamp: "1 day ago",
      read: false,
      actionLabel: "View Details",
      actionHref: "/officer/clients/2",
    },
    {
      id: "3",
      type: "info" as const,
      title: "Upcoming Check-in",
      message: "James Rodriguez has a scheduled check-in today at 2:00 PM.",
      timestamp: "2 hours ago",
      read: true,
      actionLabel: "Start Check-in",
      actionHref: "/officer/clients/3",
    },
    {
      id: "4",
      type: "success" as const,
      title: "New Employment",
      message: "David Thompson started new position as Delivery Driver.",
      timestamp: "3 days ago",
      read: true,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Officer Dashboard" description="Monitor and support your clients' reintegration progress" />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Clients" value="24" icon={UsersIcon} />
        <StatCard
          title="Employed Clients"
          value="18"
          icon={BriefcaseIcon}
          description="75% employment rate"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard title="Upcoming Check-ins" value="7" icon={CalendarIcon} description="This week" />
        <StatCard title="Compliance Rate" value="92%" icon={CheckCircleIcon} trend={{ value: 3, isPositive: true }} />
      </div>

      <AlertsFeed alerts={alerts} maxHeight="500px" />

      {/* Upcoming Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Check-ins</CardTitle>
          <CardDescription>Scheduled meetings this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">James Rodriguez</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Today at 2:00 PM</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/officer/clients/3">View Profile</Link>
                </Button>
                <Button size="sm">Start Check-in</Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">David Thompson</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Tomorrow at 10:00 AM</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/officer/clients/4">View Profile</Link>
                </Button>
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Robert Martinez</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Friday at 3:00 PM</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/officer/clients/5">View Profile</Link>
                </Button>
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Employment Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Employment Updates</CardTitle>
          <CardDescription>Latest job status changes from your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">James Rodriguez - New Employment</div>
                <div className="text-sm text-muted-foreground">Started as Delivery Driver at QuickShip Delivery</div>
                <div className="text-xs text-muted-foreground">2 days ago</div>
              </div>
              <Badge className="bg-success text-success-foreground">
                <CheckCircleIcon className="mr-1 h-3 w-3" />
                Employed
              </Badge>
            </div>

            <div className="flex items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">David Thompson - Job Application</div>
                <div className="text-sm text-muted-foreground">Applied for Forklift Operator position</div>
                <div className="text-xs text-muted-foreground">3 days ago</div>
              </div>
              <Badge variant="secondary">
                <TrendingUpIcon className="mr-1 h-3 w-3" />
                Seeking
              </Badge>
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">Robert Martinez - Interview Scheduled</div>
                <div className="text-sm text-muted-foreground">Interview for Warehouse Associate on Jan 25</div>
                <div className="text-xs text-muted-foreground">5 days ago</div>
              </div>
              <Badge variant="secondary">
                <TrendingUpIcon className="mr-1 h-3 w-3" />
                In Progress
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Caseload Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Caseload Overview</CardTitle>
          <CardDescription>Summary of your clients' progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Employment Status</span>
              <span className="font-medium">18/24 (75%)</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Housing Stability</span>
              <span className="font-medium">22/24 (92%)</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Program Compliance</span>
              <span className="font-medium">22/24 (92%)</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Support Services Engagement</span>
              <span className="font-medium">20/24 (83%)</span>
            </div>
            <Progress value={83} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
