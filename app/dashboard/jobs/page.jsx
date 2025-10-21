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
      title,
      company,
      location,
      type: "Full-time",
      salary: "$16-18/hr",
      postedDate: "2 days ago",
      description:
        "Join our team warehouse associate. Responsibilities include loading/unloading, inventory management, and order fulfillment. No experience required, we provide training.",
      tags,
    {
      id: "2",
      title,
      company,
      location,
      type: "Part-time",
      salary: "$15-17/hr",
      postedDate: "3 days ago",
      description:
        "Looking for motivated individuals to join our kitchen team. Duties include food prep, cooking, and maintaining cleanliness. Flexible scheduling available.",
      tags,
    {
      id: "3",
      title,
      company,
      location,
      type: "Full-time",
      salary: "$18-22/hr",
      postedDate: "5 days ago",
      description:
        "Seeking reliable construction laborers for various projects. Tasks include site preparation, material handling, and assisting skilled tradespeople. Safety training provided.",
      tags,
    {
      id: "4",
      title,
      company,
      location,
      type: "Full-time",
      salary: "$17-20/hr + tips",
      postedDate: "1 week ago",
      description:
        "Deliver packages to customers in a timely and professional manner. Valid driver's license required. Company vehicle provided. Excellent earning potential with tips.",
      tags,
    {
      id: "5",
      title,
      company,
      location,
      type: "Part-time",
      salary: "$15-17/hr",
      postedDate: "1 week ago",
      description:
        "Help customers find what they need in our thrift store. Responsibilities include customer service, stocking shelves, and operating cash register. Friendly work environment.",
      tags,
    {
      id: "6",
      title,
      company,
      location,
      type: "Full-time",
      salary: "$20-25/hr",
      postedDate: "2 weeks ago",
      description:
        "Perform maintenance and repairs on residential properties. Basic plumbing, electrical, and carpentry skills preferred but not required. On-the-job training available.",
      tags,
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
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="recent">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="relevant">Most Relevant</SelectItem>
            <SelectItem value="salary-high">Salary: High to Low</SelectItem>
            <SelectItem value="salary-low">Salary: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">Showing {jobs.length} jobs in your area</div>

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </div>
  )
}
