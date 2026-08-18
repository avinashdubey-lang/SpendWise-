import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '../api/dashboardApi'
import { getTopGoal } from '@/features/goals/api/goalApi'
import { getRecentExpenses, getSpendingByCategory } from '@/features/expenses/api/expenseApi'

export function useDashboardSummary(month?: number, year?: number) {
  return useQuery({
    queryKey: ['dashboard', 'summary', month, year],
    queryFn: () => getDashboardSummary(month, year),
  })
}

export function useTopGoal() {
  return useQuery({
    queryKey: ['goals', 'top'],
    queryFn: getTopGoal,
  })
}

export function useRecentExpenses() {
  return useQuery({
    queryKey: ['expenses', 'recent'],
    queryFn: () => getRecentExpenses(5),
  })
}

export function useSpendingByCategory() {
  return useQuery({
    queryKey: ['expenses', 'by-category'],
    queryFn: getSpendingByCategory,
  })
}
