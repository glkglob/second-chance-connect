import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, SendIcon } from "lucide-react"

export default function EmployerMessagesPage() {
  const conversations = [
    {
      id: "1",
      name: "Michael Chen",
      avatar: "/placeholder.svg",
      lastMessage: "Thank you for considering my application!",
      timestamp: "1 hour ago",
      unread: true,
    },
    {
      id: "2",
      name: "James Rodriguez",
      avatar: "/placeholder.svg",
      lastMessage: "I'm available for an interview anytime this week.",
      timestamp: "3 hours ago",
      unread: true,
    },
    {
      id: "3",
      name: "David Thompson",
      avatar: "/placeholder.svg",
      lastMessage: "Looking forward to meeting with you.",
      timestamp: "1 day ago",
      unread: false,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Communicate with candidates" />

      {/* Conversations List */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-0">
            <div className="border-b p-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-9" />
              </div>
            </div>
            <div className="divide-y">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{conversation.name}</h4>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread && <Badge className="ml-auto">New</Badge>}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          <CardContent className="flex h-[600px] flex-col p-0">
            {/* Message Header */}
            <div className="flex items-center gap-3 border-b p-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="Michael Chen" />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Michael Chen</h3>
                <p className="text-xs text-muted-foreground">Warehouse Associate Applicant</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Michael Chen" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      Hello, I wanted to follow up on my application for the Warehouse Associate position. I'm very
                      interested in this opportunity.
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <div className="max-w-md flex-1">
                  <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                    <p className="text-sm">
                      Thank you for your interest, Michael. We've reviewed your application and would like to schedule
                      an interview. Are you available this Thursday at 2:00 PM?
                    </p>
                  </div>
                  <p className="mt-1 text-right text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="You" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Michael Chen" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      Yes, Thursday at 2:00 PM works perfectly for me. Thank you for considering my application!
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input placeholder="Type your message..." />
                <Button size="icon">
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
