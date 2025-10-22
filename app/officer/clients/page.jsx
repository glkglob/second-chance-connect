import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { SearchIcon, BriefcaseIcon, HomeIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react"

export default function ClientsPage() {
  const clients = [
    {
      id: "1",
      name: "John Doe",
      caseNumber: "CR-2024-001",
      employmentStatus: "unemployed",
      housingStatus: "stable",
      complianceStatus: "alert",
      lastContact: "5 days ago",
      nextCheckIn: "Overdue",
    },
    {
      id: "2",
      name: "Michael Chen",
      caseNumber: "CR-2024-002",
      employmentStatus: "unemployed",
      housingStatus: "stable",
      complianceStatus: "good",
      lastContact: "1 day ago",
      nextCheckIn: "Jan 28, 2024",
    },
    {
      id: "3",
      name: "James Rodriguez",
      caseNumber: "CR-2024-003",
      employmentStatus: "employed",
      housingStatus: "stable",
      complianceStatus: "good",
      lastContact: "3 days ago",
      nextCheckIn: "Today at 2:00 PM",
    },
    {
      id: "4",
      name: "David Thompson",
      caseNumber: "CR-2024-004",
      employmentStatus: "seeking",
      housingStatus: "stable",
      complianceStatus: "good",
      lastContact: "2 days ago",
      nextCheckIn: "Tomorrow at 10:00 AM",
    },
  ]

  const getEmploymentBadge = (status) => {
    switch (status) {
      case "employed":
        return (
          <Badge className="bg-success text-success-foreground">
            <BriefcaseIcon className="mr-1 h-3 w-3" />
            Employed
          </Badge>
        )
      case "seeking":
        return (
          <Badge variant="secondary">
            <BriefcaseIcon className="mr-1 h-3 w-3" />
            Job Seeking
          </Badge>
        )
      case "unemployed":
        return (
          <Badge variant="outline">
            <BriefcaseIcon className="mr-1 h-3 w-3" />
            Unemployed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getComplianceBadge = (status) => {
    switch (status) {
      case "good":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Compliant
          </Badge>
        )
      case "alert":
        return (
          <Badge variant="destructive">
            <AlertTriangleIcon className="mr-1 h-3 w-3" />
            Alert
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Clients" description="Manage and monitor your caseload" />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-9" />
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="alert">Needs Attention</SelectItem>
            <SelectItem value="good">Compliant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {clients.map((client) => (
          <Card key={client.id} className={client.complianceStatus === "alert" ? "border-destructive/50" : ""}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={client.name} />
                  <AvatarFallback>
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription>Case #{client.caseNumber}</CardDescription>
                    </div>
                    {getComplianceBadge(client.complianceStatus)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Employment Status</div>
                  {getEmploymentBadge(client.employmentStatus)}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Housing Status</div>
                  <Badge variant="secondary">
                    <HomeIcon className="mr-1 h-3 w-3" />
                    {client.housingStatus === "stable" ? "Stable" : "Unstable"}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Last Contact:</span>{" "}
                  <span className="font-medium">{client.lastContact}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Check-in:</span>{" "}
                  <span className={`font-medium ${client.nextCheckIn === "Overdue" ? "text-destructive" : ""}`}>
                    {client.nextCheckIn}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/officer/clients/${client.id}`}>View Full Profile</Link>
                </Button>
                <Button size="sm" variant="outline">
                  Schedule Check-in
                </Button>
                <Button size="sm" variant="outline">
                  Add Note
                </Button>
                <Button size="sm" variant="outline">
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
