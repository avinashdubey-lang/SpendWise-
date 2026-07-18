import React, { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200/60 mb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  )
}

export default PageHeader
