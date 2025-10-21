import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BriefcaseIcon, HeartHandshakeIcon, ShieldCheckIcon, TrendingUpIcon, UsersIcon, AwardIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Everyone Deserves a <span className="text-primary">Second Chance</span>
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              Connecting individuals with criminal records to meaningful employment opportunities and comprehensive
              support services for successful reintegration.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Get Started Today</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/50 py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">2,500+</div>
                <div className="mt-2 text-sm text-muted-foreground">Job Seekers Placed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">850+</div>
                <div className="mt-2 text-sm text-muted-foreground">Partner Employers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">92%</div>
                <div className="mt-2 text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-12 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Comprehensive Support for Your Journey
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              We provide end-to-end support to help you successfully reintegrate into society and build a better future.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <BriefcaseIcon className="h-10 w-10 text-primary" />
                <CardTitle>Job Matching</CardTitle>
                <CardDescription>
                  Connect with employers who believe in second chances and offer fair-chance hiring opportunities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <HeartHandshakeIcon className="h-10 w-10 text-primary" />
                <CardTitle>Support Services</CardTitle>
                <CardDescription>
                  Access housing assistance, mental health resources, substance abuse programs, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShieldCheckIcon className="h-10 w-10 text-primary" />
                <CardTitle>Legal Guidance</CardTitle>
                <CardDescription>
                  Get help with record expungement, rights restoration, and understanding your legal options.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUpIcon className="h-10 w-10 text-primary" />
                <CardTitle>Skills Training</CardTitle>
                <CardDescription>
                  Develop new skills through our training programs and certification courses to boost employability.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <UsersIcon className="h-10 w-10 text-primary" />
                <CardTitle>Community Support</CardTitle>
                <CardDescription>
                  Join a supportive community of peers and mentors who understand your journey and challenges.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <AwardIcon className="h-10 w-10 text-primary" />
                <CardTitle>Success Coaching</CardTitle>
                <CardDescription>
                  Work with dedicated coaches who provide guidance, accountability, and encouragement every step.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-y bg-primary py-12 text-primary-foreground md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Start Your New Chapter?
              </h2>
              <p className="mt-4 text-pretty text-lg opacity-90">
                Join thousands of individuals who have successfully rebuilt their lives with our support.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">Create Free Account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                  asChild
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
