import React, { useState, useEffect, useRef } from 'react'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { useAuth } from '@/providers/AuthProvider'
import { useAIChat } from './hooks/useAIChat'
import { Sparkles, MessageSquare, Send, ArrowRight } from 'lucide-react'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  "Where did I spend the most last week?",
  "Help me design a budget for dining out.",
  "Am I on track to meet my Emergency Fund goal?"
]

export const AICoach: React.FC = () => {
  const { user } = useAuth()
  const chatMutation = useAIChat()
  const [inputValue, setInputValue] = useState('')

  // Dynamically personalize the greeting
  const userName = user?.name ? user.name.split(' ')[0] : 'Alex'
  const initialWelcome = `Hi ${userName}! I'm your SpendWise AI Mentor. I analyze your spending behavior and help you build financial discipline. What financial query or goal can I assist you with today?`

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: initialWelcome }
  ])

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom whenever messages list grows
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, chatMutation.isPending])

  const getErrorMessage = (error: any) => {
    if (!error) return 'An unexpected error occurred.'
    
    const status = error.response?.status
    const backendDetail = error.response?.data?.detail || error.response?.data?.message

    switch (status) {
      case 400:
        return backendDetail || 'Future month analysis is not available.'
      case 404:
        return backendDetail || 'Monthly finance data not found. Please log some expenses first.'
      case 502:
        return backendDetail || 'Unable to process the AI request. Please try again.'
      case 503:
        return backendDetail || 'AI service is temporarily unavailable. Please try again later.'
      case 500:
        return backendDetail || 'Something went wrong while processing your request. Please try again.'
      default:
        return backendDetail || 'Could not connect to the AI Coach service. Please try again later.'
    }
  }

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || chatMutation.isPending) return

    // 1. Immediately push User message
    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')

    // 2. Perform API request
    const now = new Date()
    try {
      const response = await chatMutation.mutateAsync({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        question: trimmed
      })

      // 3. Push AI response
      setMessages((prev) => [...prev, { role: 'assistant', content: response.response }])
    } catch (error: any) {
      // 4. Handle error elegantly inside conversation history
      const errorMsg = getErrorMessage(error)
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader 
        title="AI Mentor Coach" 
        subtitle="Get instant personalized financial feedback and budget optimization tips."
      />

      <div className="grid gap-6 md:grid-cols-3 items-start">
        
        {/* Left Column: Chat Console */}
        <Card className="md:col-span-2 p-4 md:p-6 flex flex-col h-[520px] justify-between border border-slate-100 bg-white hover:shadow-md transition-shadow relative">
          
          {/* Scrollable Conversation Box */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-200"
          >
            {messages.map((msg, index) => {
              const isAI = msg.role === 'assistant'
              return (
                <div 
                  key={index}
                  className={`flex gap-3 animate-fade-in ${!isAI ? 'flex-row-reverse' : ''}`}
                >
                  {/* User/AI avatar indicators */}
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold shrink-0 select-none ${
                    isAI 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-accent/10 text-accent border border-accent/20'
                  }`}>
                    {isAI ? 'AI' : userName.substring(0, 2).toUpperCase()}
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl max-w-[80%] leading-relaxed text-sm ${
                    isAI 
                      ? 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-xs' 
                      : 'bg-primary text-white rounded-tr-xs shadow-sm shadow-primary/10'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              )
            })}

            {/* Subtle loading typing indicator */}
            {chatMutation.isPending && (
              <div className="flex gap-3 animate-pulse">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-semibold shrink-0 border border-primary/20">
                  AI
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-xs border border-slate-100 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1 text-[11px] font-medium tracking-wide">AI Coach is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input form area */}
          <form 
            onSubmit={handleSubmit}
            className="mt-4 pt-4 border-t border-slate-100 flex gap-2 items-center"
          >
            <Input 
              ref={inputRef}
              placeholder={chatMutation.isPending ? "AI is analyzing..." : "Ask me anything (e.g. 'How can I save $500 this month?')"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={chatMutation.isPending}
              className="flex-1 text-sm rounded-xl py-2 px-3 focus:ring-1 focus:ring-primary/20"
            />
            <Button 
              type="submit"
              variant="primary"
              disabled={chatMutation.isPending || !inputValue.trim()}
              className="shrink-0 rounded-xl px-4 py-2 cursor-pointer h-10 flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

        </Card>

        {/* Right Column: Suggested Prompt Cards */}
        <div className="space-y-4">
          <Card className="p-5 md:p-6 border border-slate-100 bg-white">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              Suggested Prompts
            </h3>
            
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(promptText)}
                  disabled={chatMutation.isPending}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all duration-200 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-start gap-2.5 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                  <span className="leading-normal">"{promptText}"</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default AICoach
