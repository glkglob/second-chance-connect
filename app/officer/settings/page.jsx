import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function OfficerSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your officer account preferences" />

      {/* Account Information */}
      <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="Maria" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Garcia" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="m.garcia@corrections.gov" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="(555) 234-5678" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge">Badge Number</Label>
            <Input id="badge" defaultValue="OFF-2024-789" disabled />
          </div>
          <Button>Update Information</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Control how you receive alerts</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Client Check-in Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified before scheduled check-ins</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compliance Alerts</Label>
              <p className="text-sm text-muted-foreground">Immediate alerts for missed check-ins or violations</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Employment Updates</Label>
              <p className="text-sm text-muted-foreground">Notifications when clients update job status</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Message Notifications</Label>
              <p className="text-sm text-muted-foreground">Alerts for new messages from clients</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Summary Report</Label>
              <p className="text-sm text-muted-foreground">Receive weekly caseload summary emails</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your password and security</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
