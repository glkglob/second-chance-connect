import { PageHeader } from "@/components/page-header"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react"

export default function JobsPage() {
  const jobs = [
    {
      id: "1",
      title: "Warehouse Associate",
      company: "ABC Logistics",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$16-18/hr",
      postedDate: "2 days ago",
      description:
        "Join our team warehouse associate. Responsibilities include loading/unloading, inventory management, and order fulfillment. No experience required, we provide training.",
      tags: ["Entry Level", "Benefits", "Training Provided"],
    },
    {
      id: "2",
      title: "Kitchen Staff",
      company: "Fresh Start Cafe",
      location: "Chicago, IL",
      type: "Part-time",
      salary: "$15-17/hr",
      postedDate: "3 days ago",
      description:
        "Looking for motivated individuals to join our kitchen team. Duties include food prep, cooking, and maintaining cleanliness. Flexible scheduling available.",
      tags: ["Flexible Hours", "Food Service", "Team Environment"],
    },
    {
      id: "3",
      title: "Construction Laborer",
      company: "BuildRight Construction",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$18-22/hr",
      postedDate: "5 days ago",
      description:
        "Seeking reliable construction laborers for various projects. Tasks include site preparation, material handling, and assisting skilled tradespeople. Safety training provided.",
      tags: ["Physical Work", "Outdoor", "Growth Opportunity"],
    },
    {
      id: "4",
      title: "Delivery Driver",
      company: "QuickShip Delivery",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$17-20/hr + tips",
      postedDate: "1 week ago",
      description:
        "Deliver packages to customers in a timely and professional manner. Valid driver's license required. Company vehicle provided. Excellent earning potential with tips.",
      tags: ["Driver's License Required", "Company Vehicle", "Tips"],
    },
    {
      id: "5",
      title: "Retail Associate",
      company: "Second Chance Thrift",
      location: "Chicago, IL",
      type: "Part-time",
      salary: "$15-17/hr",
      postedDate: "1 week ago",
      description:
        "Help customers find what they need in our thrift store. Responsibilities include customer service, stocking shelves, and operating cash register. Friendly work environment.",
      tags: ["Customer Service", "Retail", "Flexible Schedule"],
    },
    {
      id: "6",
      title: "Maintenance Technician",
      company: "Property Solutions Inc",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$20-25/hr",
      postedDate: "2 weeks ago",
      description:
        "Perform maintenance and repairs on residential properties. Basic plumbing, electrical, and carpentry skills preferred but not required. On-the-job training available.",
      tags: ["Skilled Trade", "Benefits", "Training Available"],
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Find Jobs" description="Browse fair-chance employment opportunities">
        <Button variant="outline">
          <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </PageHeader>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search jobs..." className="pl-8" />
        </div>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="chicago">Chicago, IL</SelectItem>
            <SelectItem value="milwaukee">Milwaukee, WI</SelectItem>
            <SelectItem value="detroit">Detroit, MI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {jobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  )
}
