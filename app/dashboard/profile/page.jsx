import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, PlusIcon } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="Manage your profile information">
        <Button>
          <PencilIcon className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </PageHeader>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <Avatar>
              <AvatarImage src="/avatar-placeholder.png" alt="Profile" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="ml-4 text-center sm:text-left">
              <h3 className="text-lg font-semibold">John Doe</h3>
              <p className="text-sm text-muted-foreground">Chicago, IL • (123) 456-7890</p>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <Label htmlFor="location">Location</Label>
            <Input id="location" defaultValue="Chicago, IL" />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
          <CardDescription>Tell employers about yourself</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Summary</Label>
            <Textarea
              id="bio"
              rows={5}
              placeholder="Write a brief summary about your experience, skills, and career goals..."
              defaultValue="Motivated individual seeking employment opportunities to rebuild my life and contribute to a team. I have experience in warehouse operations and am eager to learn new skills."
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Your employment history</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 border-b pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">Warehouse Worker</h4>
                <p className="text-sm text-muted-foreground">ABC Distribution Center</p>
                <p className="text-xs text-muted-foreground">Jan 2020 - Dec 2021</p>
              </div>
              <Button variant="ghost" size="sm">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Responsible for loading/unloading trucks, inventory management, and order fulfillment. Consistently met
              productivity targets and maintained safety standards.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">Kitchen Assistant</h4>
                <p className="text-sm text-muted-foreground">Local Restaurant</p>
                <p className="text-xs text-muted-foreground">Jun 2018 - Dec 2019</p>
              </div>
              <Button variant="ghost" size="sm">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Assisted with food preparation, maintained kitchen cleanliness, and supported the cooking staff during
              busy service periods.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Your key competencies</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Forklift Operation</Badge>
            <Badge variant="secondary">Inventory Management</Badge>
            <Badge variant="secondary">Team Collaboration</Badge>
            <Badge variant="secondary">Time Management</Badge>
            <Badge variant="secondary">Physical Stamina</Badge>
            <Badge variant="secondary">Safety Compliance</Badge>
            <Badge variant="secondary">Customer Service</Badge>
            <Badge variant="secondary">Food Handling</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
