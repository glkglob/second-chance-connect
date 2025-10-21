import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" description="Configure system-wide settings" />

      {/* General Settings */}
      <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" defaultValue="Second Chance Connect" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              rows={3}
              defaultValue="Connecting individuals with criminal records to employment opportunities and support services."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input id="contact-email" type="email" defaultValue="info@secondchanceconnect.org" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>User Registration</Label>
              <p className="text-sm text-muted-foreground">Allow new users to register</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Job Posting Approval</Label>
              <p className="text-sm text-muted-foreground">Require admin approval for new job postings</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Messaging System</Label>
              <p className="text-sm text-muted-foreground">Enable direct messaging between users</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Job Board</Label>
              <p className="text-sm text-muted-foreground">Allow non-registered users to view jobs</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <CardTitle>Email Settings</CardTitle>
          <CardDescription>Configure email notifications</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
            <Label htmlFor="smtp-host">SMTP Host</Label>
            <Input id="smtp-host" defaultValue="smtp.example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-port">SMTP Port</Label>
            <Input id="smtp-port" defaultValue="587" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-user">SMTP Username</Label>
            <Input id="smtp-user" defaultValue="noreply@secondchanceconnect.org" />
          </div>
          <Button>Save Email Settings</Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <CardTitle>Security Settings</CardTitle>
          <CardDescription>Platform security configuration</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>IP Whitelisting</Label>
              <p className="text-sm text-muted-foreground">Restrict admin access to specific IP addresses</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
