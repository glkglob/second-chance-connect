'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, Users, Briefcase, FileText, TrendingUp, Activity } from 'lucide-react'
import { PageHeader } from '@/components/page-header'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analytics')

      if (response.status === 403 || response.status === 401) {
        setUnauthorized(true)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          heading="Platform Analytics"
          description="Monitor platform metrics and user activity"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-2" />
                <div className="h-8 bg-muted rounded w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (unauthorized) {
    return (
      <div className="space-y-6">
        <PageHeader
          heading="Platform Analytics"
          description="Monitor platform metrics and user activity"
        />
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Access denied. Admin privileges required to view this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          heading="Platform Analytics"
          description="Monitor platform metrics and user activity"
        />
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading analytics: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Platform Analytics"
        description="Monitor platform metrics and user activity"
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Users"
              value={analytics?.summary.totalUsers || 0}
              icon={Users}
              description={`+${analytics?.growth.newUsersThisMonth || 0} this month`}
            />
            <MetricCard
              title="Active Jobs"
              value={analytics?.summary.activeJobs || 0}
              icon={Briefcase}
              description={`${analytics?.summary.totalJobs || 0} total`}
            />
            <MetricCard
              title="Applications"
              value={analytics?.summary.totalApplications || 0}
              icon={FileText}
              description={`${analytics?.summary.pendingApplications || 0} pending`}
            />
            <MetricCard
              title="Success Rate"
              value={`${analytics?.summary.successRate || 0}%`}
              icon={TrendingUp}
              description={`${analytics?.summary.successfulPlacements || 0} placements`}
            />
          </div>

          {/* Growth Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Growth (Last 30 Days)</CardTitle>
              <CardDescription>New registrations and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">New Users</p>
                  <p className="text-2xl font-bold">{analytics?.growth.newUsersThisMonth || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">New Jobs</p>
                  <p className="text-2xl font-bold">{analytics?.growth.newJobsThisMonth || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">New Applications</p>
                  <p className="text-2xl font-bold">{analytics?.growth.newApplicationsThisMonth || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Users by Role */}
          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
              <CardDescription>Distribution of user types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RoleBar
                  label="Job Seekers"
                  count={analytics?.usersByRole.SEEKER || 0}
                  total={analytics?.summary.totalUsers || 1}
                  color="bg-primary"
                />
                <RoleBar
                  label="Employers"
                  count={analytics?.usersByRole.EMPLOYER || 0}
                  total={analytics?.summary.totalUsers || 1}
                  color="bg-secondary"
                />
                <RoleBar
                  label="Officers"
                  count={analytics?.usersByRole.OFFICER || 0}
                  total={analytics?.summary.totalUsers || 1}
                  color="bg-accent"
                />
                <RoleBar
                  label="Admins"
                  count={analytics?.usersByRole.ADMIN || 0}
                  total={analytics?.summary.totalUsers || 1}
                  color="bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Latest job postings</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.recentActivity.jobs.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.recentActivity.jobs.map(job => (
                      <div key={job.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent jobs</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest job applications</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.recentActivity.applications.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.recentActivity.applications.map(app => (
                      <div key={app.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{app.jobs?.title || 'Job'}</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {app.status}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent applications</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, description }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function RoleBar({ label, count, total, color }) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
