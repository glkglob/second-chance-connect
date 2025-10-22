'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, AlertTriangle, Info, Bug, RefreshCcw } from 'lucide-react'
import { PageHeader } from '@/components/page-header'

const levelConfig = {
  error: {
    icon: AlertCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    label: 'Error'
  },
  warn: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    label: 'Warning'
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    label: 'Info'
  },
  debug: {
    icon: Bug,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    label: 'Debug'
  }
}

export default function LogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unauthorized, setUnauthorized] = useState(false)
  const [levelFilter, setLevelFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchLogs()
  }, [levelFilter, typeFilter])

  async function fetchLogs() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (levelFilter !== 'all') params.append('level', levelFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)

      const response = await fetch(`/api/admin/logs?${params}`)

      if (response.status === 403 || response.status === 401) {
        setUnauthorized(true)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch logs')
      }

      const data = await response.json()
      setLogs(data.logs)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching logs:', err)
    } finally {
      setLoading(false)
    }
  }

  if (unauthorized) {
    return (
      <div className="space-y-6">
        <PageHeader
          heading="System Logs"
          description="Monitor application errors and events"
        />
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Access denied. Admin privileges required to view this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="System Logs"
        description="Monitor application errors and events"
      />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by level and type</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Log Level</label>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Log Type</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="api_request">API Request</SelectItem>
                <SelectItem value="api_response">API Response</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={fetchLogs} variant="outline" size="default">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>
            {logs.length} log {logs.length === 1 ? 'entry' : 'entries'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">Error loading logs: {error}</p>
              <Button onClick={fetchLogs} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No logs found
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map(log => (
                <LogEntry key={log.id} log={log} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About System Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Log Levels</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><strong>Error:</strong> Critical issues requiring immediate attention</li>
              <li><strong>Warning:</strong> Potential issues that should be monitored</li>
              <li><strong>Info:</strong> General application events and activities</li>
              <li><strong>Debug:</strong> Detailed diagnostic information</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Production Integration</h4>
            <p className="text-sm text-muted-foreground">
              In production, integrate with services like Sentry, Datadog, or CloudWatch 
              for comprehensive log aggregation, alerting, and analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LogEntry({ log }) {
  const config = levelConfig[log.level] || levelConfig.info
  const Icon = config.icon

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`rounded-full p-1.5 ${config.bg}`}>
            <Icon className={`h-4 w-4 ${config.color}`} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {config.label}
              </Badge>
              {log.type && (
                <Badge variant="secondary" className="text-xs">
                  {log.type}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-sm font-medium">{log.message}</p>
            {log.context && Object.keys(log.context).length > 0 && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  View details
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                  {JSON.stringify(log.context, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
