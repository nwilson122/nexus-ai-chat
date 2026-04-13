'use client'

import { useChatStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ConversationSidebar() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    deleteConversation
  } = useChatStore()

  const handleDeleteConversation = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    deleteConversation(id)
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={cn(
              "group relative rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer",
              activeConversationId === conversation.id
                ? "bg-accent border-accent-foreground/20"
                : "bg-card hover:bg-accent/50"
            )}
            onClick={() => setActiveConversation(conversation.id)}
          >
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <h3 className="text-sm font-medium truncate">
                      {conversation.title}
                    </h3>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center justify-between">
                      <span>{conversation.messages.length} messages</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {conversation.model}
                      </span>
                    </div>
                    <div>
                      {formatDistanceToNow(conversation.updatedAt, { addSuffix: true })}
                    </div>
                  </div>

                  {/* Preview of last message */}
                  {conversation.messages.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {conversation.messages[conversation.messages.length - 1].content.slice(0, 100)}
                      {conversation.messages[conversation.messages.length - 1].content.length > 100 ? '...' : ''}
                    </div>
                  )}
                </div>

                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteConversation(conversation.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs">Start a new conversation to get started</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}