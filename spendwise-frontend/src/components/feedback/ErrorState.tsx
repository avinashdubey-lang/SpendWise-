import React from 'react'
import { AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  retryText?: string
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Retry Request',
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto space-y-4", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger border border-danger/20">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 leading-normal">{message}</p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onRetry}>
            {retryText}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ErrorState
