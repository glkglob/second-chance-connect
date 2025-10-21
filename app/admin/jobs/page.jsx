import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, EyeIcon, FlagIcon } from "lucide-react"

export default function AdminJobsPage() {
  const jobs = [
    {
      id: "1",
      title: "Warehouse Associate",
      company: "ABC Logistics",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$16-18/hr",
      postedDate: "2024-01-15",
      applications: 32,
      status: "active",
      flagged: false,
    },
    {
      id: "2",
      title: "Delivery Driver",
      company: "QuickShip Delivery",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$17-20/hr + tips",
      postedDate: "2024-01-08",
      applications: 45,
      status: "active",
      flagged: true,
    },
    {
      id: "3",
      title: "Kitchen Staff",
      company: "Fresh Start Cafe",
      location: "Chicago, IL",
      type: "Part-time",
      salary: "$15-17/hr",
      postedDate: "2024-01-10",
      applications: 28,
      status: "active",
      flagged: false,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Job Postings" description="Monitor and manage all job listings" />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-type">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-type">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">Showing {jobs.length} job postings</div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className={job.flagged ? "border-destructive/50" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    {job.flagged && <FlagIcon className="h-4 w-4 text-destructive" />}
                  </div>
                  <CardDescription>
                    {job.company} • {job.type} • {job.location}
                  </CardDescription>
                </div>
                <Badge
                  className={
                    job.flagged ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground"
                  }
                >
                  {job.flagged ? "Flagged" : "Active"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>{job.salary}</span>
                <span>•</span>
                <span>{job.applications} applications</span>
                <span>•</span>
                <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <EyeIcon className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                {job.flagged && (
                  <Button size="sm" variant="destructive">
                    Review Flag
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Contact Employer
                </Button>
                <Button size="sm" variant="outline">
                  Remove Posting
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
