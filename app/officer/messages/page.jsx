import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, SendIcon } from "lucide-react"

export default function OfficerMessagesPage() {
  const conversations = [
    {
      id: "1",
      name,
      avatar: "/placeholder.svg",
      lastMessage: "I'll be there for my check-in tomorrow.",
      timestamp: "2 hours ago",
      unread,
    {
      id: "2",
      name,
      avatar: "/placeholder.svg",
      lastMessage: "Just wanted to update you on my new job!",
      timestamp: "1 day ago",
      unread,
    {
      id: "3",
      name,
      avatar: "/placeholder.svg",
      lastMessage,
      timestamp: "2 days ago",
      unread,
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Communicate with your clients" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
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
                  
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                    {conversation.name[0]}</AvatarFallback>
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
              
                <AvatarImage src="/placeholder.svg" alt="John Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-xs text-muted-foreground">Case #CR-2024-001</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">Hi Officer Garcia, I wanted to let you know about my job interview today.</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <div className="max-w-md flex-1">
                  <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                    <p className="text-sm">That's great to hear! How did it go?</p>
                  </div>
                  <p className="mt-1 text-right text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="You" />
                  <AvatarFallback>MG</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      It went really well! They said they'll let me know by the end of the week. I'll be there for my
                      check-in tomorrow to discuss it more.
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
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
