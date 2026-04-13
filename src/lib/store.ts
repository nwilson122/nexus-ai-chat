import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppState, Conversation, ModelType } from '@/types/chat'

// Mock data: 5 pre-populated conversations
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Next.js Best Practices',
    messages: [
      {
        id: '1a',
        role: 'user',
        content: 'What are the latest Next.js 16 best practices for App Router?',
        timestamp: new Date('2024-03-20T10:00:00Z'),
        tokens: 12
      },
      {
        id: '1b',
        role: 'assistant',
        content: '# Next.js 16 App Router Best Practices\n\nHere are the key best practices for Next.js 16:\n\n## 1. Server Components by Default\n- Use Server Components as the default\n- Only add `\'use client\'` when you need interactivity\n- Push client boundaries down the component tree\n\n## 2. Async Request APIs\n```tsx\n// All request APIs are now async in Next.js 16\nconst cookies = await cookies()\nconst headers = await headers()\nconst params = await params\n```\n\n## 3. Cache Components\n- Use `\'use cache\'` for mixing static and dynamic content\n- Replace PPR with Cache Components for better performance\n\n## 4. Proxy.ts (renamed from middleware.ts)\n- Place `proxy.ts` at the same level as `app/`\n- Runs on Node.js runtime only',
        timestamp: new Date('2024-03-20T10:01:00Z'),
        tokens: 156,
        model: 'claude-sonnet-4.6'
      }
    ],
    createdAt: new Date('2024-03-20T10:00:00Z'),
    updatedAt: new Date('2024-03-20T10:01:00Z'),
    model: 'claude-sonnet-4.6'
  },
  {
    id: '2',
    title: 'AI SDK Integration',
    messages: [
      {
        id: '2a',
        role: 'user',
        content: 'How do I integrate AI SDK v6 with streaming?',
        timestamp: new Date('2024-03-21T14:30:00Z'),
        tokens: 10
      },
      {
        id: '2b',
        role: 'assistant',
        content: '# AI SDK v6 Streaming Integration\n\n## Installation\n```bash\nnpm install ai @ai-sdk/react\n```\n\n## Server Setup\n```tsx\n// app/api/chat/route.ts\nimport { streamText, convertToModelMessages, gateway } from \'ai\'\n\nexport async function POST(req: Request) {\n  const { messages } = await req.json()\n  const modelMessages = await convertToModelMessages(messages)\n\n  const result = streamText({\n    model: gateway(\'anthropic/claude-sonnet-4.6\'),\n    messages: modelMessages,\n  })\n\n  return result.toUIMessageStreamResponse()\n}\n```\n\n## Client Setup\n```tsx\nimport { useChat, DefaultChatTransport } from \'@ai-sdk/react\'\n\nconst { messages, sendMessage } = useChat({\n  transport: new DefaultChatTransport({ api: \'/api/chat\' })\n})\n```',
        timestamp: new Date('2024-03-21T14:32:00Z'),
        tokens: 189,
        model: 'claude-sonnet-4.6'
      }
    ],
    createdAt: new Date('2024-03-21T14:30:00Z'),
    updatedAt: new Date('2024-03-21T14:32:00Z'),
    model: 'claude-sonnet-4.6'
  },
  {
    id: '3',
    title: 'TypeScript Debugging',
    messages: [
      {
        id: '3a',
        role: 'user',
        content: 'Help me debug this TypeScript error with React components',
        timestamp: new Date('2024-03-22T09:15:00Z'),
        tokens: 11
      },
      {
        id: '3b',
        role: 'assistant',
        content: 'I\'d be happy to help debug your TypeScript error! Could you share:\n\n1. **The specific error message** you\'re seeing\n2. **The component code** that\'s causing the issue\n3. **Your TypeScript configuration** (tsconfig.json)\n\nCommon React + TypeScript issues include:\n\n- **Props interface mismatches**\n- **Missing key props** in mapped components\n- **Event handler typing** issues\n- **useRef and useState** generic types\n- **Import/export** type vs value conflicts\n\nOnce you share the details, I can provide a targeted solution!',
        timestamp: new Date('2024-03-22T09:16:00Z'),
        tokens: 98,
        model: 'gpt-4'
      }
    ],
    createdAt: new Date('2024-03-22T09:15:00Z'),
    updatedAt: new Date('2024-03-22T09:16:00Z'),
    model: 'gpt-4'
  },
  {
    id: '4',
    title: 'Database Design',
    messages: [
      {
        id: '4a',
        role: 'user',
        content: 'What\'s the best approach for designing a scalable database schema?',
        timestamp: new Date('2024-03-23T16:45:00Z'),
        tokens: 13
      },
      {
        id: '4b',
        role: 'assistant',
        content: '# Scalable Database Schema Design\n\n## Core Principles\n\n### 1. Normalization vs Denormalization\n- **Start normalized** to avoid data inconsistency\n- **Selectively denormalize** for performance hotspots\n- Use **materialized views** for complex queries\n\n### 2. Indexing Strategy\n```sql\n-- Composite indexes for multi-column queries\nCREATE INDEX idx_user_activity ON user_actions(user_id, created_at);\n\n-- Partial indexes for filtered queries\nCREATE INDEX idx_active_users ON users(id) WHERE status = \'active\';\n```\n\n### 3. Partitioning\n- **Horizontal partitioning** by date/region\n- **Vertical partitioning** for wide tables\n- Consider **sharding** for massive scale\n\n### 4. Future-Proofing\n- Use **UUIDs** instead of auto-incrementing IDs\n- Plan for **soft deletes** with `deleted_at` columns\n- Version your schema changes with **migrations**\n\n### 5. Performance Monitoring\n- Track **slow queries** (>100ms)\n- Monitor **connection pool** usage\n- Set up **query explain analysis**',
        timestamp: new Date('2024-03-23T16:47:00Z'),
        tokens: 203,
        model: 'claude-sonnet-4.6'
      }
    ],
    createdAt: new Date('2024-03-23T16:45:00Z'),
    updatedAt: new Date('2024-03-23T16:47:00Z'),
    model: 'claude-sonnet-4.6'
  },
  {
    id: '5',
    title: 'Performance Optimization',
    messages: [
      {
        id: '5a',
        role: 'user',
        content: 'My React app is slow. How can I optimize rendering performance?',
        timestamp: new Date('2024-03-24T11:20:00Z'),
        tokens: 13
      },
      {
        id: '5b',
        role: 'assistant',
        content: '# React Performance Optimization Guide\n\n## Profiling First\n```bash\n# Use React DevTools Profiler\nnpm install --save-dev @welldone-software/why-did-you-render\n```\n\n## Common Performance Issues\n\n### 1. Unnecessary Re-renders\n```tsx\n//  Bad: Object created on every render\nconst style = { color: \'red\' }\n\n//  Good: Stable reference\nconst style = useMemo(() => ({ color: \'red\' }), [])\n```\n\n### 2. Large Lists\n```tsx\n//  Virtualization for large datasets\nimport { FixedSizeList } from \'react-window\'\n\n<FixedSizeList\n  height={400}\n  itemCount={items.length}\n  itemSize={35}\n>\n  {Row}\n</FixedSizeList>\n```\n\n### 3. Expensive Calculations\n```tsx\n//  Memoize expensive operations\nconst expensiveValue = useMemo(() => {\n  return heavyCalculation(data)\n}, [data])\n```\n\n### 4. Component Splitting\n- Split components by **update frequency**\n- Use **React.memo()** for pure components\n- Implement **code splitting** with dynamic imports',
        timestamp: new Date('2024-03-24T11:22:00Z'),
        tokens: 167,
        model: 'gemini-pro'
      }
    ],
    createdAt: new Date('2024-03-24T11:20:00Z'),
    updatedAt: new Date('2024-03-24T11:22:00Z'),
    model: 'gemini-pro'
  }
]

