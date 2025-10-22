'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { logger } from '@/lib/logger'

/**
 * Admin Analytics Dashboard
 * Displays system metrics, user activity, and performance data
 */
export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration - replace with actual API call
      const mockData = {
        overview: {
          totalUsers: 1247,
          userGrowth: 12.5,
          activeJobs: 156,
          jobGrowth: 8.3,
          totalApplications: 892,
          applicationGrowth: 15.7,
          totalMessages: 3421,
          messageGrowth: 22.1,
          usersByRole: {
            SEEKER: 845,
            EMPLOYER: 312,
            OFFICER: 78,
            ADMIN: 12
          },
          recentActivity: {
            newUsers: 87,
            jobsPosted: 34,
            applicationsSubmitted: 156,
            messagesSent: 421
          }
        },
        performance: {
          avgResponseTime: 245,
          errorRate: 0.8,
          uptime: 99.9
        }
      }
      
      setMetrics(mockData)
      setError(null)
    } catch (err) {
      logger.error('Failed to load analytics', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics Dashboard"
          description="System metrics and performance monitoring"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics Dashboard"
          description="System metrics and performance monitoring"
        />
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Analytics</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={fetchAnalytics}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="System metrics, user activity, and performance monitoring"
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Users"
              value={metrics?.overview?.totalUsers || 0}
              change={metrics?.overview?.userGrowth || 0}
              icon={Users}
            />
            <MetricCard
              title="Active Jobs"
              value={metrics?.overview?.activeJobs || 0}
              change={metrics?.overview?.jobGrowth || 0}
              icon={Briefcase}
            />
            <MetricCard
              title="Applications"
              value={metrics?.overview?.totalApplications || 0}
              change={metrics?.overview?.applicationGrowth || 0}
              icon={FileText}
            />
            <MetricCard
              title="Messages"
              value={metrics?.overview?.totalMessages || 0}
              change={metrics?.overview?.messageGrowth || 0}
              icon={MessageSquare}
            />
          </div>

          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>User Distribution by Role</CardTitle>
              <CardDescription>Breakdown of users by role type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RoleDistribution
                  role="Job Seekers"
                  count={metrics?.overview?.usersByRole?.SEEKER || 0}
                  total={metrics?.overview?.totalUsers || 1}
                  color="bg-blue-500"
                />
                <RoleDistribution
                  role="Employers"
                  count={metrics?.overview?.usersByRole?.EMPLOYER || 0}
                  total={metrics?.overview?.totalUsers || 1}
                  color="bg-green-500"
                />
                <RoleDistribution
                  role="Officers"
                  count={metrics?.overview?.usersByRole?.OFFICER || 0}
                  total={metrics?.overview?.totalUsers || 1}
                  color="bg-purple-500"
                />
                <RoleDistribution
                  role="Admins"
                  count={metrics?.overview?.usersByRole?.ADMIN || 0}
                  total={metrics?.overview?.totalUsers || 1}
                  color="bg-red-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary (Last 30 Days)</CardTitle>
              <CardDescription>Key platform activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivitySummaryRow
                  label="New Users"
                  value={metrics?.overview?.recentActivity?.newUsers || 0}
                  icon={Users}
                />
                <ActivitySummaryRow
                  label="Jobs Posted"
                  value={metrics?.overview?.recentActivity?.jobsPosted || 0}
                  icon={Briefcase}
                />
                <ActivitySummaryRow
                  label="Applications Submitted"
                  value={metrics?.overview?.recentActivity?.applicationsSubmitted || 0}
                  icon={FileText}
                />
                <ActivitySummaryRow
                  label="Messages Sent"
                  value={metrics?.overview?.recentActivity?.messagesSent || 0}
                  icon={MessageSquare}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="API Response Time"
              value={`${metrics?.performance?.avgResponseTime || 0}ms`}
              icon={Clock}
            />
            <MetricCard
              title="Error Rate"
              value={`${metrics?.performance?.errorRate || 0}%`}
              icon={AlertTriangle}
            />
            <MetricCard
              title="Uptime"
              value={`${metrics?.performance?.uptime || 100}%`}
              icon={Activity}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance and health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed performance charts and metrics will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, change, icon: Icon }) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function RoleDistribution({ role, count, total, color }) {
  const percentage = Math.round((count / total) * 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{role}</span>
        <span className="text-muted-foreground">
          {count} ({percentage}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function ActivitySummaryRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  )
}
