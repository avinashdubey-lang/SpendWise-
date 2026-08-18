import api from '@/lib/axios'

export interface Insight {
  priority: string
  title: string
  message: string
}

export interface MonthlyInsightsResponse {
  insights: Insight[]
}

export async function getMonthlyInsights(month: number, year: number): Promise<MonthlyInsightsResponse> {
  const response = await api.get(`/insights/monthly?month=${month}&year=${year}`)
  return response.data
}
