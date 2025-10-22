import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { SearchIcon, MapPinIcon, BriefcaseIcon, StarIcon } from "lucide-react"

export default function CandidatesPage() {
  const candidates = [
    {
      id: "1",
      name: "Michael Chen",
      location: "Chicago, IL",
      appliedFor: "Warehouse Associate",
      appliedDate: "2024-01-20",
      experience: "3 years",
      skills: ["Forklift Certified", "Inventory Management", "Team Player"],
      status: "new",
    },
    {
      id: "2",
      name: "James Rodriguez",
      location: "Chicago, IL",
      appliedFor: "Delivery Driver",
      appliedDate: "2024-01-19",
      experience: "5 years",
      skills: ["CDL License", "Customer Service", "Route Planning"],
      status: "reviewed",
    },
    {
      id: "3",
      name: "David Thompson",
      location: "Chicago, IL",
      appliedFor: "Forklift Operator",
      appliedDate: "2024-01-19",
      experience: "2 years",
      skills: ["Forklift Certified", "Safety Compliance", "Warehouse Operations"],
      status: "interview",
    },
    {
      id: "4",
      name: "Robert Martinez",
      location: "Chicago, IL",
      appliedFor: "Warehouse Associate",
      appliedDate: "2024-01-18",
      experience: "4 years",
      skills: ["Loading/Unloading", "Physical Stamina", "Attention to Detail"],
      status: "reviewed",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary">New</Badge>
      case "reviewed":
        return <Badge variant="outline">Reviewed</Badge>
      case "interview":
        return <Badge className="bg-success text-success-foreground">Interview</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Candidates" description="Review and manage job applicants" />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search candidates..." className="pl-9" />
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={candidate.name} />
                  <AvatarFallback>
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{candidate.name}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {candidate.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <BriefcaseIcon className="h-3 w-3" />
                          {candidate.experience} experience
                        </span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(candidate.status)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Applied for:</span> {candidate.appliedFor}
                </div>
                <div className="text-sm text-muted-foreground">
                  Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/employer/candidates/${candidate.id}`}>View Full Profile</Link>
                </Button>
                <Button size="sm" variant="outline">
                  Schedule Interview
                </Button>
                <Button size="sm" variant="outline">
                  Message
                </Button>
                <Button size="sm" variant="outline">
                  <StarIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
