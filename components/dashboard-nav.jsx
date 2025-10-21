"use client"

import React from "react"

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

>
export function DashboardNav({ items }) {
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
// Predefined navigation items for different user types
export const jobSeekerNavItems = [
  { title, href: "/dashboard", icon,
  { title, href: "/dashboard/jobs", icon,
  { title, href: "/dashboard/applications", icon,
  { title, href: "/dashboard/messages", icon,
  { title, href: "/dashboard/profile", icon,
  { title, href: "/dashboard/settings", icon,
]

export const employerNavItems = [
  { title, href: "/employer/dashboard", icon,
  { title, href: "/employer/jobs", icon,
  { title, href: "/employer/candidates", icon,
  { title, href: "/employer/messages", icon,
  { title, href: "/employer/settings", icon,
]

export const officerNavItems = [
  { title, href: "/officer/dashboard", icon,
  { title, href: "/officer/clients", icon,
  { title, href: "/officer/reports", icon,
  { title, href: "/officer/messages", icon,
  { title, href: "/officer/settings", icon,
]

export const adminNavItems = [
  { title, href: "/admin/dashboard", icon,
  { title, href: "/admin/users", icon,
  { title, href: "/admin/jobs", icon,
  { title, href: "/admin/reports", icon,
  { title, href: "/admin/content", icon,
  { title, href: "/admin/settings", icon,
]
