import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BriefcaseIcon,
  HomeIcon,
  HeartPulseIcon,
  ScaleIcon,
  GraduationCapIcon,
  UsersIcon,
  DollarSignIcon,
  FileTextIcon,
} from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-muted/50 py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl text-center mx-auto">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Support Services</h1>
              <p className="text-lg text-muted-foreground">
                Connect with organizations that provide essential services for successful reintegration.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HomeIcon className="h-6 w-6 text-primary" />
                    <CardTitle>Housing</CardTitle>
                  </div>
                  <CardDescription>Transitional and permanent housing options</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find safe, affordable housing to establish stability as you rebuild your life.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GraduationCapIcon className="h-6 w-6 text-primary" />
                    <CardTitle>Education</CardTitle>
                  </div>
                  <CardDescription>GED programs, vocational training, and higher education</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Develop new skills and complete your education to increase job opportunities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HeartPulseIcon className="h-6 w-6 text-primary" />
                    <CardTitle>Health</CardTitle>
                  </div>
                  <CardDescription>Medical care, mental health, and substance abuse treatment</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access healthcare services to maintain your physical and mental well-being.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
