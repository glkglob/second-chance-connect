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
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                About Second Chance Connect
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground">
                We're on a mission to break down barriers and create pathways to success for individuals with criminal
                records.
              </p>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="container py-12 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <TargetIcon className="h-10 w-10 text-primary" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To empower individuals with criminal records by connecting them to employment opportunities,
                  comprehensive support services, and a community that believes in second chances.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <EyeIcon className="h-10 w-10 text-primary" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A society where everyone has the opportunity to rebuild their lives, contribute meaningfully, and
                  achieve their full potential regardless of their past.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <HeartIcon className="h-10 w-10 text-primary" />
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Dignity and respect for all</li>
                  <li>• Belief in redemption</li>
                  <li>• Commitment to equity</li>
                  <li>• Community empowerment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Story */}
        <section className="border-y bg-muted/50 py-12 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-balance text-3xl font-bold tracking-tight">Our Story</h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  Second Chance Connect was founded in 2018 by a group of social workers, formerly incarcerated
                  individuals, and community advocates who recognized the systemic barriers preventing successful
                  reintegration.
                </p>
                <p>
                  We saw talented, motivated individuals struggling to find employment simply because of their criminal
                  records. We witnessed families torn apart and communities suffering from high recidivism rates. We
                  knew there had to be a better way.
                </p>
                <p>
                  Today, we've helped over 2,500 individuals find meaningful employment and access critical support
                  services. We've partnered with 850+ employers who believe in fair-chance hiring. And we've built a
                  community that proves everyone deserves a second chance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="container py-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight">Our Impact</h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Real results that change lives and strengthen communities.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">2,500+</div>
              <div className="mt-2 text-sm font-medium">Individuals Placed</div>
              <div className="mt-1 text-xs text-muted-foreground">In meaningful employment</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">850+</div>
              <div className="mt-2 text-sm font-medium">Partner Employers</div>
              <div className="mt-1 text-xs text-muted-foreground">Committed to fair-chance hiring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">92%</div>
              <div className="mt-2 text-sm font-medium">Retention Rate</div>
              <div className="mt-1 text-xs text-muted-foreground">After 12 months</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">15%</div>
              <div className="mt-2 text-sm font-medium">Recidivism Rate</div>
              <div className="mt-1 text-xs text-muted-foreground">vs. 68% national average</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-primary py-12 text-primary-foreground">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight">Join Our Mission</h2>
              <p className="mt-4 text-pretty opacity-90">
                Whether you're seeking employment or looking to hire, we're here to help.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
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
