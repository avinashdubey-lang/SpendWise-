import React from 'react'
import Card from '@/components/ui/Card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  trend?: number
  trendLabel?: string
  isNegativeTrend?: boolean // If true, treats positive values as bad (e.g. higher expenses) and negative as good
  icon?: React.ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendLabel,
  isNegativeTrend = false,
  icon,
}) => {
  const hasTrend = trend !== undefined
  
  // Decide color of trend
  // If trend is positive, it's good (green) UNLESS isNegativeTrend is true (then it's red)
  const isPositive = trend !== undefined && trend > 0
  const isGood = isPositive ? !isNegativeTrend : isNegativeTrend

  return (
    <Card className="p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      
      <div className="mt-4">
        <span className="text-2xl font-bold tracking-tight text-slate-800">{value}</span>
      </div>

      {hasTrend && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className={cn(
            "flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-lg border",
            isGood 
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
              : "bg-danger/10 text-danger border-danger/20"
          )}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3 shrink-0" />
            ) : (
              <TrendingDown className="h-3 w-3 shrink-0" />
            )}
            {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="text-slate-400 truncate">{trendLabel}</span>}
        </div>
      )}
    </Card>
  )
}

export default StatCard
