'use client'

import { useChatStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { History, MessageSquare, Search, Filter, Calendar, Trash2, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { ModelType } from '@/types/chat'

type SortOption = 'newest' | 'oldest' | 'most-messages' | 'least-messages'

export default function HistoryPage() {
  const { conversations, deleteConversation, setActiveConversation } = useChatStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [modelFilter, setModelFilter] = useState<'all' | ModelType>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const filteredAndSortedConversations = useMemo(() => {
    let filtered = conversations

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(conv =>
        conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.messages.some(msg =>
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Apply model filter
    if (modelFilter !== 'all') {
      filtered = filtered.filter(conv => conv.model === modelFilter)
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case 'most-messages':
          return b.messages.length - a.messages.length
        case 'least-messages':
          return a.messages.length - b.messages.length
        default:
          return 0
      }
    })
  }, [conversations, searchTerm, modelFilter, sortBy])

  const handleViewConversation = (conversationId: string) => {
    setActiveConversation(conversationId)
  }

  const getTotalTokens = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId)
    return conv?.messages.reduce((acc, msg) => acc + (msg.tokens || 0), 0) || 0
  }

  const getLastMessage = (conversation: typeof conversations[0]) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1]
    if (!lastMessage) return 'No messages'
    return lastMessage.content.length > 100
      ? lastMessage.content.slice(0, 100) + '...'
      : lastMessage.content
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Conversation History</h1>
              <p className="text-muted-foreground">Browse and manage all your conversations</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Chat</Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{conversations.length}</div>
              <div className="text-sm text-muted-foreground">Total Conversations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {conversations.reduce((acc, conv) => acc + conv.messages.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Messages</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {conversations.filter(conv => conv.model === 'claude-sonnet-4.6').length}
              </div>
              <div className="text-sm text-muted-foreground">Claude Conversations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {conversations.reduce((acc, conv) => {
                  const tokens = conv.messages.reduce((msgAcc, msg) => msgAcc + (msg.tokens || 0), 0)
                  return acc + tokens
                }, 0) >= 1000
                  ? `${(conversations.reduce((acc, conv) => {
                      const tokens = conv.messages.reduce((msgAcc, msg) => msgAcc + (msg.tokens || 0), 0)
                      return acc + tokens
                    }, 0) / 1000).toFixed(1)}K`
                  : conversations.reduce((acc, conv) => {
                      const tokens = conv.messages.reduce((msgAcc, msg) => msgAcc + (msg.tokens || 0), 0)
                      return acc + tokens
                    }, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Tokens</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations or messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Model</label>
                <Select value={modelFilter} onValueChange={(value: 'all' | ModelType) => setModelFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    <SelectItem value="claude-sonnet-4.6">Claude Sonnet 4.6</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="most-messages">Most Messages</SelectItem>
                    <SelectItem value="least-messages">Least Messages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation List */}
        <div className="space-y-4">
          {filteredAndSortedConversations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No conversations found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || modelFilter !== 'all'
                    ? 'Try adjusting your filters to see more results'
                    : 'Start a conversation to see it appear here'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedConversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium truncate">{conversation.title}</h3>
                        <Badge variant="outline">{conversation.model}</Badge>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-4">
                          <span>{conversation.messages.length} messages</span>
                          <span>{getTotalTokens(conversation.id)} tokens</span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDistanceToNow(conversation.updatedAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="line-clamp-2">{getLastMessage(conversation)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link href="/">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewConversation(conversation.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Delete this conversation?')) {
                            deleteConversation(conversation.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}