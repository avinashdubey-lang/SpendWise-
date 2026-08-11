import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { X, Landmark } from 'lucide-react'
import { useUpdateBudget } from '../hooks/useBudgetData'

interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
  currentAllowance: number
  onSuccess: (message: string) => void
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentAllowance,
  onSuccess,
}) => {
  const [budget, setBudget] = useState('')
  const [error, setError] = useState<string | null>(null)
  const updateBudgetMutation = useUpdateBudget()

  useEffect(() => {
    if (isOpen) {
      setBudget(currentAllowance > 0 ? String(currentAllowance) : '')
      setError(null)
    }
  }, [isOpen, currentAllowance])

  if (!isOpen) return null

  const handleValidation = () => {
    const parsed = parseFloat(budget)
    if (!budget.trim() || isNaN(parsed) || parsed <= 0) {
      setError('Monthly Budget must be a number greater than zero')
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!handleValidation()) return

    updateBudgetMutation.mutate(parseFloat(budget), {
      onSuccess: () => {
        onSuccess(currentAllowance > 0 ? 'Monthly budget updated successfully!' : 'Monthly budget set successfully!')
        onClose()
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to update monthly budget. Please try again.')
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <Card className="w-[calc(100vw-2rem)] md:w-full md:max-w-lg lg:max-w-md p-4 md:p-6 bg-white shadow-2xl rounded-2xl relative border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {currentAllowance > 0 ? 'Update Monthly Budget' : 'Set Monthly Budget'}
              </h2>
              <p className="text-xs text-slate-500">
                Define your allowance limit for this month
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Monthly Budget Allowance (₹)"
            type="number"
            step="1"
            placeholder="30000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            error={error || undefined}
          />

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto py-3 sm:py-2">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={updateBudgetMutation.isPending}
              className="w-full sm:w-auto py-3 sm:py-2"
            >
              Save Changes
            </Button>
          </div>
        </form>

      </Card>
    </div>
  )
}

export default BudgetModal
