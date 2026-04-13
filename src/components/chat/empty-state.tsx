'use client'

import { Button } from '@/components/ui/button'
import { useChatStore } from '@/lib/store'
import { MessageCircle, Sparkles, Code, BookOpen, Lightbulb } from 'lucide-react'

const suggestions = [
  {
    icon: Code,
    title: "Help me debug code",
    description: "Get assistance with programming issues and errors"
  },
  {
    icon: BookOpen,
    title: "Explain a concept",
    description: "Learn about technical topics and frameworks"
  },
  {
    icon: Lightbulb,
    title: "Brainstorm ideas",
    description: "Generate creative solutions and approaches"
  },
  {
    icon: Sparkles,
    title: "Review my work",
    description: "Get feedback on code, designs, or content"
  }
]

export function EmptyState() {
  const { createConversation, selectedModel, setActiveConversation } = useChatStore()

  const handleSuggestionClick = () => {
    const id = createConversation(selectedModel)
    setActiveConversation(id)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <MessageCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Welcome to Nexus AI</h2>
          <p className="text-muted-foreground">
            Start a conversation with AI to get help, learn new things, or explore ideas.
            Choose from multiple AI models and enjoy smooth streaming conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={handleSuggestionClick}
            >
              <div className="flex items-start space-x-3">
                <suggestion.icon className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm">{suggestion.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {suggestion.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground space-y-2">
          <p>Currently using: <span className="font-medium">{selectedModel}</span></p>
          <p>You can change the model anytime from the sidebar</p>
        </div>
      </div>
    </div>
  )
}