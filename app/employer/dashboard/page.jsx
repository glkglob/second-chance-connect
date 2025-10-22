import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BriefcaseIcon, UsersIcon, EyeIcon, TrendingUpIcon, PlusIcon } from "lucide-react"

export default function EmployerDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Employer Dashboard" description="Manage your job postings and candidates">
        <Button asChild>
          <Link href="/employer/jobs/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Job Postings" value="3" icon={BriefcaseIcon} trend={{ value: 0, label: "No change" }} />
        <StatCard
          title="Total Applications"
          value="105"
          icon={UsersIcon}
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard title="Profile Views" value="1,234" icon={EyeIcon} trend={{ value: 8, label: "vs last week" }} />
        <StatCard
          title="Response Rate"
          value="94%"
          icon={TrendingUpIcon}
          trend={{ value: 2, label: "vs last month" }}
        />
      </div>

      {/* Tax Credits Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Credits</CardTitle>
          <CardDescription>
            Hire individuals with criminal records and receive federal tax credits of up to $9,600 per eligible
            employee.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The Work Opportunity Tax Credit (WOTC) provides incentives for hiring individuals from targeted groups,
            including those with criminal records. You could receive tax credits of up to $9,600 per eligible employee.
          </p>
          <Button variant="outline" asChild>
            <Link href="/tax-credits">Learn More</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
