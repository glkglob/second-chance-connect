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
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Support Services</h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground">
                Comprehensive resources and support to help you successfully reintegrate and build a better future.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container py-12 md:py-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <BriefcaseIcon className="h-10 w-10 text-primary" />
                <CardTitle>Employment Services</CardTitle>
                <CardDescription>Job search assistance and career development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Resume writing and interview preparation</p>
                <p>• Job matching with fair-chance employers</p>
                <p>• Career counseling and planning</p>
                <p>• Workplace readiness training</p>
                <p>• Job retention support</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <HomeIcon className="h-10 w-10 text-primary" />
                <CardTitle>Housing Assistance</CardTitle>
                <CardDescription>Help finding stable and affordable housing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Transitional housing programs</p>
                <p>• Rental assistance and subsidies</p>
                <p>• Landlord advocacy and mediation</p>
                <p>• Housing search assistance</p>
                <p>• Emergency shelter referrals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <HeartPulseIcon className="h-10 w-10 text-primary" />
                <CardTitle>Mental Health Support</CardTitle>
                <CardDescription>Counseling and mental wellness resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Individual and group therapy</p>
                <p>• Trauma-informed care</p>
                <p>• Substance abuse treatment</p>
                <p>• Crisis intervention services</p>
                <p>• Peer support groups</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ScaleIcon className="h-10 w-10 text-primary" />
                <CardTitle>Legal Services</CardTitle>
                <CardDescription>Legal guidance and advocacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Record expungement assistance</p>
                <p>• Rights restoration guidance</p>
                <p>• Legal aid referrals</p>
                <p>• Court advocacy support</p>
                <p>• Know your rights education</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <GraduationCapIcon className="h-10 w-10 text-primary" />
                <CardTitle>Education & Training</CardTitle>
                <CardDescription>Skills development and certification programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• GED preparation and testing</p>
                <p>• Vocational training programs</p>
                <p>• Industry certifications</p>
                <p>• Computer literacy courses</p>
                <p>• Financial literacy education</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <UsersIcon className="h-10 w-10 text-primary" />
                <CardTitle>Family Support</CardTitle>
                <CardDescription>Resources for families and relationships</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Family reunification services</p>
                <p>• Parenting classes and support</p>
                <p>• Child care assistance</p>
                <p>• Relationship counseling</p>
                <p>• Family advocacy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSignIcon className="h-10 w-10 text-primary" />
                <CardTitle>Financial Services</CardTitle>
                <CardDescription>Financial stability and planning support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Financial counseling</p>
                <p>• Budgeting assistance</p>
                <p>• Credit repair guidance</p>
                <p>• Banking access support</p>
                <p>• Emergency financial aid</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileTextIcon className="h-10 w-10 text-primary" />
                <CardTitle>Documentation Help</CardTitle>
                <CardDescription>Assistance obtaining essential documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• ID and driver's license assistance</p>
                <p>• Birth certificate retrieval</p>
                <p>• Social Security card replacement</p>
                <p>• Professional licenses</p>
                <p>• Background check guidance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <HeartPulseIcon className="h-10 w-10 text-primary" />
                <CardTitle>Healthcare Access</CardTitle>
                <CardDescription>Medical and health insurance support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Health insurance enrollment</p>
                <p>• Medical care referrals</p>
                <p>• Prescription assistance</p>
                <p>• Dental and vision care</p>
                <p>• Wellness programs</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Access Services */}
        <section className="border-y bg-muted/50 py-12 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-balance text-center text-3xl font-bold tracking-tight">How to Access Services</h2>
              <div className="mt-12 space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Create an Account</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sign up for free to access our platform and connect with service providers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Complete Your Profile</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tell us about your needs and goals so we can match you with the right services.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Connect with Providers</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Browse available services and connect directly with providers in your area.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Get Support</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Work with our team and service providers to access the resources you need.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Button size="lg" asChild>
                  <Link href="/register">Get Started Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="container py-12 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight">Need Help Right Away?</h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Our team is here to help you navigate available services and connect you with the support you need.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
