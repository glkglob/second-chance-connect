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
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <BriefcaseIcon className="h-3 w-3" />
              {company}
            </CardDescription>
          </div>
          <Badge variant="secondary">{type}</Badge>
        </div>
      </CardHeader>
      <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            {postedDate}
          </div>
          {salary && <div className="font-medium text-foreground">{salary}</div>}
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
