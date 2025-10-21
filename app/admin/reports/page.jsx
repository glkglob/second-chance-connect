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
        
            <FileTextIcon className="h-10 w-10 text-primary" />
            <CardTitle>User Analytics</CardTitle>
            <CardDescription>Registration trends, user activity, and engagement metrics</CardDescription>
          </CardHeader>
          
            <Button className="w-full">Generate Report</Button>
          </CardContent>
        </Card>

        
            <FileTextIcon className="h-10 w-10 text-primary" />
            <CardTitle>Employment Outcomes</CardTitle>
            <CardDescription>Job placements, success rates, and retention statistics</CardDescription>
          </CardHeader>
          
            <Button className="w-full">Generate Report</Button>
          </CardContent>
        </Card>

        
            <FileTextIcon className="h-10 w-10 text-primary" />
            <CardTitle>Employer Activity</CardTitle>
            <CardDescription>Job postings, applications received, and hiring patterns</CardDescription>
          </CardHeader>
          
            <Button className="w-full">Generate Report</Button>
          </CardContent>
        </Card>

        
            <FileTextIcon className="h-10 w-10 text-primary" />
            <CardTitle>Officer Caseloads</CardTitle>
            <CardDescription>Client management, compliance rates, and outcomes</CardDescription>
          </CardHeader>
          
            <Button className="w-full">Generate Report</Button>
          </CardContent>
        </Card>

        
            <FileTextIcon className="h-10 w-10 text-primary" />
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>System usage, response times, and technical metrics</CardDescription>
          </CardHeader>
          
            <Button className="w-full">Generate Report</Button>
          </CardContent>
        </Card>

        
            <FileTextIcon className="h-10 w-10 text-primary" />
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Revenue, costs, and financial projections</CardDescription>
          </CardHeader>
          
            <Button className="w-full">Generate Report</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated system reports</CardDescription>
        </CardHeader>
        
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">Monthly Platform Summary - January 2024</div>
                <div className="text-sm text-muted-foreground">Generated on Jan 20, 2024</div>
              </div>
              <Button size="sm" variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <div className="font-medium">Employment Outcomes Report - Q4 2023</div>
                <div className="text-sm text-muted-foreground">Generated on Jan 15, 2024</div>
              </div>
              <Button size="sm" variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">User Growth Analysis - 2023</div>
                <div className="text-sm text-muted-foreground">Generated on Jan 10, 2024</div>
              </div>
              <Button size="sm" variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
