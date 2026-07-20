import React from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Expense } from '../api/expenseApi'
import { formatCurrency } from '@/lib/utils'
import { Utensils, Car, ShoppingBag, Receipt, Film, CreditCard, Calendar } from 'lucide-react'

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
  return (
    <Card className="p-6 overflow-hidden">
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
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-1.5" />
                  <span className="text-[11px] text-slate-500 font-semibold">Recorded</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default ExpenseTable
