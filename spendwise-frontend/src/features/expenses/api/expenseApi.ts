import api from '@/lib/axios'

export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
}

export interface CategorySpending {
  category: string
  totalSpent: number
  percentage: number
}

export async function getRecentExpenses(limit = 5): Promise<Expense[]> {
  const response = await api.get('/expenses', { params: { limit } })
  const rawData = response.data
  const items = Array.isArray(rawData) ? rawData : rawData?.items || rawData?.expenses || []

  return items.slice(0, limit).map((item: any) => ({
    id: String(item.id || item._id || Math.random()),
    title: String(item.title || item.merchant || item.description || item.name || 'Expense'),
    amount: Number(item.amount ?? 0),
    category: String(item.category || item.category_name || 'General'),
    date: item.date || item.created_at || item.created_date || item.timestamp || new Date().toISOString(),
  }))
}

export async function getSpendingByCategory(): Promise<CategorySpending[]> {
  const response = await api.get('/dashboard/by-category')
  const rawData = response.data
  const items = Array.isArray(rawData) ? rawData : []

  return items.map((item: any) => ({
    category: String(item.category || 'Other'),
    totalSpent: Number(item.amount ?? 0),
    percentage: Number(item.percentage ?? 0),
  }))
}
