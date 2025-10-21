import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function EmployerSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your employer account" />

      {/* Company Information */}
      <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company profile</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" defaultValue="ABC Logistics" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-website">Website</Label>
            <Input id="company-website" type="url" defaultValue="https://abclogistics.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-description">Company Description</Label>
            <Textarea
              id="company-description"
              rows={4}
              defaultValue="ABC Logistics is a leading distribution and warehousing company committed to fair-chance hiring practices."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-location">Location</Label>
            <Input id="company-location" defaultValue="Chicago, IL" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-size">Company Size</Label>
            <Input id="company-size" defaultValue="50-200 employees" />
          </div>
          <Button>Update Company Info</Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <CardTitle>Contact Information</CardTitle>
          <CardDescription>How candidates can reach you</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input id="contact-email" type="email" defaultValue="hiring@abclogistics.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone Number</Label>
            <Input id="contact-phone" type="tel" defaultValue="(555) 987-6543" />
          </div>
          <Button>Update Contact Info</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive updates</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Application Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when candidates apply</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Message Notifications</Label>
              <p className="text-sm text-muted-foreground">Alerts for new candidate messages</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">Receive weekly hiring activity reports</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account credentials</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
            <Label htmlFor="account-email">Email Address</Label>
            <Input id="account-email" type="email" defaultValue="sarah@abclogistics.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <Button>Update Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}
