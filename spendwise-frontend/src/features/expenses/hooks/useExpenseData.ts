import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getExpenses, 
  createExpense, 
  ExpenseFilterParams, 
  CreateExpensePayload 
} from '../api/expenseApi'

export function useExpenses(params?: ExpenseFilterParams) {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: () => getExpenses(params),
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => createExpense(payload),
    onSuccess: () => {
      // Invalidate TanStack Query caches so dashboard summary, categories, table update immediately
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}
