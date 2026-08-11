import api from '@/lib/axios'

export interface AIChatRequest {
  month: number
  year: number
  question: string
}

export interface AIChatResponse {
  response: string
}

export async function sendAIMessage(
  payload: AIChatRequest
): Promise<AIChatResponse> {
  const response = await api.post('/ai/chat', payload)
  return response.data
}
