"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BriefcaseIcon,
  FileTextIcon,
  HomeIcon,
  MessageSquareIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface DashboardNavProps {
  items: NavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className={cn("justify-start", isActive && "bg-secondary font-medium")}
            asChild
          >
            <Link href={item.href}>
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}

// Predefined navigation items for different user types
export const jobSeekerNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { title: "Find Jobs", href: "/dashboard/jobs", icon: BriefcaseIcon },
  { title: "Applications", href: "/dashboard/applications", icon: FileTextIcon },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquareIcon },
  { title: "Profile", href: "/dashboard/profile", icon: UserIcon },
  { title: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
]

export const employerNavItems: NavItem[] = [
  { title: "Dashboard", href: "/employer/dashboard", icon: HomeIcon },
  { title: "Job Postings", href: "/employer/jobs", icon: BriefcaseIcon },
  { title: "Candidates", href: "/employer/candidates", icon: UserIcon },
  { title: "Messages", href: "/employer/messages", icon: MessageSquareIcon },
  { title: "Settings", href: "/employer/settings", icon: SettingsIcon },
]

export const officerNavItems: NavItem[] = [
  { title: "Dashboard", href: "/officer/dashboard", icon: HomeIcon },
  { title: "My Clients", href: "/officer/clients", icon: UserIcon },
  { title: "Reports", href: "/officer/reports", icon: FileTextIcon },
  { title: "Messages", href: "/officer/messages", icon: MessageSquareIcon },
  { title: "Settings", href: "/officer/settings", icon: SettingsIcon },
]

export const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { title: "Users", href: "/admin/users", icon: UsersIcon },
  { title: "Job Postings", href: "/admin/jobs", icon: BriefcaseIcon },
  { title: "Reports", href: "/admin/reports", icon: FileTextIcon },
  { title: "Content", href: "/admin/content", icon: FileTextIcon },
  { title: "Settings", href: "/admin/settings", icon: SettingsIcon },
]
