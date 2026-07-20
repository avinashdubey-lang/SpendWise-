import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { X, Plus, DollarSign, Calendar, Tag, FileText } from 'lucide-react'
import { useCreateExpense } from '../hooks/useExpenseData'

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Transport',
  'General',
]

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState<{ amount?: string; description?: string; category?: string; date?: string; general?: string }>({})

  const createExpenseMutation = useCreateExpense()

  if (!isOpen) return null

  const handleValidation = () => {
    const newErrors: typeof errors = {}
    const parsedAmount = parseFloat(amount)

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!category.trim()) {
      newErrors.category = 'Category is required'
    }
    if (!date) {
      newErrors.date = 'Expense date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!handleValidation()) return

    createExpenseMutation.mutate(
      {
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        date,
      },
      {
        onSuccess: () => {
          setAmount('')
          setDescription('')
          setCategory('Food')
          setDate(new Date().toISOString().split('T')[0])
          setErrors({})
          onSuccess()
          onClose()
        },
        onError: (err: any) => {
          setErrors({
            general: err.response?.data?.message || err.response?.data?.detail || 'Failed to add expense. Please try again.',
          })
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl relative border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Add New Expense</h2>
              <p className="text-xs text-slate-500">Record a new transaction</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* General Error Banner */}
        {errors.general && (
          <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-xs font-semibold text-danger">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />

          {/* Description */}
          <Input
            label="Description"
            type="text"
            placeholder="e.g. Swiggy Lunch, Uber Trip"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
          />

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-danger font-medium leading-none mt-1">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <Input
            label="Expense Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
          />

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={createExpenseMutation.isPending}
            >
              Add Expense
            </Button>
          </div>
        </form>

      </Card>
    </div>
  )
}

export default AddExpenseModal
