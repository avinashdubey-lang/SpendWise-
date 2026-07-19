import React from 'react'
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
import Badge from '@/components/ui/Badge'
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
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
  Wallet,
  PiggyBank,
  PieChart
} from 'lucide-react'

function getCategoryIcon(category: string) {
  const c = category.toLowerCase()
  if (c.includes('food') || c.includes('dining') || c.includes('restaurant') || c.includes('swiggy')) return <Utensils className="h-4 w-4" />
  if (c.includes('transport') || c.includes('cab') || c.includes('travel') || c.includes('uber') || c.includes('fuel')) return <Car className="h-4 w-4" />
  if (c.includes('shop') || c.includes('apparel') || c.includes('amazon') || c.includes('store')) return <ShoppingBag className="h-4 w-4" />
  if (c.includes('bill') || c.includes('utility') || c.includes('rent') || c.includes('electricity')) return <Receipt className="h-4 w-4" />
  if (c.includes('entertain') || c.includes('movie') || c.includes('netflix') || c.includes('ott')) return <Film className="h-4 w-4" />
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

  // Queries
  const summaryQuery = useDashboardSummary()
  const topGoalQuery = useTopGoal()
  const recentExpensesQuery = useRecentExpenses()
  const categoryQuery = useSpendingByCategory()

  const greetingText = getGreeting(user?.name)

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* 1. Greeting Section */}
      <div className="pb-6 border-b border-slate-200/60">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          {greetingText}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Here's your financial summary for this month.
        </p>
      </div>

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

          {/* 5. Spending by Category */}
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
                <LoadingState variant="inline" text="Fetching category breakdown..." />
              ) : categoryQuery.isError ? (
                <ErrorState 
                  message="Could not load category spending."
                  onRetry={() => categoryQuery.refetch()}
                />
              ) : !categoryQuery.data || categoryQuery.data.length === 0 ? (
                <EmptyState 
                  title="No category spending data"
                  description="Category insights will populate as transactions are recorded."
                />
              ) : (
                <div className="space-y-4">
                  {categoryQuery.data.map((cat) => (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700">{cat.category}</span>
                        <div className="text-right">
                          <span className="text-slate-800">{formatCurrency(cat.totalSpent)}</span>
                          <span className="text-slate-400 ml-2">({cat.percentage}%)</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, cat.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>

          {/* 6. AI Coach Card */}
          <section>
            <Card className="p-6 border border-slate-200 bg-slate-50/50 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <h2 className="text-base font-bold text-slate-800">AI Coach</h2>
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                  Coming Soon
                </Badge>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Personalized financial insights will appear here after the Financial Analysis Engine is completed.
              </p>
            </Card>
          </section>

        </div>

      </div>

    </div>
  )
}

export default Dashboard
