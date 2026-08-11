import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentBudget, updateBudget } from '../api/financeApi'

export function useCurrentBudget() {
  return useQuery({
    queryKey: ['budget', 'current'],
    queryFn: getCurrentBudget,
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (amount: number) => updateBudget(amount),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}