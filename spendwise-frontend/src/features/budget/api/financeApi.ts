import api from '@/lib/axios'

export interface Budget {
  id: string
  monthlyAllowance: number
  month: string
  year: number
}

export async function getCurrentBudget(): Promise<Budget | null> {
  try {
    const response = await api.get('/finances/current')
    const data = response.data

    if (!data) return null

    const monthVal = data.month

    let monthName = new Date().toLocaleString('en-IN', {
      month: 'long',
    })

    if (typeof monthVal === 'number') {
      monthName = new Date(
        data.year,
        monthVal - 1,
      ).toLocaleString('en-IN', {
        month: 'long',
      })
    }

    return {
      id: String(data.id),
      monthlyAllowance: Number(data.available_money),
      month: monthName,
      year: Number(data.year),
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }

    throw error
  }
}

export async function updateBudget(
  amount: number,
): Promise<Budget> {
  const now = new Date()

  const response = await api.put(
    '/finances/monthly',
    {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      available_money: amount,
    },
  )

  const data = response.data

  return {
    id: String(data.id),
    monthlyAllowance: Number(data.available_money),
    month: new Date(
      data.year,
      data.month - 1,
    ).toLocaleString('en-IN', {
      month: 'long',
    }),
    year: Number(data.year),
  }
}