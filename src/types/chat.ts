export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tokens?: number
  model?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  model: string
}

export type ModelType = 'gpt-4' | 'claude-sonnet-4.6' | 'gemini-pro'

export interface AppState {
  conversations: Conversation[]
  activeConversationId: string | null
  selectedModel: ModelType
  isStreaming: boolean
}