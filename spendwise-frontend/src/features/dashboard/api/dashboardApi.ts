import api from '@/lib/axios'

export interface DashboardSummary {
  monthlyAllowance: number
  totalSpent: number
  remainingBalance: number
  savingsRate: number
}

export async function getDashboardSummary(month?: number, year?: number): Promise<DashboardSummary> {
  const m = month || new Date().getMonth() + 1
  const y = year || new Date().getFullYear()
  try {
    const response = await api.get(`/analysis/monthly?month=${m}&year=${y}`)
    const data = response.data || {}

    const monthlyAllowance = Number(data.available_money ?? 0)
    const totalSpent = Number(data.total_spending ?? 0)
    const remainingBalance = Number(data.remaining_money ?? (monthlyAllowance - totalSpent))
    const savingsRate = Math.max(0, Math.round(100 - Number(data.spending_percentage ?? 0)))

    return {
      monthlyAllowance,
      totalSpent,
      remainingBalance,
      savingsRate,
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        monthlyAllowance: 0,
        totalSpent: 0,
        remainingBalance: 0,
        savingsRate: 0,
      }
    }
    throw error
  }
}
