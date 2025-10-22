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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Added TabsContent for resources */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Support Resources</CardTitle>
                  <CardDescription>Manage resource listings</CardDescription>
                </div>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </div>
            </CardHeader>
          </Card>
        </TabsContent>
        {/* Added TabsContent for announcements */}
        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Platform Announcements</CardTitle>
                  <CardDescription>Manage system-wide announcements</CardDescription>
                </div>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
