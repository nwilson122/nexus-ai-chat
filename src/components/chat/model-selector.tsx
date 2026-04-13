'use client'

import { useChatStore } from '@/lib/store'
import { ModelType } from '@/types/chat'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bot } from 'lucide-react'

const modelConfig: Record<ModelType, { label: string; description: string }> = {
  'claude-sonnet-4.6': {
    label: 'Claude Sonnet 4.6',
    description: 'Most capable, best for complex reasoning'
  },
  'gpt-4': {
    label: 'GPT-4',
    description: 'Excellent for creative tasks and coding'
  },
  'gemini-pro': {
    label: 'Gemini Pro',
    description: 'Fast and efficient for general tasks'
  }
}

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore()

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm font-medium">
        <Bot className="h-4 w-4" />
        <span>AI Model</span>
      </div>

      <Select value={selectedModel} onValueChange={(value: ModelType) => setSelectedModel(value)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(modelConfig).map(([model, config]) => (
            <SelectItem key={model} value={model} className="space-y-1">
              <div className="flex flex-col">
                <div className="font-medium">{config.label}</div>
                <div className="text-xs text-muted-foreground">
                  {config.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Current model info */}
      <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
        <div className="font-medium">{modelConfig[selectedModel].label}</div>
        <div>{modelConfig[selectedModel].description}</div>
      </div>
    </div>
  )
}