interface ChatStore extends AppState {
  // Actions
  addMessage: (conversationId: string, content: string, role: 'user' | 'assistant') => void
  createConversation: (model: ModelType) => string
  deleteConversation: (id: string) => void
  setActiveConversation: (id: string | null) => void
  setSelectedModel: (model: ModelType) => void
  setStreaming: (streaming: boolean) => void
  updateConversationTitle: (id: string, title: string) => void
  getTotalTokens: (conversationId: string) => number
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      conversations: mockConversations,
      activeConversationId: mockConversations[0].id,
      selectedModel: 'claude-sonnet-4.6',
      isStreaming: false,

      // Actions
      addMessage: (conversationId, content, role) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    {
                      id: Date.now().toString(),
                      role,
                      content,
                      timestamp: new Date(),
                      tokens: role === 'user' ? content.split(' ').length : undefined,
                      model: role === 'assistant' ? state.selectedModel : undefined,
                    },
                  ],
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      createConversation: (model) => {
        const id = Date.now().toString()
        set((state) => ({
          conversations: [
            {
              id,
              title: 'New Conversation',
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              model,
            },
            ...state.conversations,
          ],
          activeConversationId: id,
        }))
        return id
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          activeConversationId:
            state.activeConversationId === id ? state.conversations[0]?.id || null : state.activeConversationId,
        }))
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id })
      },

      setSelectedModel: (model) => {
        set({ selectedModel: model })
      },

      setStreaming: (streaming) => {
        set({ isStreaming: streaming })
      },

      updateConversationTitle: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv
          ),
        }))
      },

      getTotalTokens: (conversationId) => {
        const conversation = get().conversations.find((conv) => conv.id === conversationId)
        return conversation?.messages.reduce((total, msg) => total + (msg.tokens || 0), 0) || 0
      },
    }),
    {
      name: 'nexus-chat-store',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        selectedModel: state.selectedModel,
      }),
    }
  )
)