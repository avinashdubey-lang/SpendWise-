import React, { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import StatCard from '@/components/common/StatCard'
import EmptyState from '@/components/feedback/EmptyState'
import { 
  Sparkles, 
  Target, 
  Receipt, 
  BarChart3, 
  Plus, 
  Bell, 
  ChevronRight, 
  HelpCircle,
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  Shield,
  Activity,
  Laptop,
  Heart,
  Palmtree,
  ArrowRight,
  Database
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [isEmptyState, setIsEmptyState] = useState(false)
  const [showNotificationsToast, setShowNotificationsToast] = useState(false)

  // Get dynamic local date formatted as e.g., "Saturday, 18 July"
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  // Sample static data for full state
  const goals = [
    {
      id: 'g1',
      name: 'MacBook Pro Fund',
      current: 37500,
      target: 50000,
      icon: Laptop,
      color: 'text-accent bg-blue-50 border-blue-100',
      progressColor: 'bg-accent',
      dueDate: 'Sept 2026',
      message: "You're ahead of schedule."
    },
    {
      id: 'g2',
      name: 'Emergency Fund',
      current: 90000,
      target: 150000,
      icon: Heart,
      color: 'text-primary bg-emerald-50 border-emerald-100',
      progressColor: 'bg-primary',
      dueDate: 'Dec 2026',
      message: 'Consistent savings this month.'
    },
    {
      id: 'g3',
      name: 'Europe Trip',
      current: 20000,
      target: 80000,
      icon: Palmtree,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      progressColor: 'bg-amber-500',
      dueDate: 'June 2027',
      message: 'Keep going, small steps count!'
    }
  ]

  const expenses = [
    { id: 't1', merchant: 'Swiggy', category: 'Food', amount: 650, date: 'Today, 12:40 PM', status: 'Completed' },
    { id: 't2', merchant: 'Amazon India', category: 'Shopping', amount: 3400, date: 'Yesterday', status: 'Completed' },
    { id: 't3', merchant: 'Uber Cabs', category: 'Transport', amount: 320, date: '16 July', status: 'Completed' },
    { id: 't4', merchant: 'Bescom Electricity', category: 'Bills', amount: 4500, date: '15 July', status: 'Pending' },
    { id: 't5', merchant: 'Starbucks Coffee', category: 'Food', amount: 450, date: '14 July', status: 'Completed' },
    { id: 't6', merchant: 'Netflix Subscription', category: 'Entertainment', amount: 649, date: '12 July', status: 'Completed' },
  ]

  const categories = [
    { name: 'Food', percentage: 35, color: 'bg-primary', strokeDash: '35 65', strokeOffset: '0' },
    { name: 'Bills', percentage: 25, color: 'bg-slate-700', strokeDash: '25 75', strokeOffset: '-35' },
    { name: 'Shopping', percentage: 20, color: 'bg-accent', strokeDash: '20 80', strokeOffset: '-60' },
    { name: 'Transport', percentage: 12, color: 'bg-amber-500', strokeDash: '12 88', strokeOffset: '-80' },
    { name: 'Entertainment', percentage: 8, color: 'bg-violet-500', strokeDash: '8 92', strokeOffset: '-92' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner Greeting & Main CTA Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Good Morning, {user?.name.split(' ')[0] || 'Avinash'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-slate-400">{formattedDate}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <button 
              onClick={() => setIsEmptyState(!isEmptyState)}
              className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Database className="h-3 w-3" />
              <span>{isEmptyState ? "Show Populated Dashboard" : "Mock Empty Dashboard"}</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <Button 
            variant="outline" 
            icon={<Bell className="h-4.5 w-4.5" />} 
            onClick={() => {
              setShowNotificationsToast(true)
              setTimeout(() => setShowNotificationsToast(false), 3000)
            }}
            className="relative cursor-pointer"
          >
            Notifications
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white border border-white">
              2
            </span>
          </Button>
          <Button 
            variant="primary" 
            icon={<Sparkles className="h-4.5 w-4.5" />}
            className="shadow-sm shadow-primary/20 hover:shadow-md transition-all cursor-pointer"
          >
            Ask AI Mentor
          </Button>
        </div>
      </div>

      {/* Temp Notification Toast */}
      {showNotificationsToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50 text-xs font-semibold animate-slide-up border border-slate-800">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>Your AI Coach has analyzed yesterday's Swiggy meal. Check insights.</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* LEFT 2/3 COLUMN (Core Stats, Insight, Expenses Table) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 4: Monthly Cashflow Overview */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <StatCard 
              label="Monthly Income" 
              value={isEmptyState ? "₹0.00" : "₹1,20,000"} 
              trend={isEmptyState ? undefined : 4.2} 
              trendLabel="vs last month"
            />
            <StatCard 
              label="Money Remaining" 
              value={isEmptyState ? "₹0.00" : "₹74,800"} 
              trend={isEmptyState ? undefined : 8.6} 
              trendLabel="ready to invest"
            />
            <StatCard 
              label="Total Expenses" 
              value={isEmptyState ? "₹0.00" : "₹45,200"} 
              trend={isEmptyState ? undefined : -12.4} 
              trendLabel="vs last month"
              isNegativeTrend={false} // Decreasing expenses is good
            />
            <StatCard 
              label="Net Savings" 
              value={isEmptyState ? "₹0.00" : "₹30,000"} 
              trend={isEmptyState ? undefined : 14.8} 
              trendLabel="savings rate 25%"
            />
          </div>

          {/* Section 2: AI Mentor Highlight Insight Card (Visually Dominant) */}
          <Card className="relative p-6 border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.02] via-transparent to-transparent shadow-md shadow-emerald-500/5 overflow-hidden group">
            {/* Subtle premium corner glow */}
            <div className="absolute right-0 top-0 h-28 w-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            
            {isEmptyState ? (
              <EmptyState 
                icon={<Sparkles className="h-8 w-8 text-primary" />}
                title="Awaiting transaction metrics"
                description="Our AI Mentor analyzes your transactions in real-time. Log regular transactions or connect banking nodes to trigger your first advice prompt."
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Today's AI Insight</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Updated 2 hours ago</p>
                    </div>
                  </div>
                  <Badge variant="primary">Coaching active</Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium">
                    "You spent <span className="text-danger font-semibold">18% more</span> on dining out this week. Reducing dining expenses by <span className="font-semibold text-slate-900 border-b border-primary/30">₹1,200</span> this month would allow you to reach your <span className="font-semibold text-slate-900">MacBook Pro Goal</span> nearly two months earlier."
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="primary" size="sm" className="cursor-pointer">
                    View Budget Analysis
                  </Button>
                  <Button variant="outline" size="sm" className="cursor-pointer" icon={<Sparkles className="h-3.5 w-3.5 text-primary" />}>
                    Ask AI Mentor
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Section 6: Recent Expenses Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Recent Transactions</h3>
                <p className="text-xs text-slate-400">Your logged cash flows</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary hover:bg-primary/5 cursor-pointer">
                View All Transactions <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {isEmptyState ? (
              <EmptyState 
                icon={<Receipt className="h-8 w-8 text-slate-300" />}
                title="No logged transactions"
                description="Initiate logs for bills, dining, or shopping to feed analytics."
                action={<Button variant="outline" size="sm">+ Add Transaction</Button>}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Merchant</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 pr-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 pl-2 font-bold text-slate-700">{expense.merchant}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-slate-50 border-slate-100 text-slate-600">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-slate-800">₹{expense.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-slate-500">{expense.date}</td>
                        <td className="py-3 pr-2 text-right">
                          <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${
                            expense.status === 'Completed' ? 'bg-primary' : 'bg-amber-400'
                          }`} />
                          <span className={`font-semibold ${
                            expense.status === 'Completed' ? 'text-slate-700' : 'text-amber-600'
                          }`}>{expense.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

        </div>

        {/* RIGHT 1/3 COLUMN (Health Score, Active Goals, Category Pie Chart, Actions) */}
        <div className="space-y-6">
          
          {/* Section 1: Financial Health Card */}
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Financial Health Index</span>
              <Activity className="h-4 w-4 text-primary" />
            </div>

            {isEmptyState ? (
              <EmptyState 
                title="Index uncalculated"
                description="Calculation takes place once transaction inputs are complete."
              />
            ) : (
              <div className="space-y-4 w-full">
                {/* SVG Progress Ring */}
                <div className="relative flex items-center justify-center my-2">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-slate-100 fill-transparent"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-primary fill-transparent transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray="339.2"
                      strokeDashoffset={339.2 - (339.2 * 88) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-800 tracking-tight">88</span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Excellent</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-bold">
                    <TrendingUp className="h-3 w-3" />
                    <span>+4 points this month</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed px-2">
                    Your financial habits improved thanks to lower discretionary spending and consistent goal funding.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Section 3: Financial Goals Milestones */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Financial Goals</h3>
                <p className="text-xs text-slate-400">Milestones you are saving for</p>
              </div>
              <Target className="h-4 w-4 text-slate-400" />
            </div>

            {isEmptyState ? (
              <EmptyState 
                icon={<Target className="h-8 w-8 text-slate-300" />}
                title="No saving goals"
                description="Establish your first target fund to track progress."
                action={<Button variant="outline" size="sm">+ Create Goal</Button>}
              />
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => {
                  const percentage = Math.round((goal.current / goal.target) * 100)
                  return (
                    <div key={goal.id} className="space-y-2 group p-2 rounded-xl hover:bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${goal.color}`}>
                            <goal.icon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{goal.name}</h4>
                            <p className="text-[9px] text-slate-400">Target by {goal.dueDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-800">₹{goal.current.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400 block">of ₹{goal.target.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${goal.progressColor}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400 px-0.5">
                          <span>{percentage}% complete</span>
                          <span className="text-primary">{goal.message}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Section 5: Expense Categories Donut Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Expense Allocations</h3>
                <p className="text-xs text-slate-400">Share of monthly costs</p>
              </div>
              <PieChartIcon className="h-4 w-4 text-slate-400" />
            </div>

            {isEmptyState ? (
              <EmptyState 
                title="Allocations empty"
                description="Provide transactions to generate chart shares."
              />
            ) : (
              <div className="flex items-center gap-6 justify-center py-2">
                {/* SVG Segmented Donut Chart */}
                <div className="relative h-28 w-28 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    {/* Circle backing */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                    
                    {/* Segment 1: Food 35% */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3" 
                            strokeDasharray="35 65" strokeDashoffset="25" />
                    
                    {/* Segment 2: Bills 25% */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#334155" strokeWidth="3" 
                            strokeDasharray="25 75" strokeDashoffset="-10" />

                    {/* Segment 3: Shopping 20% */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="3" 
                            strokeDasharray="20 80" strokeDashoffset="-35" />

                    {/* Segment 4: Transport 12% */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3" 
                            strokeDasharray="12 88" strokeDashoffset="-55" />

                    {/* Segment 5: Entertainment 8% */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="3" 
                            strokeDasharray="8 92" strokeDashoffset="-67" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Total</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5">₹45.2K</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-1 space-y-1.5">
                  {categories.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-[10px] font-semibold">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className={`h-2 w-2 rounded-full ${cat.color}`} />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-slate-800">{cat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Section 7: Quick Actions List */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Financial Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all text-center group cursor-pointer">
                <Plus className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700">Add Expense</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all text-center group cursor-pointer">
                <Target className="h-5 w-5 text-accent group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700">Create Goal</span>
              </button>

              <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all text-center group cursor-pointer">
                <Sparkles className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-1.5 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-700">Ask AI Coach</span>
              </button>

              <button className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all text-center group cursor-pointer">
                <BarChart3 className="h-5 w-5 text-slate-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-700">View Analytics</span>
              </button>
            </div>
          </Card>

        </div>

      </div>

    </div>
  )
}

// Custom internal pie chart icon placeholder for safety
const PieChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
)

export default Dashboard
