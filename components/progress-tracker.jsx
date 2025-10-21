"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2Icon, CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
  completed: boolean
}

interface ProgressTrackerProps {
  title: string
  description?: string
  steps: Step[]
  currentStep?: number
}

export function ProgressTracker({ title, description, steps, currentStep = 0 }) {
  const completedSteps = steps.filter((step) => step.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="pt-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              {completedSteps} of {steps.length} completed
            </span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="mt-0.5">
                {step.completed ? (
                  <CheckCircle2Icon className="h-5 w-5 text-success" />
                ) : (
                  <CircleIcon
                    className={cn("h-5 w-5", index === currentStep ? "text-primary" )}
                  />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div
                  className={cn(
                    "font-medium",
                    step.completed && "text-muted-foreground line-through",
                    index === currentStep && "text-primary",
                  )}
                >
                  {step.title}
                </div>
                {step.description && <div className="text-sm text-muted-foreground">{step.description}</div>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
