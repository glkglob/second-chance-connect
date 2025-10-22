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
        <Button asChild>
          <Link href="/employer/jobs/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid gap-4 md)
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
