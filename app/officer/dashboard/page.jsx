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
      <div className="grid gap-4 md)</span>
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
