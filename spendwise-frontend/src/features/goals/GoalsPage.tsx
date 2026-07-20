import React, { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/feedback/EmptyState'
import LoadingState from '@/components/feedback/LoadingState'
import ErrorState from '@/components/feedback/ErrorState'
import { Plus, Target, CheckCircle2 } from 'lucide-react'
import { useGoals, useDeleteGoal } from './hooks/useGoalData'
import { Goal } from './api/goalApi'
import GoalSummaryCards from './components/GoalSummaryCards'
import GoalCard from './components/GoalCard'
import GoalModal from './components/GoalModal'

export const GoalsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const goalsQuery = useGoals()
  const deleteGoalMutation = useDeleteGoal()

  const handleOpenCreateModal = () => {
    setGoalToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (goal: Goal) => {
    setGoalToEdit(goal)
    setIsModalOpen(true)
  }

  const handleShowToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleDeleteGoal = (goalId: string) => {
    deleteGoalMutation.mutate(goalId, {
      onSuccess: () => {
        handleShowToast('Financial goal deleted successfully.')
      },
      onError: (err: any) => {
        handleShowToast(err.response?.data?.message || 'Failed to delete financial goal.')
      },
    })
  }

  const hasGoals = goalsQuery.data && goalsQuery.data.length > 0

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-white">{toastMessage}</p>
            <p className="text-[11px] text-slate-400">Dashboard & goal metrics synchronized.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Financial Goals"
        subtitle="Set, track and prioritize your financial goals."
        action={
          <Button 
            variant="primary" 
            icon={<Plus className="h-4.5 w-4.5" />}
            onClick={handleOpenCreateModal}
            className="shadow-sm shadow-primary/20 hover:shadow-md cursor-pointer"
          >
            Create Goal
          </Button>
        }
      />

      {/* Summary Cards */}
      {goalsQuery.data && <GoalSummaryCards goals={goalsQuery.data} />}

      {/* Goals Grid / States */}
      {goalsQuery.isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <LoadingState variant="skeleton" className="h-56" />
          <LoadingState variant="skeleton" className="h-56" />
          <LoadingState variant="skeleton" className="h-56" />
        </div>
      ) : goalsQuery.isError ? (
        <Card className="p-6">
          <ErrorState
            title="Failed to load goals"
            message="Could not connect to backend goals service. Please check your network or try again."
            onRetry={() => goalsQuery.refetch()}
          />
        </Card>
      ) : !hasGoals ? (
        <Card className="p-6">
          <EmptyState
            icon={<Target className="h-10 w-10 text-slate-300" />}
            title="No financial goals yet."
            description="Create your first goal to start building better financial habits."
            action={
              <Button 
                variant="primary" 
                size="sm" 
                icon={<Plus className="h-4 w-4" />}
                onClick={handleOpenCreateModal}
              >
                Create Goal
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {goalsQuery.data!.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}

      {/* Goal Modal (Create & Edit) */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setGoalToEdit(null)
        }}
        goalToEdit={goalToEdit}
        onSuccess={handleShowToast}
      />

    </div>
  )
}

export default GoalsPage
