import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata = {
  title: "Second Chance Connect - Empowering Reintegration",
  description:
    "Connecting individuals with criminal records to employment opportunities, probation officers, and support services.",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
