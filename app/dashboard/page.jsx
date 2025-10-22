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
        <StatCard
          title="Applications Sent"
          value="12"
          description="Jobs you've applied to"
          icon={FileTextIcon}
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Profile Complete"
          value="85%"
          description="Complete your profile"
          icon={CheckCircleIcon}
        />
        <StatCard
          title="Messages"
          value="4"
          description="Unread messages"
          icon={MessageSquareIcon}
        />
        <StatCard
          title="Next Interview"
          value="Tomorrow"
          description="ABC Company at 2 PM"
          icon={CalendarIcon}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Continue building your professional profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <h4 className="font-medium">Complete Resume</h4>
                <p className="text-sm text-muted-foreground">Add your work experience and skills</p>
              </div>
              <Button size="sm" asChild>
                <Link href="/dashboard/profile">Continue</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <ProgressTracker
          title="Profile Setup"
          description="Complete these steps to improve your job prospects"
          steps={profileSteps}
          currentStep={3}
        />
      </div>
    </div>
  )
}
