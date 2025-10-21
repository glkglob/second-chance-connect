import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BriefcaseIcon, MapPinIcon, ClockIcon } from "lucide-react"

interface JobCardProps {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary?: string
  postedDate: string
  description: string
  tags?: string[]
}

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
    <Card className="transition-shadow hover) => (
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
