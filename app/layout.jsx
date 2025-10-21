import React from "react"

import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets)

export const metadata = {
  title: "Second Chance Connect - Empowering Reintegration",
  description, and support services.",
  generator: "v0.app",
export default function RootLayout({
  children,
}{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
