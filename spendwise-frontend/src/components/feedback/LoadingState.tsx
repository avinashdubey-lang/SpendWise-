import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  variant?: 'page' | 'inline' | 'skeleton'
  text?: string
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'inline',
  text = 'Loading...',
  className,
}) => {
  if (variant === 'page') {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-surface gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn("animate-pulse space-y-3 w-full", className)}>
        <div className="h-4 bg-slate-200 rounded-2xl w-2/3" />
        <div className="h-4 bg-slate-200 rounded-2xl w-full" />
        <div className="h-4 bg-slate-200 rounded-2xl w-1/2" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 gap-3", className)}>
      <div className="h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      {text && <p className="text-xs font-semibold text-slate-500 tracking-wide">{text}</p>}
    </div>
  )
}

export default LoadingState
