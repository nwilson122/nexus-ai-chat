'use client'

import { useChat } from '@ai-sdk/react'
import { useChatStore } from '@/lib/store'
import { Conversation } from '@/components/ai-elements/conversation'
import { Message } from '@/components/ai-elements/message'
import { PromptInput } from '@/components/ai-elements/prompt-input'
import { useEffect } from 'react'
import { TokenCounter } from './token-counter'
import { EmptyState } from './empty-state'

export function ChatArea() {
  const {
    conversations,
    activeConversationId,
    selectedModel,
    addMessage,
    updateConversationTitle,
    setStreaming
  } = useChatStore()

  const activeConversation = conversations.find(conv => conv.id === activeConversationId)

  const { messages, sendMessage, status } = useChat({
    onFinish: (message) => {
      if (activeConversationId && message.message) {
        // Extract text content from message parts
        let textContent = ''
        if (message.message.parts) {
          textContent = message.message.parts
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join('')
        }

        // Add the assistant's response to our store
        addMessage(activeConversationId, textContent, 'assistant')

        if (activeConversation?.messages.length === 1 && textContent) {
          const title = textContent.split('\n')[0].slice(0, 50).replace(/[#*]/g, '').trim()
          updateConversationTitle(activeConversationId, title || 'New Conversation')
        }
      }
      setStreaming(false)
    }
  })

  useEffect(() => {
    setStreaming(status === 'streaming' || status === 'submitted')
  }, [status, setStreaming])

  const handleSendMessage = (message: any) => {
    const text = message.text || message
    if (!activeConversationId || !text?.trim()) return

    // Add user message to store
    addMessage(activeConversationId, text, 'user')

    // Send to AI
    sendMessage({ text })
    setStreaming(true)
  }

  if (!activeConversation) {
    return <EmptyState />
  }

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="font-semibold text-lg">{activeConversation.title}</h2>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{activeConversation.messages.length} messages</span>
            <span>Model: {activeConversation.model}</span>
            <TokenCounter conversationId={activeConversation.id} />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <Conversation className="h-full">
          {messages.map((message) => (
            <Message
              key={message.id}
              from={message.role}
              className={message.role === 'user' ? 'justify-end' : 'justify-start'}
            >
              {message.parts?.map((part, index) => {
                if (part.type === 'text') {
                  return <div key={index}>{part.text}</div>
                }
                return null
              })}
            </Message>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2 p-4 text-muted-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
        </Conversation>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <PromptInput
          onSubmit={handleSendMessage}
        />
      </div>
    </div>
  )
}