import Link from "next/link"
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3 items-start">
          <div>
            <h3 className="text-lg font-semibold">Second Chance Connect</h3>
            <p className="text-sm text-muted-foreground mt-2">Connecting job seekers with employers and support services.</p>
          </div>

          <div>
            <h4 className="font-medium">Resources</h4>
            <ul className="mt-2 space-y-1">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/register">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Follow</h4>
            <div className="mt-2 flex items-center gap-3">
              <a href="#" aria-label="Twitter"><TwitterIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="LinkedIn"><LinkedinIcon /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Second Chance Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
