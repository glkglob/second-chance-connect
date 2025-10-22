import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DownloadIcon, FileTextIcon, CalendarIcon } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    {
      id: "1",
      title: "Monthly Caseload Summary - January 2024",
      type: "Monthly Summary",
      date: "2024-01-20",
      status: "completed",
    },
    {
      id: "2",
      title: "Client Progress Report - John Doe",
      type: "Individual Report",
      date: "2024-01-18",
      status: "completed",
    },
    {
      id: "3",
      title: "Employment Outcomes Report - Q4 2023",
      type: "Quarterly Report",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "4",
      title: "Compliance Report - December 2023",
      type: "Monthly Summary",
      date: "2024-01-05",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Generate and view case reports">
        <Button>
          <FileTextIcon className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </PageHeader>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Create custom reports for your caseload</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md) => (
              <div key={report.id} className="flex items-center justify-between border-b pb-4 last).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Quick access to common report types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 bg-transparent">
              <FileTextIcon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Monthly Summary</div>
                <div className="text-xs text-muted-foreground">Overview of all clients this month</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 bg-transparent">
              <FileTextIcon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Employment Report</div>
                <div className="text-xs text-muted-foreground">Job placement and retention stats</div>
              </div>
            </Button>

            <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4 bg-transparent">
              <FileTextIcon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Compliance Report</div>
                <div className="text-xs text-muted-foreground">Check-in and program adherence</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
