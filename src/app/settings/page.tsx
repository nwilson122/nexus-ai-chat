'use client'

import { useChatStore } from '@/lib/store'
import { ModelType } from '@/types/chat'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Settings, Bot, Trash2, Download } from 'lucide-react'
import Link from 'next/link'

const modelInfo: Record<ModelType, { provider: string; description: string; capabilities: string[] }> = {
  'claude-sonnet-4.6': {
    provider: 'Anthropic',
    description: 'Most capable model with advanced reasoning and analysis capabilities',
    capabilities: ['Complex reasoning', 'Code analysis', 'Long context', 'Safety focused']
  },
  'gpt-4': {
    provider: 'OpenAI',
    description: 'Excellent for creative tasks, coding, and general conversation',
    capabilities: ['Creative writing', 'Code generation', 'Problem solving', 'Multi-modal']
  },
  'gemini-pro': {
    provider: 'Google',
    description: 'Fast and efficient for general tasks and quick responses',
    capabilities: ['Fast responses', 'General knowledge', 'Multi-language', 'Cost effective']
  }
}

export default function SettingsPage() {
  const {
    selectedModel,
    setSelectedModel,
    conversations,
    deleteConversation
  } = useChatStore()

  const totalConversations = conversations.length
  const totalMessages = conversations.reduce((acc, conv) => acc + conv.messages.length, 0)
  const totalTokens = conversations.reduce((acc, conv) => {
    return acc + conv.messages.reduce((msgAcc, msg) => msgAcc + (msg.tokens || 0), 0)
  }, 0)

  const handleClearAllConversations = () => {
    if (confirm('Are you sure you want to delete all conversations? This action cannot be undone.')) {
      conversations.forEach(conv => deleteConversation(conv.id))
    }
  }

  const handleExportConversations = () => {
    const dataStr = JSON.stringify(conversations, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `nexus-ai-conversations-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Configure your Nexus AI experience</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Chat</Button>
          </Link>
        </div>

        {/* AI Model Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>AI Model Configuration</span>
            </CardTitle>
            <CardDescription>
              Choose your preferred AI model for new conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Default Model</label>
              <Select value={selectedModel} onValueChange={(value: ModelType) => setSelectedModel(value)}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(modelInfo).map(([model, info]) => (
                    <SelectItem key={model} value={model}>
                      <div className="flex flex-col py-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{model}</span>
                          <Badge variant="outline" className="text-xs">{info.provider}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{info.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current Model Info */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{selectedModel}</h4>
                  <p className="text-sm text-muted-foreground">{modelInfo[selectedModel].description}</p>
                </div>
                <Badge>{modelInfo[selectedModel].provider}</Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {modelInfo[selectedModel].capabilities.map((capability) => (
                  <Badge key={capability} variant="secondary" className="text-xs">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>Your Nexus AI usage summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-2xl font-bold">{totalConversations}</div>
                <div className="text-sm text-muted-foreground">Conversations</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold">{totalMessages}</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold">
                  {totalTokens >= 1000 ? `${(totalTokens / 1000).toFixed(1)}K` : totalTokens}
                </div>
                <div className="text-sm text-muted-foreground">Total Tokens</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your conversation data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Export Conversations</h4>
                <p className="text-sm text-muted-foreground">Download all your conversations as JSON</p>
              </div>
              <Button onClick={handleExportConversations} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Clear All Conversations</h4>
                <p className="text-sm text-muted-foreground">Permanently delete all conversation history</p>
              </div>
              <Button onClick={handleClearAllConversations} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About Nexus AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Nexus AI is a modern chat interface built with Next.js 16, AI SDK v6, and AI Elements.</p>
            <p>Features include streaming responses, multiple AI models, and conversation management.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline">Next.js 16</Badge>
              <Badge variant="outline">AI SDK v6</Badge>
              <Badge variant="outline">AI Elements</Badge>
              <Badge variant="outline">shadcn/ui</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}