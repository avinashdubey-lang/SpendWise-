import api from '@/lib/axios'

export interface DashboardSummary {
  monthlyAllowance: number
  totalSpent: number
  remainingBalance: number
  savingsRate: number
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get('/dashboard/summary')
  const data = response.data || {}

  const monthlyAllowance = Number(data.monthlyAllowance ?? data.monthly_allowance ?? data.allowance ?? 0)
  const totalSpent = Number(data.totalSpent ?? data.total_spent ?? data.spent ?? 0)
  const remainingBalance = Number(data.remainingBalance ?? data.remaining_balance ?? data.remaining ?? (monthlyAllowance - totalSpent))
  
  let savingsRate = Number(data.savingsRate ?? data.savings_rate ?? 0)
  if (!savingsRate && monthlyAllowance > 0) {
    savingsRate = Math.max(0, Math.round(((monthlyAllowance - totalSpent) / monthlyAllowance) * 100))
  }

  return {
    monthlyAllowance,
    totalSpent,
    remainingBalance,
    savingsRate,
  }
}
