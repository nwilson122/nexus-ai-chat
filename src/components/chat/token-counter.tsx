'use client'

import { useChatStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'

interface TokenCounterProps {
  conversationId: string
}

export function TokenCounter({ conversationId }: TokenCounterProps) {
  const { getTotalTokens } = useChatStore()
  const totalTokens = getTotalTokens(conversationId)

  const formatTokens = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <Badge variant="outline" className="flex items-center space-x-1">
      <Zap className="h-3 w-3" />
      <span>{formatTokens(totalTokens)} tokens</span>
    </Badge>
  )
}