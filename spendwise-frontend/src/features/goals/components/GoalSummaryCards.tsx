import React from 'react'
import StatCard from '@/components/common/StatCard'
import { Goal } from '../api/goalApi'
import { formatCurrency } from '@/lib/utils'
import { Target, CheckCircle2, DollarSign } from 'lucide-react'

interface GoalSummaryCardsProps {
  goals: Goal[]
}

export const GoalSummaryCards: React.FC<GoalSummaryCardsProps> = ({ goals }) => {
  const totalGoals = goals.length
  const completedGoals = goals.filter(
    (g) => g.status === 'Completed' || (g.targetAmount > 0 && g.currentAmount >= g.targetAmount)
  ).length
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0)

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      <StatCard
        label="Total Goals"
        value={totalGoals}
        icon={<Target className="h-4 w-4" />}
      />
      <StatCard
        label="Completed Goals"
        value={completedGoals}
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      />
      <StatCard
        label="Total Target Amount"
        value={formatCurrency(totalTargetAmount)}
        icon={<DollarSign className="h-4 w-4" />}
      />
    </div>
  )
}

export default GoalSummaryCards
