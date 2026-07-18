import React, { ReactNode } from 'react'
import { Landmark } from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-400">
        {icon || <Landmark className="h-8 w-8 text-slate-300" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 leading-normal">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
