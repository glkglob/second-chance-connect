import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HeartIcon, TargetIcon, EyeIcon } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-muted/50 py-12 md:py-24">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
              Empowering Second Chances
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              We believe everyone deserves an opportunity to rebuild their life. Our platform connects individuals with criminal records to employers who value second chances and the support services they need to succeed.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
