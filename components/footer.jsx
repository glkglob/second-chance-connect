import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">SC</span>
              </div>
              <span className="text-base font-semibold">Second Chance Connect</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering reintegration through meaningful connections and opportunities.
            </p>
          </div>

          {/* For Job Seekers */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">For Job Seekers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              
                <Link href="/jobs" className="hover:text-foreground transition-colors">
                  Browse Jobs
                </Link>
              </li>
              
                <Link href="/resume-builder" className="hover:text-foreground transition-colors">
                  Resume Builder
                </Link>
              </li>
              
                <Link href="/support" className="hover:text-foreground transition-colors">
                  Support Services
                </Link>
              </li>
              
                <Link href="/resources" className="hover:text-foreground transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">For Employers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              
                <Link href="/post-job" className="hover:text-foreground transition-colors">
                  Post a Job
                </Link>
              </li>
              
                <Link href="/candidates" className="hover:text-foreground transition-colors">
                  Find Candidates
                </Link>
              </li>
              
                <Link href="/fair-chance-hiring" className="hover:text-foreground transition-colors">
                  Fair Chance Hiring
                </Link>
              </li>
              
                <Link href="/employer-resources" className="hover:text-foreground transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              
                <Link href="/impact" className="hover:text-foreground transition-colors">
                  Our Impact
                </Link>
              </li>
              
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 Second Chance Connect. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
