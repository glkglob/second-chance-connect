import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav, jobSeekerNavItems } from "@/components/dashboard-nav"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName="John Doe" userEmail="john.doe@example.com" />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/50 lg:block">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <DashboardNav items={jobSeekerNavItems} />
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
