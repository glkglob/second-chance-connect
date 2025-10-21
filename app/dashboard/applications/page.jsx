import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BriefcaseIcon, CalendarIcon, MapPinIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"

export default function ApplicationsPage() {
  const applications = [
    {
      id: "1",
      jobTitle: "Warehouse Associate",
      company: "ABC Logistics",
      location: "Chicago, IL",
      appliedDate: "2024-01-15",
      status: "under-review",
      statusText: "Under Review",
    },
    {
      id: "2",
      jobTitle: "Kitchen Staff",
      company: "Fresh Start Cafe",
      location: "Chicago, IL",
      appliedDate: "2024-01-10",
      status: "interview",
      statusText: "Interview Scheduled",
      interviewDate: "2024-01-25 at 2:00 PM",
    },
    {
      id: "3",
      jobTitle: "Delivery Driver",
      company: "QuickShip Delivery",
      location: "Chicago, IL",
      appliedDate: "2024-01-08",
      status: "under-review",
      statusText: "Under Review",
    },
    {
      id: "4",
      jobTitle: "Construction Laborer",
      company: "BuildRight Construction",
      location: "Chicago, IL",
      appliedDate: "2024-01-05",
      status: "rejected",
      statusText: "Not Selected",
    },
    {
      id: "5",
      jobTitle: "Retail Associate",
      company: "Second Chance Thrift",
      location: "Chicago, IL",
      appliedDate: "2023-12-28",
      status: "accepted",
      statusText: "Offer Received",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "under-review":
        return (
          <Badge variant="secondary">
            <ClockIcon className="mr-1 h-3 w-3" />
            {statusText}
          </Badge>
        )
      case "interview":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            {statusText}
          </Badge>
        )
      case "accepted":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            {statusText}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircleIcon className="mr-1 h-3 w-3" />
            {statusText}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{statusText}</Badge>
    }
  }

  const activeApplications = applications.filter((app) => app.status === "under-review" || app.status === "interview")
  const pastApplications = applications.filter((app) => app.status === "accepted" || app.status === "rejected")

  return (
    <div className="space-y-6">
      <PageHeader title="My Applications" description="Track your job applications and their status" />

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active ({activeApplications.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastApplications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeApplications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{app.jobTitle}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <BriefcaseIcon className="h-3 w-3" />
                      {app.company}
                    </CardDescription>
                  </div>
                  {getStatusBadge(app.status, app.statusText)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    {app.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    Applied {new Date(app.appliedDate).toLocaleDateString()}
                  </div>
                </div>

                {app.interviewDate && (
                  <div className="rounded-lg bg-success/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-success">
                      <CalendarIcon className="h-4 w-4" />
                      Interview)}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/applications/${app.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Message Employer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeApplications.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BriefcaseIcon className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Active Applications</h3>
                <p className="mt-2 text-sm text-muted-foreground">Start applying to jobs to see them here</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastApplications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{app.jobTitle}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <BriefcaseIcon className="h-3 w-3" />
                      {app.company}
                    </CardDescription>
                  </div>
                  {getStatusBadge(app.status, app.statusText)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    {app.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    Applied {new Date(app.appliedDate).toLocaleDateString()}
                  </div>
                </div>

                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/applications/${app.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
