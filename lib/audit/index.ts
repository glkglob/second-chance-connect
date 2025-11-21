import { createClient } from "@/lib/supabase/server"
import { logError } from "@/lib/logger"

export interface AuditLogEntry {
  action: string
  userId: string
  resourceType: string
  resourceId: string
  changes?: Record<string, any>
  status: "success" | "failure"
  ipAddress?: string
  userAgent?: string
}

export async function auditLog(entry: AuditLogEntry) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("audit_logs").insert([
      {
        action: entry.action,
        user_id: entry.userId,
        resource_type: entry.resourceType,
        resource_id: entry.resourceId,
        changes: entry.changes,
        status: entry.status,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      logError("[Audit] Failed to log to database:", error)
    }
  } catch (error) {
    logError("[Audit] Failed to log:", error)
  }
}
