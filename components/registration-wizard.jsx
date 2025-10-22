"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon } from "lucide-react"

const steps = [
  { id: 1, title: "Account Info", description: "Basic account details" },
  { id: 2, title: "Personal Info", description: "Tell us about yourself" },
  { id: 3, title: "Background", description: "Employment history" },
  { id: 4, title: "Preferences", description: "Job preferences" },
]

export function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("[v0] Registration completed")
    // Handle form submission
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Step {currentStep} of {steps.length}
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step Indicators */}
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${currentStep >= step.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
              >
                {step.id}
              </div>
              <div className="text-center">
                <div className="text-xs font-medium">{step.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a secure password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" placeholder="Re-enter your password" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" placeholder="123 Main St" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Springfield" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ca">California</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="tx">Texas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" placeholder="12345" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="education">Highest Education Level</Label>
              <Select>
                <SelectTrigger id="education">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School / GED</SelectItem>
                  <SelectItem value="some-college">Some College</SelectItem>
                  <SelectItem value="associates">Associate's Degree</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree or Higher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Work Experience</Label>
              <Select>
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">Less than 1 year</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Key Skills (comma-separated)</Label>
              <Textarea
                id="skills"
                placeholder="e.g., Customer service, Forklift operation, Basic computer skills"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Brief Professional Summary</Label>
              <Textarea
                id="summary"
                placeholder="Tell employers about your strengths and what you're looking for..."
                rows={4}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-type">Preferred Job Type</Label>
              <Select>
                <SelectTrigger id="job-type">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industries">Interested Industries</Label>
              <Textarea id="industries" placeholder="e.g., Construction, Hospitality, Retail, Manufacturing" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Desired Salary Range</Label>
              <Select>
                <SelectTrigger id="salary">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15-18">$15-18/hr</SelectItem>
                  <SelectItem value="18-22">$18-22/hr</SelectItem>
                  <SelectItem value="22-28">$22-28/hr</SelectItem>
                  <SelectItem value="28+">$28+/hr</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Additional Preferences</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="transportation" />
                <label htmlFor="transportation" className="text-sm cursor-pointer">
                  I have reliable transportation
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="flexible" />
                <label htmlFor="flexible" className="text-sm cursor-pointer">
                  I'm open to flexible schedules
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remote" />
                <label htmlFor="remote" className="text-sm cursor-pointer">
                  Interested in remote opportunities
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep < steps.length ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <CheckCircle2Icon className="mr-2 h-4 w-4" />
            Complete Registration
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
