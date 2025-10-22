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
        <section className="container py-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Second Chance Starts Here
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
              Connecting individuals with criminal records to meaningful employment, supportive services, and a path
              forward.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-12 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Empowering Reintegration Through Connection
              </h2>
              <p className="mt-4 text-pretty text-muted-foreground">
                We bridge the gap between individuals seeking a fresh start and the opportunities that await them.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <BriefcaseIcon className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Job Opportunities</CardTitle>
                  <CardDescription>
                    Access fair-chance employers actively seeking to hire individuals with criminal records.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <HeartHandshakeIcon className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Support Services</CardTitle>
                  <CardDescription>
                    Connect with housing, education, healthcare, and other essential reintegration services.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <ShieldCheckIcon className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Officer Coordination</CardTitle>
                  <CardDescription>
                    Streamlined communication between probation officers and their clients for better outcomes.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUpIcon className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Career Growth</CardTitle>
                  <CardDescription>
                    Build your resume, develop skills, and advance your career with our tools and resources.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <UsersIcon className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Community Support</CardTitle>
                  <CardDescription>
                    Join a supportive community of individuals on similar journeys toward successful reintegration.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <AwardIcon className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Employer Benefits</CardTitle>
                  <CardDescription>
                    Employers gain access to motivated talent and federal tax credits up to $9,600 per hire.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-12 md:py-24">
          <div className="mx-auto max-w-3xl rounded-lg bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Ready to Take the Next Step?</h2>
            <p className="mt-4 text-pretty text-lg opacity-90">
              Join thousands of individuals who have found meaningful employment and support through Second Chance
              Connect.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                asChild
              >
                <Link href="/services">Browse Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
