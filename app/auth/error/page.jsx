import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark) : params?.error ? (
              <p className="text-sm text-muted-foreground">Error code) : (
              <p className="text-sm text-muted-foreground">An unexpected error occurred during authentication.</p>
            )}
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/auth/login">Try Again</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
