import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BriefcaseIcon, UsersIcon, EyeIcon, TrendingUpIcon, PlusIcon } from "lucide-react"

export default function EmployerDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Employer Dashboard" description="Manage your job postings and candidates">
        
          <Link href="/employer/jobs/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Job Posts" value="5" icon={BriefcaseIcon} />
        <StatCard title="Total Applications" value="127" icon={UsersIcon} trend={{ value: 18, isPositive: true }} />
        <StatCard title="Profile Views" value="342" icon={EyeIcon} trend={{ value: 8, isPositive: true }} />
        <StatCard title="Interviews Scheduled" value="12" icon={TrendingUpIcon} />
      </div>

      {/* Active Job Postings */}
      
          <div className="flex items-center justify-between">
            <CardTitle>Active Job Postings</CardTitle>
              <CardDescription>Your current open positions</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/employer/jobs">View All</Link>
            </Button>
          </div>
        </CardHeader>
        
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">Warehouse Associate</div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Posted 5 days ago</span>
                  •</span>
                  32 applications</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success text-success-foreground">Active</Badge>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/employer/jobs/1">View</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">Delivery Driver</div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Posted 2 weeks ago</span>
                  •</span>
                  45 applications</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success text-success-foreground">Active</Badge>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/employer/jobs/2">View</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Forklift Operator</div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Posted 3 weeks ago</span>
                  •</span>
                  28 applications</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success text-success-foreground">Active</Badge>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/employer/jobs/3">View</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      
          <div className="flex items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest candidates who applied</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/employer/candidates">View All</Link>
            </Button>
          </div>
        </CardHeader>
        
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">Michael Chen</div>
                <div className="text-sm text-muted-foreground">Applied for Warehouse Associate</div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
                <Button size="sm">Review</Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">James Rodriguez</div>
                <div className="text-sm text-muted-foreground">Applied for Delivery Driver</div>
                <div className="text-xs text-muted-foreground">5 hours ago</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
                <Button size="sm">Review</Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">David Thompson</div>
                <div className="text-sm text-muted-foreground">Applied for Forklift Operator</div>
                <div className="text-xs text-muted-foreground">1 day ago</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
                <Button size="sm">Review</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Credit Information */}
      <Card className="border-primary/50 bg-primary/5">
        <CardTitle>Federal Tax Credits Available</CardTitle>
          <CardDescription>Learn about hiring incentives for fair-chance employers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            Employers who hire individuals with criminal records may qualify for the Work Opportunity Tax Credit (WOTC)
            of up to $9,600 per eligible employee.
          </p>
          <Button variant="outline" asChild>
            <Link href="/tax-credits">Learn More</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
