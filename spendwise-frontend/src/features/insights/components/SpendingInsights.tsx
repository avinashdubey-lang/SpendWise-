import React from 'react'
import Card from '@/components/ui/Card'
import LoadingState from '@/components/feedback/LoadingState'
import { useMonthlyInsights } from '../hooks/useMonthlyInsights'
import { Lightbulb, AlertTriangle, Sparkles, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpendingInsightsProps {
  month: number
  year: number
}

const getPriorityStyles = (priority: string) => {
  const normalized = (priority || '').toLowerCase().trim()
  if (normalized === 'high') {
    return {
      border: 'border-l-4 border-l-rose-500',
      iconColor: 'text-rose-500',
    }
  }
  if (normalized === 'medium') {
    return {
      border: 'border-l-4 border-l-amber-500',
      iconColor: 'text-amber-500',
    }
  }
  return {
    border: 'border-l-4 border-l-slate-400',
    iconColor: 'text-slate-500',
  }
}

const getPriorityIcon = (priority: string) => {
  const normalized = (priority || '').toLowerCase().trim()
  if (normalized === 'high') {
    return <AlertTriangle className="h-4.5 w-4.5" />
  }
  if (normalized === 'medium') {
    return <Sparkles className="h-4.5 w-4.5" />
  }
  return <Info className="h-4.5 w-4.5" />
}

export const SpendingInsights: React.FC<SpendingInsightsProps> = ({ month, year }) => {
  const { data, isLoading, isError } = useMonthlyInsights(month, year)

  const insights = data?.insights || []
  // Show max 4 insights
  const visibleInsights = insights.slice(0, 4)

  return (
    <Card className="p-5 md:p-6 border border-slate-100 hover:shadow-md transition-shadow">
      
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Lightbulb className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">Spending Insights</h2>
          <p className="text-xs text-slate-400">Personalized analytics and observations for this month</p>
        </div>
      </div>

      {/* Render states */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <LoadingState variant="skeleton" className="p-4" />
          <LoadingState variant="skeleton" className="p-4" />
        </div>
      ) : isError ? (
        <div className="text-center py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-100/60">
          <p className="text-xs font-semibold text-slate-500">Insights are temporarily unavailable.</p>
        </div>
      ) : visibleInsights.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-100/60">
          <p className="text-xs font-semibold text-slate-500">
            Add a few expenses to start seeing personalized spending insights.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {visibleInsights.map((insight, idx) => {
            const styles = getPriorityStyles(insight.priority)
            return (
              <div 
                key={idx}
                className={cn(
                  "p-4 rounded-xl flex items-start gap-3 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors animate-fade-in",
                  styles.border
                )}
              >
                <div className={cn("mt-0.5 shrink-0 select-none", styles.iconColor)}>
                  {getPriorityIcon(insight.priority)}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug tracking-tight">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed break-words">
                    {insight.message}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </Card>
  )
}

export default SpendingInsights
