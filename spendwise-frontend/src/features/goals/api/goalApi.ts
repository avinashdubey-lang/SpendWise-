import api from '@/lib/axios'

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  priority?: number
  isPriority?: boolean
}

export async function getGoals(): Promise<Goal[]> {
  const response = await api.get('/goals')
  const rawData = response.data
  const items = Array.isArray(rawData) ? rawData : rawData?.items || rawData?.goals || []

  return items.map((item: any) => ({
    id: String(item.id || item._id || Math.random()),
    name: String(item.name || item.title || 'Savings Goal'),
    targetAmount: Number(item.targetAmount ?? item.target_amount ?? item.target ?? 0),
    currentAmount: Number(item.currentAmount ?? item.current_amount ?? item.current ?? item.saved_amount ?? 0),
    deadline: item.deadline || item.due_date || item.target_date || item.targetDate,
    priority: Number(item.priority ?? 0),
    isPriority: Boolean(item.isPriority ?? item.is_priority ?? false),
  }))
}

export async function getTopGoal(): Promise<Goal | null> {
  try {
    const goals = await getGoals()
    if (!goals || goals.length === 0) return null
    
    // Sort by priority (descending) or return first goal if non-zero, otherwise first element
    const sorted = [...goals].sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1
      if (!a.isPriority && b.isPriority) return 1
      return (b.priority || 0) - (a.priority || 0)
    })
    return sorted[0] || null
  } catch (error) {
    try {
      const response = await api.get('/goals/top')
      const item = response.data
      if (!item) return null
      return {
        id: String(item.id || 'top-goal'),
        name: String(item.name || item.title || 'Top Goal'),
        targetAmount: Number(item.targetAmount ?? item.target_amount ?? 0),
        currentAmount: Number(item.currentAmount ?? item.current_amount ?? 0),
        deadline: item.deadline || item.due_date || item.target_date,
      }
    } catch {
      throw error
    }
  }
}
