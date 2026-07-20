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

export interface ExpenseFilterParams {
  category?: string
  startDate?: string
  endDate?: string
}

export interface CreateExpensePayload {
  amount: number
  description: string
  category: string
  date: string
}

export async function getRecentExpenses(limit = 5): Promise<Expense[]> {
  const response = await api.get('/expenses', { params: { limit } })
  const rawData = response.data
  const items = Array.isArray(rawData) ? rawData : rawData?.items || rawData?.expenses || []

  return items.slice(0, limit).map((item: any) => ({
    id: String(item.id || item._id || Math.random()),
    title: String(item.title || item.description || item.merchant || item.name || 'Expense'),
    amount: Number(item.amount ?? 0),
    category: String(item.category || item.category_name || 'General'),
    date: item.expense_date || item.date || item.created_at || item.created_date || item.timestamp || new Date().toISOString(),
  }))
}

export async function getExpenses(params?: ExpenseFilterParams): Promise<Expense[]> {
  const queryParams: Record<string, any> = {}
  if (params?.category && params.category !== 'all') {
    queryParams.category = params.category
  }
  if (params?.startDate) {
    queryParams.startDate = params.startDate
    queryParams.start_date = params.startDate
  }
  if (params?.endDate) {
    queryParams.endDate = params.endDate
    queryParams.end_date = params.endDate
  }

  const response = await api.get('/expenses', { params: queryParams })
  const rawData = response.data
  const items = Array.isArray(rawData) ? rawData : rawData?.items || rawData?.expenses || []

  const mapped = items.map((item: any) => ({
    id: String(item.id || item._id || Math.random()),
    title: String(item.title || item.description || item.merchant || item.name || 'Expense'),
    amount: Number(item.amount ?? 0),
    category: String(item.category || item.category_name || 'General'),
    date: item.expense_date || item.date || item.created_at || item.created_date || item.timestamp || new Date().toISOString(),
  }))

  return mapped.sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime())
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

export async function createExpense(payload: CreateExpensePayload): Promise<Expense> {
  const response = await api.post('/expenses', {
    amount: payload.amount,
    description: payload.description,
    category: payload.category,
    expense_date: payload.date,
    date: payload.date,
    title: payload.description,
  })
  return response.data
}
