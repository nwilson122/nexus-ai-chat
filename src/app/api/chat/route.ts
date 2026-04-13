import { streamText, convertToModelMessages, gateway } from 'ai'

export async function POST(req: Request) {
  try {
    const { messages, model = 'anthropic/claude-sonnet-4.6' } = await req.json()

    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: gateway(model),
      messages: modelMessages,
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Error processing chat request', { status: 500 })
  }
}