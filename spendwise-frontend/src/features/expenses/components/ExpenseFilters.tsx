import React from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Filter, RotateCcw } from 'lucide-react'
import { ExpenseFilterParams } from '../api/expenseApi'

interface ExpenseFiltersProps {
  filters: ExpenseFilterParams
  onChange: (newFilters: ExpenseFilterParams) => void
  onReset: () => void
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Food', label: 'Food' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Transport', label: 'Transport' },
  { value: 'General', label: 'General' },
]

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const hasActiveFilters = 
    (filters.category && filters.category !== 'all') || 
    Boolean(filters.startDate) || 
    Boolean(filters.endDate)

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-800">Filter Expenses</h3>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Reset Filters
          </Button>
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 items-end">
        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Category
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <Input
          label="Start Date"
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
        />

        {/* End Date */}
        <Input
          label="End Date"
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
        />
      </div>
    </Card>
  )
}

export default ExpenseFilters
