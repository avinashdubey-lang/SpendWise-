import React from 'react'
import PageHeader from '@/components/common/PageHeader'
import Card from '@/components/ui/Card'
import LoadingState from '@/components/feedback/LoadingState'
import ErrorState from '@/components/feedback/ErrorState'
import EmptyState from '@/components/feedback/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { 
  useDashboardSummary, 
  useTopGoal, 
  useSpendingByCategory 
} from '@/features/dashboard/hooks/useDashboardData'
import { 
  BookOpen, 
  Utensils, 
  ShoppingBag, 
  Calendar, 
  TrendingUp, 
  Target, 
  Award, 
  Sparkles, 
  Info, 
  Lightbulb
} from 'lucide-react'

type Lesson = {
  title: string
  category: string
  icon: React.ReactNode
  colorClass: string
  explanation: string
  whyItMatters: string
  takeaway: string
  indicator: string
}

export const LessonsPage: React.FC = () => {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // Queries
  const summaryQuery = useDashboardSummary(currentMonth, currentYear)
  const categoryQuery = useSpendingByCategory()
  const topGoalQuery = useTopGoal()

  const isLoading = summaryQuery.isLoading || categoryQuery.isLoading || topGoalQuery.isLoading
  const isError = summaryQuery.isError || categoryQuery.isError || topGoalQuery.isError

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
        <PageHeader 
          title="My Lessons" 
          subtitle="Learn from your own financial behavior."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 space-y-4">
            <LoadingState variant="skeleton" className="h-6 w-1/3" />
            <LoadingState variant="skeleton" className="h-20" />
          </Card>
          <Card className="p-6 space-y-4">
            <LoadingState variant="skeleton" className="h-6 w-1/3" />
            <LoadingState variant="skeleton" className="h-20" />
          </Card>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
        <PageHeader 
          title="My Lessons" 
          subtitle="Learn from your own financial behavior."
        />
        <Card className="p-6">
          <ErrorState
            title="Failed to compile lessons"
            message="We could not access your transaction breakdowns. Please try again."
            onRetry={() => {
              summaryQuery.refetch()
              categoryQuery.refetch()
              topGoalQuery.refetch()
            }}
          />
        </Card>
      </div>
    )
  }

  const summary = summaryQuery.data || { monthlyAllowance: 0, totalSpent: 0, remainingBalance: 0, savingsRate: 0 }
  const categories = categoryQuery.data || []
  const topGoal = topGoalQuery.data || null

  const hasExpenses = summary.totalSpent > 0
  const hasBudget = summary.monthlyAllowance > 0
  const hasGoals = topGoal !== null

  // Empty State Check
  if (!hasExpenses && !hasBudget && !hasGoals) {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
        <PageHeader 
          title="My Lessons" 
          subtitle="Learn from your own financial behavior."
        />
        <Card className="p-8">
          <EmptyState
            icon={<BookOpen className="h-10 w-10 text-slate-300" />}
            title="Your lessons will appear as you build your financial history"
            description="SpendWise analyzes your transactions, budgeting pacing, and goal progress to form lessons. Add expenses, set a budget, or create a savings goal to start learning."
          />
        </Card>
      </div>
    )
  }

  // Compile Lessons Deterministically
  const lessons: Lesson[] = []

  // 1. Convenience Spending Lesson
  const foodSpend = categories.find(c => c.category.toLowerCase().includes('food'))
  const travelSpend = categories.find(c => c.category.toLowerCase().includes('travel') || c.category.toLowerCase().includes('transport') || c.category.toLowerCase().includes('cab'))
  
  if ((foodSpend && foodSpend.totalSpent > 0) || (travelSpend && travelSpend.totalSpent > 0)) {
    const totalConvenience = (foodSpend?.totalSpent || 0) + (travelSpend?.totalSpent || 0)
    lessons.push({
      title: "Understand Convenience Spending",
      category: "Convenience",
      icon: <Utensils className="h-4.5 w-4.5" />,
      colorClass: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      explanation: `You have spent ${formatCurrency(totalConvenience)} on Food and Travel so far. Frequently ordering delivery or booking cabs can quietly siphon off funds that could otherwise build your savings.`,
      whyItMatters: "Discretionary micro-purchases might seem negligible on their own, but surcharges, tips, and convenience markups compound heavily over a full month.",
      takeaway: "Try setting a weekly food-delivery or rideshare limit. Challenge yourself to replace one delivery order with home cooking.",
      indicator: "Based on your spending"
    })
  }

  // 2. Needs vs Wants Lesson
  const shoppingSpend = categories.find(c => c.category.toLowerCase().includes('shop'))
  const entSpend = categories.find(c => c.category.toLowerCase().includes('entertain'))
  
  if ((shoppingSpend && shoppingSpend.totalSpent > 0) || (entSpend && entSpend.totalSpent > 0)) {
    const totalDiscretionary = (shoppingSpend?.totalSpent || 0) + (entSpend?.totalSpent || 0)
    lessons.push({
      title: "Needs vs. Wants Prioritization",
      category: "Lifestyle",
      icon: <ShoppingBag className="h-4.5 w-4.5" />,
      colorClass: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      explanation: `You allocated ${formatCurrency(totalDiscretionary)} toward Shopping and Entertainment this month. Discretionary lifestyle spending is often non-essential.`,
      whyItMatters: "Distinguishing between structural expenses (needs) and lifestyle comforts (wants) is the foundation of compound savings progress.",
      takeaway: "Adopt the 48-hour rule. Wait two full days before checking out non-essential online shopping carts.",
      indicator: "Based on your spending"
    })
  }

  // 3. Budget Pacing Lesson
  if (hasBudget) {
    const budgetPct = Math.min(100, Math.round((summary.totalSpent / summary.monthlyAllowance) * 100))
    if (budgetPct > 50) {
      lessons.push({
        title: "Mastering Budget Pacing",
        category: "Budgeting",
        icon: <Calendar className="h-4.5 w-4.5" />,
        colorClass: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        explanation: `You spent ${budgetPct}% of your ${formatCurrency(summary.monthlyAllowance)} allowance. Depleting your monthly limit too early increases stress at the month's end.`,
        whyItMatters: "Pacing spending evenly ensures you never need to dip into emergency cash reserves or credit to cover basic needs in the final week.",
        takeaway: "Divide your monthly allowance into four weekly segments. Focus on managing your cash within each week's individual limit.",
        indicator: "Based on your pacing"
      })
    } else {
      lessons.push({
        title: "Healthy Pacing & Surplus",
        category: "Budgeting",
        icon: <TrendingUp className="h-4.5 w-4.5" />,
        colorClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        explanation: `You've used only ${budgetPct}% of your ${formatCurrency(summary.monthlyAllowance)} budget. You are on track to finish the month with a surplus.`,
        whyItMatters: "Consistently spending below your allowance limit builds a safety buffer and accelerates your financial options.",
        takeaway: "Consider putting part of your remaining balance toward your highest-priority savings goal before the month closes.",
        indicator: "Based on your pacing"
      })
    }
  }

  // 4. Goal Savings Lesson
  if (hasGoals && topGoal) {
    const progress = topGoal.targetAmount > 0 ? Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100) : 0
    lessons.push({
      title: "Goal-Oriented Savings Habits",
      category: "Savings",
      icon: <Target className="h-4.5 w-4.5" />,
      colorClass: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
      explanation: `Your top goal is "${topGoal.name}" (${progress}% completed). You have saved ${formatCurrency(topGoal.currentAmount)} toward your target of ${formatCurrency(topGoal.targetAmount)}.`,
      whyItMatters: "Saving without specific targets makes it an afterthought. Structuring your savings around concrete milestones boosts emotional discipline.",
      takeaway: `Automate a fixed transfer to your "${topGoal.name}" goal immediately on the day you receive your monthly income.`,
      indicator: "Based on your goals"
    })
  }

  // 5. Saving Habit Lesson
  const savingsRate = summary.savingsRate
  if (savingsRate > 15) {
    lessons.push({
      title: "The Power of Compound Habits",
      category: "Habits",
      icon: <Award className="h-4.5 w-4.5" />,
      colorClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      explanation: `You've kept ${savingsRate}% of your monthly allowance unspent so far. Consistently keeping money unspent gives you more flexibility to build savings and handle unexpected expenses.`,
      whyItMatters: "Putting money away consistently forms habits that compound. Time multiplies consistent deposits exponentially.",
      takeaway: "Maintain your discipline. Explore automatic investment plans to allow compound interest to expand your net worth.",
      indicator: "Based on savings rate"
    })
  } else {
    lessons.push({
      title: "Micro-Saving and Small Deposits",
      category: "Habits",
      icon: <Sparkles className="h-4.5 w-4.5" />,
      colorClass: "bg-teal-500/10 text-teal-600 border-teal-500/20",
      explanation: `You've kept ${savingsRate}% of your monthly allowance unspent so far. Small changes in your routine can unlock significant monthly capital.`,
      whyItMatters: "Building savings is a structural muscle. The action of saving regularly is far more important than the deposit size starting out.",
      takeaway: "Set a tiny weekly savings target (e.g. ₹100). Once the habit is comfortable, scale the transfer amount by 10% monthly.",
      indicator: "Based on savings rate"
    })
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader 
        title="My Lessons" 
        subtitle="Learn from your own financial behavior."
      />

      {/* Lessons List Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {lessons.map((lesson, idx) => (
          <Card 
            key={idx}
            className="p-6 flex flex-col justify-between border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white group"
          >
            <div className="space-y-4">
              {/* Category Badge & Indicator */}
              <div className="flex items-center justify-between gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${lesson.colorClass}`}>
                  {lesson.icon}
                  <span>{lesson.category}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold italic">
                  {lesson.indicator}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight leading-snug group-hover:text-primary transition-colors">
                {lesson.title}
              </h3>

              {/* Explanation */}
              <div className="bg-slate-50 border border-slate-100/70 p-3 rounded-xl">
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                  {lesson.explanation}
                </p>
              </div>

              {/* Why It Matters */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Why it matters</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {lesson.whyItMatters}
                </p>
              </div>
            </div>

            {/* Takeaway / Action */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                <Lightbulb className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Takeaway action</span>
              </div>
              <p className="text-xs font-bold text-slate-700 leading-relaxed">
                {lesson.takeaway}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default LessonsPage
