import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BriefcaseIcon, MapPinIcon, ClockIcon } from "lucide-react"

export function JobCard({
  id,
  title,
  company,
  location,
  type,
  salary,
  postedDate,
  description,
  tags = [],
}) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="text-sm">{company}</CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {postedDate}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm text-muted-foreground">{description}</p>
        {tags.length > 0 && (
          <div className="flex gap-2 mb-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button asChild className="w-full">
          <Link href={`/jobs/${id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
