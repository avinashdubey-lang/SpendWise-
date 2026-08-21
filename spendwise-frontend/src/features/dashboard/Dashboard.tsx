import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { 
  useDashboardSummary, 
  useTopGoal, 
  useRecentExpenses, 
  useSpendingByCategory 
} from './hooks/useDashboardData'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatCard from '@/components/common/StatCard'
import EmptyState from '@/components/feedback/EmptyState'
import LoadingState from '@/components/feedback/LoadingState'
import ErrorState from '@/components/feedback/ErrorState'
import { formatCurrency } from '@/lib/utils'

import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Receipt, 
  Film, 
  CreditCard,
  Target,
  TrendingUp,
  Calendar,
  Wallet,
  PiggyBank,
  PieChart,
  Landmark,
  CheckCircle2
} from 'lucide-react'

import { useCurrentBudget } from '@/features/budget/hooks/useBudgetData'
import BudgetModal from '@/features/budget/components/BudgetModal'
import SpendingInsights from '@/features/insights/components/SpendingInsights'

import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts'

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#3B82F6',         // Blue
  Travel: '#10B981',       // Emerald
  Shopping: '#F59E0B',     // Amber
  Bills: '#EF4444',        // Red
  Entertainment: '#8B5CF6', // Purple
  Transport: '#06B6D4',    // Cyan
  General: '#6B7280',      // Gray
  Unknown: '#94A3B8',      // Slate
  Other: '#94A3B8',
  Others: '#94A3B8',
}

const DEFAULT_SLOT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#6B7280', '#94A3B8']



