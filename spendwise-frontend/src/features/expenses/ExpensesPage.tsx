import React, { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/feedback/EmptyState'
import LoadingState from '@/components/feedback/LoadingState'
import ErrorState from '@/components/feedback/ErrorState'
import { Plus, Receipt, CheckCircle2 } from 'lucide-react'
import { useExpenses } from './hooks/useExpenseData'
import { ExpenseFilterParams } from './api/expenseApi'
import ExpenseFilters from './components/ExpenseFilters'
import ExpenseTable from './components/ExpenseTable'
import AddExpenseModal from './components/AddExpenseModal'

export const ExpensesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [filters, setFilters] = useState<ExpenseFilterParams>({
    category: 'all',
    startDate: '',
    endDate: '',
  })

  // Data Query
  const expensesQuery = useExpenses(filters)

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      startDate: '',
      endDate: '',
    })
  }

  const handleModalSuccess = () => {
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 4000)
  }

  const hasExpenses = expensesQuery.data && expensesQuery.data.length > 0

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Toast Notification Banner */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-white">Expense Added!</p>
            <p className="text-[11px] text-slate-400">Dashboard & analytics cache updated.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Expenses"
        subtitle="Track and manage your daily expenses."
        action={
          <Button 
            variant="primary" 
            icon={<Plus className="h-4.5 w-4.5" />}
            onClick={() => setIsModalOpen(true)}
            className="shadow-sm shadow-primary/20 hover:shadow-md cursor-pointer"
          >
            Add Expense
          </Button>
        }
      />

      {/* Filters Card */}
      <ExpenseFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Main Expense Table / States */}
      {expensesQuery.isLoading ? (
        <Card className="p-6 space-y-4">
          <LoadingState variant="skeleton" className="h-12" />
          <LoadingState variant="skeleton" className="h-12" />
          <LoadingState variant="skeleton" className="h-12" />
        </Card>
      ) : expensesQuery.isError ? (
        <Card className="p-6">
          <ErrorState
            title="Failed to load expenses"
            message="Could not connect to backend expenses API. Please check your network or try again."
            onRetry={() => expensesQuery.refetch()}
          />
        </Card>
      ) : !hasExpenses ? (
        <Card className="p-6">
          <EmptyState
            icon={<Receipt className="h-10 w-10 text-slate-300" />}
            title="No expenses found"
            description="Add your first expense to start tracking your spending."
            action={
              <Button 
                variant="primary" 
                size="sm" 
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Add Expense
              </Button>
            }
          />
        </Card>
      ) : (
        <ExpenseTable expenses={expensesQuery.data!} />
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

    </div>
  )
}

export default ExpensesPage
