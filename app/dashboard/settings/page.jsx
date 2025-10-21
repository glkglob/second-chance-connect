import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account preferences" />

      {/* Account Settings */}
      <CardTitle>Account Settings</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
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
          <Button>Update Account</Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email updates about your applications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Job Recommendations</Label>
              <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Message Notifications</Label>
              <p className="text-sm text-muted-foreground">Alerts when you receive new messages</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Application Updates</Label>
              <p className="text-sm text-muted-foreground">Status changes on your applications</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Job Preferences */}
      <CardTitle>Job Preferences</CardTitle>
          <CardDescription>Set your job search preferences</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
            <Label>Preferred Job Type</Label>
            <Select defaultValue="full-time">
              
                <SelectValue />
              </SelectTrigger>
              
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Desired Salary Range</Label>
            <Select defaultValue="15-20">
              
                <SelectValue />
              </SelectTrigger>
              
                <SelectItem value="under-15">Under $15/hr</SelectItem>
                <SelectItem value="15-20">$15-20/hr</SelectItem>
                <SelectItem value="20-25">$20-25/hr</SelectItem>
                <SelectItem value="25-plus">$25+/hr</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Preferred Location</Label>
            <Input id="location" defaultValue="Chicago, IL" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="radius">Search Radius (miles)</Label>
            <Select defaultValue="25">
              
                <SelectValue />
              </SelectTrigger>
              
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
                <SelectItem value="50">50 miles</SelectItem>
                <SelectItem value="100">100 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your profile visibility</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Allow employers to find your profile</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Work History</Label>
              <p className="text-sm text-muted-foreground">Display your employment history to employers</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Delete Account</Label>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
