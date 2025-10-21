import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { ProgressTracker } from "@/components/progress-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileTextIcon, CheckCircleIcon, ClockIcon, TrendingUpIcon, CalendarIcon, MessageSquareIcon } from "lucide-react"

export default function DashboardPage() {
  const profileSteps = [
    { id: "1", title: "Create Account", description: "Set up your basic account", completed: true },
    { id: "2", title: "Complete Profile", description: "Add your personal information", completed: true },
    { id: "3", title: "Add Work Experience", description: "List your employment history", completed: true },
    { id: "4", title: "Build Resume", description: "Create your professional resume", completed: false },
    { id: "5", title: "Apply to Jobs", description: "Start applying to opportunities", completed: false },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Welcome back! Here's your overview." />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Applications Sent" value="12" icon={FileTextIcon} />
        <StatCard title="Interviews Scheduled" value="3" icon={CalendarIcon} />
        <StatCard title="Profile Views" value="45" icon={TrendingUpIcon} trend={{ value: 12, isPositive: true }} />
        <StatCard title="Unread Messages" value="5" icon={MessageSquareIcon} />
      </div>

      <ProgressTracker
        title="Profile Completion"
        description="Complete these steps to improve your chances of getting hired"
        steps={profileSteps}
        currentStep={3}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/dashboard/jobs">Browse Jobs</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/profile">Update Profile</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/applications">View Applications</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Track your latest job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">Warehouse Associate</div>
                <div className="text-sm text-muted-foreground">ABC Logistics</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <ClockIcon className="mr-1 h-3 w-3" />
                  Under Review
                </Badge>
                <span className="text-sm text-muted-foreground">2 days ago</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">Kitchen Staff</div>
                <div className="text-sm text-muted-foreground">Fresh Start Cafe</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success text-success-foreground">
                  <CheckCircleIcon className="mr-1 h-3 w-3" />
                  Interview Scheduled
                </Badge>
                <span className="text-sm text-muted-foreground">5 days ago</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Delivery Driver</div>
                <div className="text-sm text-muted-foreground">QuickShip Delivery</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  <ClockIcon className="mr-1 h-3 w-3" />
                  Under Review
                </Badge>
                <span className="text-sm text-muted-foreground">1 week ago</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/dashboard/applications">View All Applications</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Jobs matching your profile and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">Construction Laborer</div>
                <div className="text-sm text-muted-foreground">BuildRight Construction</div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Full-time</span>
                  <span>•</span>
                  <span>$18-22/hr</span>
                  <span>•</span>
                  <span>Posted 2 days ago</span>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href="/dashboard/jobs/1">Apply</Link>
              </Button>
            </div>

            <div className="flex items-start justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">Retail Associate</div>
                <div className="text-sm text-muted-foreground">Second Chance Thrift</div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Part-time</span>
                  <span>•</span>
                  <span>$15-17/hr</span>
                  <span>•</span>
                  <span>Posted 3 days ago</span>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href="/dashboard/jobs/2">Apply</Link>
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">Maintenance Technician</div>
                <div className="text-sm text-muted-foreground">Property Solutions Inc</div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Full-time</span>
                  <span>•</span>
                  <span>$20-25/hr</span>
                  <span>•</span>
                  <span>Posted 1 week ago</span>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href="/dashboard/jobs/3">Apply</Link>
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/dashboard/jobs">Browse All Jobs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
