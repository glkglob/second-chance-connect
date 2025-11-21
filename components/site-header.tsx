"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AuthButton } from "@/components/auth-button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">Second Chance Connect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/about"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/about" ? "text-foreground" : "text-foreground/60",
            )}
          >
            About
          </Link>
          <Link
            href="/services"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/services" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Services
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname?.startsWith("/dashboard") ? "text-foreground" : "text-foreground/60",
            )}
          >
            Dashboard
          </Link>
        </nav>

        {/* Auth Button (Desktop) */}
        <div className="hidden md:flex items-center space-x-2">
          <AuthButton />
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" className="md:hidden h-8 w-8 px-0" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 grid gap-4">
            <nav className="grid gap-2 text-sm font-medium">
              <Link
                href="/about"
                className="flex items-center py-2 text-foreground/60 hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className="flex items-center py-2 text-foreground/60 hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center py-2 text-foreground/60 hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </nav>
            <div className="pt-4 border-t">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
