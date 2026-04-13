'use client'

import { useState } from 'react'
import { ConversationSidebar } from './conversation-sidebar'
import { ChatArea } from './chat-area'
import { ModelSelector } from './model-selector'
import { useChatStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { createConversation, selectedModel } = useChatStore()

  const handleNewConversation = () => {
    createConversation(selectedModel)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "flex flex-col border-r border-border transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-80" : "w-0"
      )}>
        {sidebarOpen && (
          <div className="flex flex-col h-full p-4">
            {/* New Chat Button */}
            <Button
              onClick={handleNewConversation}
              className="w-full mb-4 justify-start"
              size="lg"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Conversation
            </Button>

            {/* Model Selector */}
            <div className="mb-4">
              <ModelSelector />
            </div>

            {/* Conversation List */}
            <div className="flex-1 min-h-0">
              <ConversationSidebar />
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with sidebar toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
            <h1 className="text-lg font-semibold">Nexus AI</h1>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 min-h-0">
          <ChatArea />
        </div>
      </div>
    </div>
  )
}