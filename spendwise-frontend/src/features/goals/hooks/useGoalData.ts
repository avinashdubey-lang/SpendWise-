import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal, 
  CreateGoalPayload, 
  UpdateGoalPayload,
  updateGoalPriority
} from '../api/goalApi'

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => createGoal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateGoalPayload
    }) => {
      // Update goal details
      const goal = await updateGoal(id, payload)

      // Reorder only if a priority was supplied
      if (payload.priority !== undefined) {
        await updateGoalPriority(id, payload.priority)
      }

      return goal
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