function getCategoryIcon(category: string) {
  const c = category.toLowerCase()
  if (c.includes('food') || c.includes('dining') || c.includes('restaurant') || c.includes('swiggy')) return <Utensils className="h-4 w-4" />
  if (c.includes('transport') || c.includes('travel') || c.includes('cab') || c.includes('uber')) return <Car className="h-4 w-4" />
  if (c.includes('shop') || c.includes('apparel') || c.includes('amazon')) return <ShoppingBag className="h-4 w-4" />
  if (c.includes('bill') || c.includes('utility') || c.includes('rent') || c.includes('electricity')) return <Receipt className="h-4 w-4" />
  if (c.includes('entertain') || c.includes('movie') || c.includes('netflix')) return <Film className="h-4 w-4" />
  return <CreditCard className="h-4 w-4" />
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
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

function getGreeting(name?: string) {
  const hour = new Date().getHours()
  let timeGreeting = 'Good Morning'
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good Afternoon'
  } else if (hour >= 17) {
    timeGreeting = 'Good Evening'
  }
  const userName = name ? name.split(' ')[0] : 'User'
  return `${timeGreeting}, ${userName} 👋`
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null)
  
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleShowToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Queries
  // Queries
  const budgetQuery = useCurrentBudget()
  const budgetData = budgetQuery.data
  const hasBudget = budgetData !== null && budgetData !== undefined && budgetData.monthlyAllowance > 0

  const currentMonthName = budgetData?.month || new Date().toLocaleString('en-IN', { month: 'long' })
  const currentYear = budgetData?.year || new Date().getFullYear()
  const currentMonthNumber = budgetData?.month 
    ? (new Date(Date.parse(`${budgetData.month} 1, 2012`)).getMonth() + 1) || (new Date().getMonth() + 1)
    : new Date().getMonth() + 1

  const summaryQuery = useDashboardSummary(currentMonthNumber, currentYear)
  const topGoalQuery = useTopGoal()
  const recentExpensesQuery = useRecentExpenses()
  const categoryQuery = useSpendingByCategory()

  const greetingText = getGreeting(user?.name)

  const totalSpentSum = categoryQuery.data ? categoryQuery.data.reduce((sum, item) => sum + item.totalSpent, 0) : 0

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-white">{toastMessage}</p>
            <p className="text-[11px] text-slate-400">Dashboard allowance and savings targets synchronized.</p>
          </div>
        </div>
      )}

      {/* 1. Greeting Section */}
      <div className="pb-6 border-b border-slate-200/60">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          {greetingText}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Here's your financial summary for this month.
        </p>
      </div>

      {/* Monthly Budget Card */}
      {budgetQuery.isLoading ? (
        <Card className="p-4 md:p-6 border border-slate-100">
          <LoadingState variant="skeleton" className="h-24" />
        </Card>
      ) : budgetQuery.isError ? (
        <Card className="p-4 md:p-6 border border-slate-100">
          <ErrorState
            title="Failed to load budget"
            message="Could not connect to monthly budget service."
            onRetry={() => budgetQuery.refetch()}
          />
        </Card>
      ) : !hasBudget ? (
        <Card className="p-4 md:p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
            <div className="space-y-2 text-center lg:text-left flex flex-col items-center lg:items-start justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                  <Landmark className="h-3 w-3" />
                </div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Monthly Budget</h2>
              </div>
              <p className="text-xs text-slate-500">You haven't set a budget for this month.</p>
            </div>
            <div className="w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
              <Button 
                variant="primary" 
                onClick={() => setIsBudgetModalOpen(true)}
                className="w-full lg:w-auto cursor-pointer py-3 lg:py-2 text-xs font-semibold"
              >
                Set Monthly Budget
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 md:p-6 border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
            
            <div className="space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start justify-center lg:justify-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                    <Landmark className="h-3 w-3" />
                  </div>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Monthly Budget</h2>
                </div>
                <p className="text-xs text-slate-500">Manage your spending limit for this month.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2">
                <span className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                  {formatCurrency(budgetData!.monthlyAllowance)}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  {currentMonthName} {currentYear}
                </span>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
              <Button 
                variant="outline" 
                onClick={() => setIsBudgetModalOpen(true)}
                className="w-full lg:w-auto cursor-pointer py-3 lg:py-2 text-xs font-semibold"
              >
                Update Budget
              </Button>
            </div>

          </div>
        </Card>
      )}

      {/* 2. Summary Cards (4 Cards) */}
      <section className="space-y-3">
        {summaryQuery.isLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <LoadingState variant="skeleton" className="h-28" />
            <LoadingState variant="skeleton" className="h-28" />
            <LoadingState variant="skeleton" className="h-28" />
            <LoadingState variant="skeleton" className="h-28" />
          </div>
        ) : summaryQuery.isError ? (
          <Card className="p-4">
            <ErrorState 
              title="Failed to load financial summary" 
              message="Could not connect to backend analytics. Please verify your connection."
              onRetry={() => summaryQuery.refetch()}
            />
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              label="Monthly Allowance" 
              value={formatCurrency(summaryQuery.data?.monthlyAllowance ?? 0)}
              icon={<Wallet className="h-4 w-4" />}
            />
            <StatCard 
              label="Total Spent" 
              value={formatCurrency(summaryQuery.data?.totalSpent ?? 0)}
              icon={<Receipt className="h-4 w-4" />}
              isNegativeTrend={true}
            />
            <StatCard 
              label="Remaining Balance" 
              value={formatCurrency(summaryQuery.data?.remainingBalance ?? 0)}
              icon={<PiggyBank className="h-4 w-4" />}
            />
            <StatCard 
              label="Savings Rate (%)" 
              value={`${summaryQuery.data?.savingsRate ?? 0}%`}
              trend={summaryQuery.data?.savingsRate}
              trendLabel="target savings"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
        )}
      </section>

      {/* Spending Insights Section */}
      <SpendingInsights month={currentMonthNumber} year={currentYear} />

      {/* Grid wrapper for responsive desktop/tablet arrangement of Sections 3-6 */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* LEFT COLUMN: Section 3 & Section 4 */}
        <div className="space-y-6">
          
          {/* 3. Top Financial Goal */}
          <section>
            <Card className="p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Top Financial Goal</h2>
                    <p className="text-xs text-slate-400">Your highest priority milestone</p>
                  </div>
                </div>
              </div>

              {topGoalQuery.isLoading ? (
                <LoadingState variant="inline" text="Fetching top goal..." />
              ) : topGoalQuery.isError ? (
                <ErrorState 
                  message="Could not load financial goals."
                  onRetry={() => topGoalQuery.refetch()}
                />
              ) : !topGoalQuery.data ? (
                <EmptyState 
                  icon={<Target className="h-8 w-8 text-slate-300" />}
                  title="No financial goals created"
                  description="Set up your first milestone target to start tracking progress."
                  action={
                    <Button variant="primary" size="sm" onClick={() => navigate('/goals')}>
                      + Create Goal
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const goal = topGoalQuery.data
                    const progressPercent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) || 0
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-800">{goal.name}</h3>
                            {goal.deadline && (
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3" />
                                <span>Target: {formatDate(goal.deadline)}</span>
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                            <span>Saved: {formatCurrency(goal.currentAmount)}</span>
                            <span>Target: {formatCurrency(goal.targetAmount)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </Card>
          </section>

          {/* 4. Recent Expenses */}
          <section>
            <Card className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Recent Expenses</h2>
                  <p className="text-xs text-slate-400">Latest 5 transactions</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/expenses')}
                  className="cursor-pointer text-xs"
                >
                  View All
                </Button>
              </div>

              {recentExpensesQuery.isLoading ? (
                <LoadingState variant="inline" text="Loading recent expenses..." />
              ) : recentExpensesQuery.isError ? (
                <ErrorState 
                  message="Could not load expenses data."
                  onRetry={() => recentExpensesQuery.refetch()}
                />
              ) : !recentExpensesQuery.data || recentExpensesQuery.data.length === 0 ? (
                <EmptyState 
                  icon={<Receipt className="h-8 w-8 text-slate-300" />}
                  title="No expenses logged yet"
                  description="Start tracking your expenditures to build financial discipline."
                  action={
                    <Button variant="primary" size="sm" onClick={() => navigate('/expenses')}>
                      Log Expense
                    </Button>
                  }
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentExpensesQuery.data.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 group">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                          <p className="text-[11px] text-slate-400">{item.category} • {formatDate(item.date)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>

        </div>

        {/* RIGHT COLUMN: Section 5 & Section 6 */}
        <div className="space-y-6">

          {/* 5. Spending by Category - Animated Recharts Donut Chart */}
          <section>
            <Card className="p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <PieChart className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Spending by Category</h2>
                    <p className="text-xs text-slate-400">Category breakdown</p>
                  </div>
                </div>
              </div>

              {categoryQuery.isLoading ? (
                <LoadingState variant="skeleton" className="h-56" />
              ) : categoryQuery.isError ? (
                <ErrorState 
                  message="Could not load category spending."
                  onRetry={() => categoryQuery.refetch()}
                />
              ) : !categoryQuery.data || categoryQuery.data.length === 0 ? (
                <EmptyState 
                  title="No expenses this month."
                  description="Category insights will appear as transactions are recorded."
                />
              ) : (
                <div className="space-y-4">
                  {/* Donut Chart with Centered Total */}
                  <div className="relative h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryQuery.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="totalSpent"
                          nameKey="category"
                          stroke="#ffffff"
                          strokeWidth={2}
                          isAnimationActive={true}
                          onMouseEnter={(_, index) => setActivePieIndex(index)}
                          onMouseLeave={() => setActivePieIndex(null)}
                        >
                          {categoryQuery.data.map((entry, index) => {
                            const color = CATEGORY_COLORS[entry.category] || DEFAULT_SLOT_COLORS[index % DEFAULT_SLOT_COLORS.length]
                            const isHovered = activePieIndex === index
                            return (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={color}
                                style={{
                                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                  transformOrigin: 'center center',
                                  transition: 'transform 0.2s ease-in-out',
                                  cursor: 'pointer'
                                }}
                              />
                            )
                          })}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>

                    {/* Centered Total and Hover Info */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                      {activePieIndex !== null && categoryQuery.data[activePieIndex] ? (
                        <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                          <span className="text-[11px] font-bold text-slate-400">
                            {formatCurrency(totalSpentSum)}
                          </span>
                          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">
                            Total Spent
                          </span>
                          <div className="w-8 h-px bg-slate-100 my-1" />
                          <span className="text-sm font-extrabold text-slate-800 tracking-tight">
                            {formatCurrency(categoryQuery.data[activePieIndex].totalSpent)}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-500 truncate max-w-[90px] block mt-0.5">
                            {categoryQuery.data[activePieIndex].category} ({categoryQuery.data[activePieIndex].percentage}%)
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <span className="text-lg font-extrabold text-slate-800 tracking-tight">
                            {formatCurrency(totalSpentSum)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            Total Spent
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visually Aligned Legend List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
                    {categoryQuery.data.map((cat, idx) => {
                      const color = CATEGORY_COLORS[cat.category] || DEFAULT_SLOT_COLORS[idx % DEFAULT_SLOT_COLORS.length]
                      return (
                        <div 
                          key={cat.category} 
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
                            <span className="font-semibold text-slate-700 truncate">{cat.category}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-slate-800">{formatCurrency(cat.totalSpent)}</span>
                            <span className="text-slate-400 text-[10px] font-medium min-w-[28px] text-right">{cat.percentage}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </Card>
          </section>
        </div>

      </div>

      {/* Update Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentAllowance={budgetData?.monthlyAllowance ?? 0}
        onSuccess={handleShowToast}
      />

    </div>
  )
}

export default Dashboard
