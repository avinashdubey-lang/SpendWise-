import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Goal } from '../api/goalApi'
import { formatCurrency } from '@/lib/utils'
import { Target, Calendar, Flag, Edit3, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'No deadline'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function getStatusBadge(status?: Goal['status']) {
  switch (status) {
    case 'Completed':
      return <Badge variant="primary" className="bg-emerald-50 text-emerald-600 border-emerald-200">Completed</Badge>
    case 'Overdue':
      return <Badge variant="danger">Overdue</Badge>
    case 'Upcoming':
      return <Badge variant="warning">Upcoming</Badge>
    case 'In Progress':
    default:
      return <Badge variant="accent">In Progress</Badge>
  }
}

function getPriorityLabel(priority?: number) {
  if (priority === 3) return 'High Priority'
  if (priority === 2) return 'Medium Priority'
  return 'Low Priority'
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const progressPercent = Math.min(
    100,
    Math.round(((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100)
  )
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount)

  return (
    <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 border border-slate-100/90 relative group">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">{goal.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(goal.deadline)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {getStatusBadge(goal.status)}
          </div>
        </div>

        {/* Reason / Notes if available */}
        {goal.reason && (
          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 my-3 leading-relaxed">
            "{goal.reason}"
          </p>
        )}

        {/* Progress Bar & Amounts */}
        <div className="space-y-3 my-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Progress</span>
            <span className="font-extrabold text-primary">{progressPercent}%</span>
          </div>

          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Detailed Financial Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase">Saved</span>
              <span className="text-xs font-bold text-slate-800">{formatCurrency(goal.currentAmount)}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase">Target</span>
              <span className="text-xs font-bold text-slate-800">{formatCurrency(goal.targetAmount)}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase">Remaining</span>
              <span className="text-xs font-bold text-slate-800">{formatCurrency(remainingAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Flag className="h-3 w-3 text-amber-500" />
          {getPriorityLabel(goal.priority)}
        </span>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(goal)}
            className="h-8 px-2 text-slate-400 hover:text-slate-700"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowConfirmDelete(true)}
            className="h-8 px-2 text-slate-400 hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog Overlay for Delete */}
      {showConfirmDelete && (
        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-xs rounded-2xl p-6 flex flex-col justify-between items-center text-center animate-fade-in">
          <div className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-danger/10 text-danger mx-auto">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Delete Goal?</h4>
            <p className="text-xs text-slate-500 max-w-[200px]">
              Are you sure you want to delete "{goal.name}"?
            </p>
          </div>
          <div className="flex items-center gap-2 w-full pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowConfirmDelete(false)}
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => {
                setShowConfirmDelete(false)
                onDelete(goal.id)
              }}
              className="w-1/2"
            >
              Delete
            </Button>
          </div>
        </div>
      )}

    </Card>
  )
}

export default GoalCard
