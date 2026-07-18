import React from 'react'
import { Outlet, Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { 
  Landmark, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  Lock, 
  BrainCircuit, 
  TrendingUp,
  ArrowRight,
  PieChart
} from 'lucide-react'

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect authenticated users to dashboard
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen w-full bg-white bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] overflow-x-hidden">
      {/* Left Column - Authentication & Trust */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:flex-none lg:w-[480px] xl:w-[540px] bg-white/80 backdrop-blur-md border-r border-slate-200/50 z-10">
        
        {/* Branding Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-sm shadow-primary/20">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 leading-tight">SpendWise AI</h1>
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">AI Financial Mentor</p>
          </div>
        </div>

        {/* Auth form outlet */}
        <div className="my-auto py-12 max-w-sm w-full mx-auto">
          <Outlet />
        </div>

        {/* Trust Section - 3 Elegant Cards */}
        <div className="space-y-4 max-w-sm w-full mx-auto pt-6 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Built on Trust & Analytics</p>
          
          <div className="grid gap-3">
            {/* Feature 1 */}
            <div className="flex gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-sm group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Secure Authentication</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Bank-grade data encryption guarding your credentials.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-sm group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:scale-105 transition-transform duration-300">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">AI Financial Guidance</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Proactive budgeting mentoring based on your actions.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-sm group">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-105 transition-transform duration-300">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800">Goal-Based Planning</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Visualize milestone timelines adjust automatically.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column - Hero Display with Interactive Mockup */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 bg-slate-50/40 relative overflow-hidden select-none">
        
        {/* Intro Headline */}
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Introducing SpendWise AI 2.0</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 leading-tight mb-4">
            Smarter Financial Decisions. <br />Every Day.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            SpendWise AI goes beyond simple bookkeeping. It acts as an active financial mentor, helping you control spending habits, model future milestones, and secure your financial future.
          </p>
        </div>

        {/* Dashboard Preview Mockup (Requirement Redesign) */}
        <div className="my-10 relative max-w-2xl w-full mx-auto group">
          {/* Subtle background glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-70 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.01]" />
          
          {/* Main App Canvas */}
          <div className="relative rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
            {/* Header window control bar */}
            <div className="flex h-11 items-center justify-between px-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="text-[11px] font-medium text-slate-400 tracking-wide px-3 py-0.5 rounded-lg bg-white border border-slate-200/60">
                app.spendwise.ai/dashboard
              </div>
              <div className="w-12" />
            </div>

            {/* Split layout inside Mockup */}
            <div className="flex h-[380px]">
              {/* Mini Sidebar */}
              <div className="w-40 border-r border-slate-100 p-3 space-y-4 bg-slate-50/50">
                <div className="flex items-center gap-1.5 px-2">
                  <Landmark className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-bold text-slate-800">SpendWise</span>
                </div>
                <div className="space-y-1 text-[10px] font-semibold text-slate-500">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100">
                    <PieChart className="h-3.5 w-3.5" />
                    <span>Analysis</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area Grid */}
              <div className="flex-1 p-5 overflow-y-auto grid grid-cols-2 gap-4">
                
                {/* 1. Health Score widget */}
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Health Score</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Excellent</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-800">88</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[88%]" />
                  </div>
                </div>

                {/* 2. Monthly Spending widget */}
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Monthly Spending</span>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-slate-800">₹24,500</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium block mt-2">
                    ↓ 12% lower than usual
                  </span>
                </div>

                {/* 3. Goal Progress Widget */}
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Laptop Goal</span>
                    <span className="text-[10px] font-semibold text-slate-600">75%</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-bold text-slate-800">₹30,000 saved</span>
                    <p className="text-[9px] text-slate-400">Target: ₹40,000</p>
                  </div>
                  <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[75%]" />
                  </div>
                </div>

                {/* 4. Savings Progress */}
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Savings Progress</span>
                  <div className="mt-2 flex items-end gap-1.5">
                    {/* Small visual CSS chart */}
                    <div className="h-8 w-3 bg-slate-100 rounded-t" />
                    <div className="h-10 w-3 bg-slate-100 rounded-t" />
                    <div className="h-12 w-3 bg-slate-200 rounded-t" />
                    <div className="h-14 w-3 bg-primary/70 rounded-t" />
                    <div className="h-16 w-3 bg-primary rounded-t" />
                  </div>
                </div>

                {/* 5. Realistic AI recommendation card - Full Span */}
                <div className="col-span-2 p-4 rounded-xl border border-primary/20 bg-primary/[0.03] space-y-2 relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-16 w-16 bg-primary/5 rounded-full blur-md" />
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-semibold text-primary uppercase">Recent AI Insight</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    "You spent <span className="text-danger font-semibold">14% more</span> on food this week. Reducing food expenses by <span className="font-semibold text-slate-800">₹1,000/month</span> would help you reach your <span className="font-semibold text-slate-800">Laptop Goal</span> 2 months earlier."
                  </p>
                  <div className="flex justify-end pt-1">
                    <span className="text-[9px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-0.5">
                      Optimize Category <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Bottom watermark / description */}
        <div className="max-w-xl flex items-center justify-between text-xs text-slate-400">
          <span>Production-grade AI Financial Planning</span>
          <span>SpendWise AI &copy; {new Date().getFullYear()}</span>
        </div>

      </div>
    </div>
  )
}

export default AuthLayout
