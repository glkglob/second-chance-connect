import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, MoreVerticalIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminUsersPage() {
  const jobSeekers = [
    {
      id: "1",
      name,
      email: "john.doe@example.com",
      status,
      joinDate: "2024-01-15",
      applications: 12,
    },
    {
      id: "2",
      name,
      email: "michael.chen@example.com",
      status,
      joinDate: "2024-01-10",
      applications: 8,
    },
  ]

  const employers = [
    {
      id: "1",
      name,
      email: "hiring@abclogistics.com",
      status,
      joinDate: "2023-12-01",
      jobPostings: 5,
    },
    {
      id: "2",
      name,
      email: "jobs@freshstartcafe.com",
      status,
      joinDate: "2023-11-15",
      jobPostings: 3,
    },
  ]

  const officers = [
    {
      id: "1",
      name,
      email: "m.garcia@corrections.gov",
      status,
      joinDate: "2023-10-01",
      clients: 24,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage all platform users" />

      <Tabs defaultValue="job-seekers" className="space-y-6">
        
          <TabsTrigger value="job-seekers">Job Seekers ({jobSeekers.length})</TabsTrigger>
          <TabsTrigger value="employers">Employers ({employers.length})</TabsTrigger>
          <TabsTrigger value="officers">Officers ({officers.length})</TabsTrigger>
        </TabsList>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="job-seekers" className="space-y-4">
          {jobSeekers.map((user) => (
            <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    
                      <AvatarImage src="/placeholder.svg" alt={user.name} />
                      
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      {user.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success text-success-foreground">
                      {user.status === "active" ? "Active" : user.status}
                    </Badge>
                    
                        <Button variant="ghost" size="icon">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>Suspend Account</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Account</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                  •</span>
                  {user.applications} applications sent</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="employers" className="space-y-4">
          {employers.map((employer) => (
            <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    
                      <AvatarImage src="/placeholder.svg" alt={employer.name} />
                      {employer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{employer.name}</CardTitle>
                      {employer.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success text-success-foreground">Verified</Badge>
                    
                        <Button variant="ghost" size="icon">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Job Postings</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>Suspend Account</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Account</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>Joined {new Date(employer.joinDate).toLocaleDateString()}</span>
                  •</span>
                  {employer.jobPostings} active job postings</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="officers" className="space-y-4">
          {officers.map((officer) => (
            <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    
                      <AvatarImage src="/placeholder.svg" alt={officer.name} />
                      
                        {officer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{officer.name}</CardTitle>
                      {officer.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                    
                        <Button variant="ghost" size="icon">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Caseload</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>Suspend Account</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Account</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>Joined {new Date(officer.joinDate).toLocaleDateString()}</span>
                  •</span>
                  {officer.clients} active clients</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
