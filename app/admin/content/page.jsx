import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react"

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Content Management" description="Manage platform content and resources" />

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Static Pages</CardTitle>
                  <CardDescription>Manage website content pages</CardDescription>
                </div>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Page
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-medium">About Us</div>
                    <div className="text-sm text-muted-foreground">Last updated: Jan 15, 2024</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-medium">Support Services</div>
                    <div className="text-sm text-muted-foreground">Last updated: Jan 10, 2024</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Privacy Policy</div>
                    <div className="text-sm text-muted-foreground">Last updated: Dec 20, 2023</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resource Library</CardTitle>
                  <CardDescription>Educational materials and guides</CardDescription>
                </div>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-medium">Resume Writing Guide</div>
                    <div className="text-sm text-muted-foreground">PDF • 2.5 MB</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Interview Preparation Tips</div>
                    <div className="text-sm text-muted-foreground">PDF • 1.8 MB</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Platform Announcements</CardTitle>
                  <CardDescription>System-wide notifications and updates</CardDescription>
                </div>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-medium">New Features Available</div>
                    <div className="text-sm text-muted-foreground">Posted: Jan 18, 2024 • Active</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Deactivate
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Scheduled Maintenance Notice</div>
                    <div className="text-sm text-muted-foreground">Posted: Jan 10, 2024 • Expired</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
