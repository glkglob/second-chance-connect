import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets)

export const metadata: Metadata = {
  title: "Second Chance Connect - Empowering Reintegration",
  description:
    "Connecting individuals with criminal records to employment opportunities, probation officers, and support services.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
