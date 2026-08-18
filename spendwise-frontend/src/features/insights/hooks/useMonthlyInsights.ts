import { useQuery } from '@tanstack/react-query'
import { getMonthlyInsights, MonthlyInsightsResponse } from '../api/insightsApi'

export function useMonthlyInsights(month: number, year: number) {
  return useQuery<MonthlyInsightsResponse>({
    queryKey: ['insights', 'monthly', month, year],
    queryFn: () => getMonthlyInsights(month, year),
  })
}
