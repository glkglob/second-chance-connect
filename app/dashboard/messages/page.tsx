import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, SendIcon } from "lucide-react"

export default function MessagesPage() {
  const conversations = [
    {
      id: "1",
      name: "ABC Logistics",
      avatar: "/placeholder.svg",
      lastMessage: "We'd like to schedule an interview with you.",
      timestamp: "2 hours ago",
      unread: true,
    },
    {
      id: "2",
      name: "Fresh Start Cafe",
      avatar: "/placeholder.svg",
      lastMessage: "Thank you for your application. We'll be in touch soon.",
      timestamp: "1 day ago",
      unread: false,
    },
    {
      id: "3",
      name: "Support Team",
      avatar: "/placeholder.svg",
      lastMessage: "How can we help you today?",
      timestamp: "3 days ago",
      unread: false,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Communicate with employers and support staff" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="mb-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
                >
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                    <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{conversation.name}</span>
                      {conversation.unread && <Badge className="h-2 w-2 rounded-full p-0" />}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                  </div>
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
                <AvatarImage src="/placeholder.svg" alt="ABC Logistics" />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">ABC Logistics</h3>
                <p className="text-xs text-muted-foreground">Warehouse Associate Position</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="ABC Logistics" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      Thank you for applying to the Warehouse Associate position. We've reviewed your application and
                      would like to schedule an interview.
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="ABC Logistics" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      Are you available for an interview this Thursday at 2:00 PM? Please let us know if this time works
                      for you.
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <div className="flex-1 max-w-md">
                  <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                    <p className="text-sm">
                      Yes, Thursday at 2:00 PM works perfectly for me. Thank you for the opportunity!
                    </p>
                  </div>
                  <p className="mt-1 text-right text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="You" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
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
