import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Expense } from '../api/expenseApi'
import { formatCurrency } from '@/lib/utils'
import { Utensils, Car, ShoppingBag, Receipt, Film, CreditCard, Calendar, Trash2 } from 'lucide-react'
import { useDeleteExpense } from '../hooks/useExpenseData'

interface ExpenseTableProps {
  expenses: Expense[]
}

function getCategoryIcon(category: string) {
  const c = category.toLowerCase()
  if (c.includes('food') || c.includes('dining') || c.includes('restaurant') || c.includes('swiggy')) return <Utensils className="h-4 w-4" />
  if (c.includes('transport') || c.includes('travel') || c.includes('cab') || c.includes('uber')) return <Car className="h-4 w-4" />
  if (c.includes('shop') || c.includes('amazon') || c.includes('apparel')) return <ShoppingBag className="h-4 w-4" />
  if (c.includes('bill') || c.includes('utility') || c.includes('rent') || c.includes('electricity')) return <Receipt className="h-4 w-4" />
  if (c.includes('entertain') || c.includes('movie') || c.includes('netflix')) return <Film className="h-4 w-4" />
  return <CreditCard className="h-4 w-4" />
}

function getCategoryBadgeVariant(category: string): 'primary' | 'secondary' | 'accent' | 'warning' | 'neutral' {
  const c = category.toLowerCase()
  if (c.includes('food')) return 'primary'
  if (c.includes('travel') || c.includes('transport')) return 'accent'
  if (c.includes('shop')) return 'secondary'
  if (c.includes('bill')) return 'warning'
  return 'neutral'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses }) => {
  const deleteMutation = useDeleteExpense()
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const isDeleting = deleteMutation.isPending

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return
    setDeleteError(null)
    try {
      await deleteMutation.mutateAsync(expenseToDelete.id)
      setExpenseToDelete(null)
    } catch (err: any) {
      setDeleteError(err.response?.data?.detail || err.response?.data?.message || 'Failed to delete expense.')
    }
  }

  return (
    <Card className="p-6 overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="pb-3 pl-2">Description</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Date</th>
              <th className="pb-3 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-slate-50/60 transition-colors group">
                {/* Description */}
                <td className="py-3.5 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <span className="font-bold text-slate-800">{expense.title}</span>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5">
                  <Badge variant={getCategoryBadgeVariant(expense.category)}>
                    {expense.category}
                  </Badge>
                </td>

                {/* Amount */}
                <td className="py-3.5 font-bold text-slate-800">
                  {formatCurrency(expense.amount)}
                </td>

                {/* Date */}
                <td className="py-3.5 text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 pr-2 text-right text-slate-400 font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Recorded</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpenseToDelete(expense)}
                      className="h-7 w-7 p-0 flex items-center justify-center text-slate-400 hover:text-danger hover:bg-danger/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                      title="Delete expense"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-sm p-6 relative border border-slate-100 shadow-2xl animate-scale-up text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">Delete Expense?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-normal font-sans">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{expenseToDelete.title}"</span>? This action cannot be undone.
              </p>
            </div>
            
            {deleteError && (
              <p className="text-xs font-semibold text-danger leading-normal">{deleteError}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full justify-center text-xs h-9 cursor-pointer"
                onClick={() => {
                  setExpenseToDelete(null)
                  setDeleteError(null)
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="w-full justify-center bg-danger hover:bg-danger-hover text-xs h-9 cursor-pointer"
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}

export default ExpenseTable
