"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, TrashIcon, DownloadIcon, EyeIcon } from "lucide-react"

export function ResumeBuilder() {
  const [skills, setSkills] = useState(["Customer Service", "Team Leadership"])
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        
          <h2 className="text-2xl font-bold">Resume Builder</h2>
          <p className="text-muted-foreground">Create a professional resume that highlights your strengths</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <EyeIcon className="mr-2 h-4 w-4" />
            Preview
          </Button>
          
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your contact details and basic information</CardDescription>
            </CardHeader>
            <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="resume-first-name">First Name</Label>
                  <Input id="resume-first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume-last-name">Last Name</Label>
                  <Input id="resume-last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume-email">Email</Label>
                <Input id="resume-email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume-phone">Phone</Label>
                <Input id="resume-phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume-location">Location</Label>
                <Input id="resume-location" placeholder="City, State" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <CardTitle>Professional Summary</CardTitle>
              <CardDescription>A brief overview of your experience and career goals</CardDescription>
            </CardHeader>
            <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
                <Label htmlFor="resume-summary">Summary</Label>
                <Textarea
                  id="resume-summary"
                  placeholder="Motivated professional with strong work ethic and commitment to excellence..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Tip, and what you can offer to employers
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          
              <div className="flex items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Your employment history and responsibilities</CardDescription>
                </div>
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Position
                </Button>
              </div>
            </CardHeader>
            <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Warehouse Associate</h4>
                    <p className="text-sm text-muted-foreground">ABC Logistics</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="month" defaultValue="2022-01" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="month" defaultValue="2023-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Responsibilities & Achievements</Label>
                  <Textarea
                    placeholder="• Managed inventory and shipping operations&#10;• Operated forklifts and pallet jacks safely&#10;• Maintained 99% accuracy in order fulfillment"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          
              <div className="flex items-center justify-between">
                <CardTitle>Education & Training</CardTitle>
                  <CardDescription>Your educational background and certifications</CardDescription>
                </div>
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-4 rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">High School Diploma</h4>
                    <p className="text-sm text-muted-foreground">Springfield High School</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    <Input type="number" placeholder="2018" />
                  </div>
                  <div className="space-y-2">
                    <Label>GPA (optional)</Label>
                    <Input placeholder="3.5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <CardTitle>Skills & Competencies</CardTitle>
              <CardDescription>Highlight your key skills and abilities</CardDescription>
            </CardHeader>
            <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-2">
                <Label htmlFor="new-skill">Add Skill</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-skill"
                    placeholder="e.g., Forklift Operation"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-1 hover:text-destructive"
                      aria-label={`Remove ${skill}`}
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
