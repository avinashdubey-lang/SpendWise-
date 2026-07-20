import api from '@/lib/axios'

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  reason?: string
  priority?: number
  isPriority?: boolean
  status?: 'Completed' | 'In Progress' | 'Upcoming' | 'Overdue'
}

export interface CreateGoalPayload {
  name: string
  targetAmount: number
  currentAmount?: number
  deadline: string
  reason?: string
  priority: number
}

export interface UpdateGoalPayload {
  name?: string
  targetAmount?: number
  currentAmount?: number
  deadline?: string
  reason?: string
  priority?: number
}

function computeGoalStatus(item: any, current: number, target: number, deadline?: string): 'Completed' | 'In Progress' | 'Upcoming' | 'Overdue' {
  if (item.status) return item.status
  if (target > 0 && current >= target) return 'Completed'
  if (deadline) {
    const dueDate = new Date(deadline).getTime()
    const now = new Date().getTime()
    if (!isNaN(dueDate) && dueDate < now) {
      return 'Overdue'
    }
  }
  return 'In Progress'
}

export async function getGoals(): Promise<Goal[]> {
  const response = await api.get('/goals')
  const rawData = response.data
  const items = Array.isArray(rawData) ? rawData : rawData?.items || rawData?.goals || []

  return items.map((item: any) => {
    const targetAmount = Number(item.targetAmount ?? item.target_amount ?? item.target ?? 0)
    const currentAmount = Number(item.currentAmount ?? item.current_amount ?? item.current ?? item.saved_amount ?? 0)
    const deadline = item.deadline || item.due_date || item.target_date || item.targetDate

    return {
      id: String(item.id || item._id || Math.random()),
      name: String(item.name || item.title || 'Savings Goal'),
      targetAmount,
      currentAmount,
      deadline,
      reason: item.reason || item.description || item.notes,
      priority: Number(item.priority ?? 0),
      isPriority: Boolean(item.isPriority ?? item.is_priority ?? false),
      status: computeGoalStatus(item, currentAmount, targetAmount, deadline),
    }
  })
}

export async function getTopGoal(): Promise<Goal | null> {
  try {
    const goals = await getGoals()
    if (!goals || goals.length === 0) return null
    
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
      const targetAmount = Number(item.targetAmount ?? item.target_amount ?? 0)
      const currentAmount = Number(item.currentAmount ?? item.current_amount ?? 0)
      const deadline = item.deadline || item.due_date || item.target_date

      return {
        id: String(item.id || 'top-goal'),
        name: String(item.name || item.title || 'Top Goal'),
        targetAmount,
        currentAmount,
        deadline,
        reason: item.reason || item.description,
        status: computeGoalStatus(item, currentAmount, targetAmount, deadline),
      }
    } catch {
      throw error
    }
  }
}

export async function createGoal(payload: CreateGoalPayload): Promise<Goal> {
  const response = await api.post('/goals', {
    name: payload.name,
    title: payload.name,
    target_amount: payload.targetAmount,
    targetAmount: payload.targetAmount,
    current_amount: payload.currentAmount ?? 0,
    currentAmount: payload.currentAmount ?? 0,
    deadline: payload.deadline,
    target_date: payload.deadline,
    reason: payload.reason,
    description: payload.reason,
    priority: payload.priority,
  })
  return response.data
}

export async function updateGoal(id: string, payload: UpdateGoalPayload): Promise<Goal> {
  const response = await api.put(`/goals/${id}`, {
    name: payload.name,
    title: payload.name,
    target_amount: payload.targetAmount,
    targetAmount: payload.targetAmount,
    current_amount: payload.currentAmount,
    currentAmount: payload.currentAmount,
    deadline: payload.deadline,
    target_date: payload.deadline,
    reason: payload.reason,
    description: payload.reason,
    priority: payload.priority,
  })
  return response.data
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(`/goals/${id}`)
}
