import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { ProgressTracker } from "@/components/progress-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileTextIcon, CheckCircleIcon, ClockIcon, TrendingUpIcon, CalendarIcon, MessageSquareIcon } from "lucide-react"

export default function DashboardPage() {
  const profileSteps = [
    { id: "1", title: "Create Account", description: "Set up your basic account", completed: true },
    { id: "2", title: "Complete Profile", description: "Add your personal information", completed: true },
    { id: "3", title: "Add Work Experience", description: "List your employment history", completed: true },
    { id: "4", title: "Build Resume", description: "Create your professional resume", completed: false },
    { id: "5", title: "Apply to Jobs", description: "Start applying to opportunities", completed: false },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Welcome back! Here's your overview." />

      {/* Stats Grid */}
      <div className="grid gap-4 md)
}
