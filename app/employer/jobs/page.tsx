import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { PlusIcon, EyeIcon, UsersIcon, EditIcon, TrashIcon } from "lucide-react"

export default function EmployerJobsPage() {
  const activeJobs = [
    {
      id: "1",
      title: "Warehouse Associate",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$16-18/hr",
      postedDate: "2024-01-15",
      applications: 32,
      views: 156,
    },
    {
      id: "2",
      title: "Delivery Driver",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$17-20/hr + tips",
      postedDate: "2024-01-08",
      applications: 45,
      views: 203,
    },
    {
      id: "3",
      title: "Forklift Operator",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$18-22/hr",
      postedDate: "2024-01-01",
      applications: 28,
      views: 142,
    },
  ]

  const draftJobs = [
    {
      id: "4",
      title: "Inventory Specialist",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$17-20/hr",
      lastEdited: "2024-01-18",
    },
  ]

  const closedJobs = [
    {
      id: "5",
      title: "Shipping Clerk",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$16-18/hr",
      closedDate: "2023-12-20",
      applications: 52,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Job Postings" description="Manage your job listings">
        <Button asChild>
          <Link href="/employer/jobs/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </PageHeader>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({draftJobs.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>
                      {job.type} • {job.location} • {job.salary}
                    </CardDescription>
                  </div>
                  <Badge className="bg-success text-success-foreground">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <UsersIcon className="h-4 w-4" />
                    <span>{job.applications} applications</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <EyeIcon className="h-4 w-4" />
                    <span>{job.views} views</span>
                  </div>
                  <div className="text-muted-foreground">Posted {new Date(job.postedDate).toLocaleDateString()}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/employer/jobs/${job.id}`}>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/employer/jobs/${job.id}/edit`}>
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/employer/candidates?job=${job.id}`}>
                      <UsersIcon className="mr-2 h-4 w-4" />
                      View Applicants
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Close Posting
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {draftJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>
                      {job.type} • {job.location} • {job.salary}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Draft</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Last edited {new Date(job.lastEdited).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/employer/jobs/${job.id}/edit`}>Continue Editing</Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Publish
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {closedJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>
                      {job.type} • {job.location} • {job.salary}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">Closed</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>{job.applications} total applications</span>
                  <span>Closed {new Date(job.closedDate).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/employer/jobs/${job.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Repost Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
