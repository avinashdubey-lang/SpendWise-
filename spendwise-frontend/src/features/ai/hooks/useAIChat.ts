import { useMutation } from '@tanstack/react-query'
import { sendAIMessage, AIChatRequest } from '../api/aiApi'

export function useAIChat() {
  return useMutation({
    mutationFn: (payload: AIChatRequest) => sendAIMessage(payload),
  })
}
