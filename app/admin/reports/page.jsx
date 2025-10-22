import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DownloadIcon, FileTextIcon } from "lucide-react"

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Platform Reports" description="Generate and view system-wide analytics" />

      {/* Report Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              User Analytics
            </CardTitle>
            <CardDescription>Track user registration, engagement, and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Job Placement Report
            </CardTitle>
            <CardDescription>Success rates and placement statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
// cleaned duplicated trailing markup - component ends above
