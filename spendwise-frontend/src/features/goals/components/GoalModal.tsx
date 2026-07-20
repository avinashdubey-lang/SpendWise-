import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { X, Target, Flag, Calendar, AlignLeft, PiggyBank } from 'lucide-react'
import { Goal } from '../api/goalApi'
import { useCreateGoal, useUpdateGoal } from '../hooks/useGoalData'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  goalToEdit?: Goal | null
  onSuccess: (message: string) => void
}

const PRIORITY_OPTIONS = [
  { value: 3, label: 'High Priority (Priority 1)' },
  { value: 2, label: 'Medium Priority (Priority 2)' },
  { value: 1, label: 'Low Priority (Priority 3)' },
]

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
  onSuccess,
}) => {
  const isEditing = Boolean(goalToEdit)

  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [reason, setReason] = useState('')
  const [priority, setPriority] = useState<number>(2)

  const [errors, setErrors] = useState<{ 
    name?: string
    targetAmount?: string
    deadline?: string
    priority?: string
    general?: string 
  }>({})

  const createGoalMutation = useCreateGoal()
  const updateGoalMutation = useUpdateGoal()

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name || '')
      setTargetAmount(String(goalToEdit.targetAmount || ''))
      setCurrentAmount(String(goalToEdit.currentAmount || 0))
      setDeadline(goalToEdit.deadline ? goalToEdit.deadline.split('T')[0] : '')
      setReason(goalToEdit.reason || '')
      setPriority(goalToEdit.priority || 2)
    } else {
      setName('')
      setTargetAmount('')
      setCurrentAmount('0')
      setDeadline('')
      setReason('')
      setPriority(2)
    }
    setErrors({})
  }, [goalToEdit, isOpen])

  if (!isOpen) return null

  const handleValidation = () => {
    const newErrors: typeof errors = {}
    const parsedTarget = parseFloat(targetAmount)

    if (!name.trim()) {
      newErrors.name = 'Goal Name is required'
    }
    if (!targetAmount || isNaN(parsedTarget) || parsedTarget <= 0) {
      newErrors.targetAmount = 'Target Amount must be greater than 0'
    }
    if (!deadline) {
      newErrors.deadline = 'Deadline date is required'
    }
    if (!priority) {
      newErrors.priority = 'Priority selection is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!handleValidation()) return

    const parsedTarget = parseFloat(targetAmount)
    const parsedCurrent = parseFloat(currentAmount) || 0

    if (isEditing && goalToEdit) {
      updateGoalMutation.mutate(
        {
          id: goalToEdit.id,
          payload: {
            name: name.trim(),
            targetAmount: parsedTarget,
            currentAmount: parsedCurrent,
            deadline,
            reason: reason.trim() || undefined,
            priority: Number(priority),
          },
        },
        {
          onSuccess: () => {
            onSuccess('Financial goal updated successfully!')
            onClose()
          },
          onError: (err: any) => {
            setErrors({
              general: err.response?.data?.message || 'Failed to update financial goal.',
            })
          },
        }
      )
    } else {
      createGoalMutation.mutate(
        {
          name: name.trim(),
          targetAmount: parsedTarget,
          currentAmount: parsedCurrent,
          deadline,
          reason: reason.trim() || undefined,
          priority: Number(priority),
        },
        {
          onSuccess: () => {
            onSuccess('New financial goal created successfully!')
            onClose()
          },
          onError: (err: any) => {
            setErrors({
              general: err.response?.data?.message || 'Failed to create financial goal.',
            })
          },
        }
      )
    }
  }

  const isLoading = createGoalMutation.isPending || updateGoalMutation.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl relative border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isEditing ? 'Edit Financial Goal' : 'Create Financial Goal'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Update goal parameters' : 'Set a new savings milestone'}
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

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-xs font-semibold text-danger">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Name */}
          <Input
            label="Goal Name"
            placeholder="e.g. Emergency Fund, MacBook Pro, Trip to Japan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          {/* Target Amount & Current Saved */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Amount (₹)"
              type="number"
              step="1"
              placeholder="50000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              error={errors.targetAmount}
            />
            <Input
              label="Currently Saved (₹)"
              type="number"
              step="1"
              placeholder="0"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>

          {/* Deadline */}
          <Input
            label="Target Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            error={errors.deadline}
          />

          {/* Priority Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Reason / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Why is this goal important to you?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={isLoading}
            >
              {isEditing ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>

      </Card>
    </div>
  )
}

export default GoalModal
