"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircleIcon, BellIcon, CheckCircle2Icon, InfoIcon, XCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const alertIcons = {
  info: InfoIcon,
  success: CheckCircle2Icon,
  warning: AlertCircleIcon,
  error: XCircleIcon,
}

const alertColors = {
  info: "text-blue-500",
  success: "text-success",
  warning: "text-yellow-500",
  error: "text-destructive",
}

export function AlertsFeed({ alerts = [], onMarkAsRead, onDismiss, maxHeight = "400px" }) {
  const unreadCount = alerts.filter((alert) => !alert.read).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            <CardTitle>Alerts</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>Stay updated with important notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BellIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No alerts at this time</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const Icon = alertIcons[alert.type]
                return (
                  <div
                    key={alert.id}
                    className={cn("rounded-lg border p-4 transition-colors", !alert.read && "bg-muted/50")}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={cn("h-5 w-5 mt-0.5", alertColors[alert.type])} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-medium">{alert.title}</div>
                          {!alert.read && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                          <div className="flex gap-2">
                            {alert.actionLabel && alert.actionHref && (
                              <Button size="sm" variant="link" className="h-auto p-0" asChild>
                                <a href={alert.actionHref}>{alert.actionLabel}</a>
                              </Button>
                            )}
                            {!alert.read && onMarkAsRead && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-auto p-0 text-xs"
                                onClick={() => onMarkAsRead(alert.id)}
                              >
                                Mark
                              </Button>
                            )}
                            {onDismiss && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-auto p-0 text-xs"
                                onClick={() => onDismiss(alert.id)}
                              >
                                Dismiss
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
