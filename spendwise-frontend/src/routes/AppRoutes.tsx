import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import AuthLayout from '@/layouts/AuthLayout'
import { useAuth } from '@/providers/AuthProvider'
import { login } from '@/features/auth/api/authApi'
import { getCurrentUser } from '@/features/auth/api/userApi'

// Shared UI components to showcase in placeholders
import PageHeader from '@/components/common/PageHeader'
import StatCard from '@/components/common/StatCard'
import EmptyState from '@/components/feedback/EmptyState'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

import { 
  Sparkles, 
  Target, 
  Receipt, 
  BarChart3, 
  Settings as SettingsIcon,
  HelpCircle,
  PiggyBank,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react'

// Placeholder Views for the frontend foundation (no actual feature business logic)

import Dashboard from '@/features/dashboard/Dashboard'

const DashboardPage: React.FC = () => {
  return <Dashboard />
}

import ExpensesPageFeature from '@/features/expenses/ExpensesPage'

const ExpensesPage: React.FC = () => {
  return <ExpensesPageFeature />
}

import GoalsPageFeature from '@/features/goals/GoalsPage'

const GoalsPage: React.FC = () => {
  return <GoalsPageFeature />
}

const AnalysisPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Spending Analysis" 
        subtitle="In-depth breakdown of your cashflow, categories, and trends."
      />
      <Card className="p-6">
        <EmptyState 
          icon={<BarChart3 className="h-10 w-10 text-slate-400" />}
          title="Visual analytics will display here" 
          description="We are gathering transaction logs. Once we process sufficient data, beautiful charts and interactive breakdowns will be generated." 
        />
      </Card>
    </div>
  )
}

const AICoachPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Mentor Coach" 
        subtitle="Get instant personalized financial feedback and budget optimization tips."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 p-6 flex flex-col h-[500px] justify-between">
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-semibold shrink-0">
                AI
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl max-w-[80%]">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Hi Alex! I'm your SpendWise AI Mentor. I analyze your spending behavior and help you build financial discipline. What financial query or goal can I assist you with today?
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Input 
              placeholder="Ask me anything (e.g., 'How can I save $500 this month?')" 
              className="flex-1"
            />
            <Button variant="primary">Send</Button>
          </div>
        </Card>
        
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              Suggested Prompts
            </h3>
            <div className="space-y-2 text-xs">
              <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                "Where did I spend the most last week?"
              </button>
              <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                "Help me design a budget for dining out."
              </button>
              <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                "Am I on track to meet my Emergency Fund goal?"
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your profile, connections, notification preferences, and AI parameters."
      />
      <Card className="p-6 max-w-2xl">
        <h3 className="text-base font-semibold text-slate-800 mb-6">Profile Settings</h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name" defaultValue="Alex" />
            <Input label="Last Name" defaultValue="Mercer" />
          </div>
          <Input label="Email Address" defaultValue="user@spendwise.ai" type="email" />
          <div className="pt-4 flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Authentication Forms Placeholders
const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorMsg, setErrorMsg] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    setErrorMsg('')
    if (!email || !password) {
      setErrorMsg('Email and password cannot be empty.')
      return
    }

    try {
      setIsLoading(true)
      const response = await login({
        email,
        password,
      });

      localStorage.setItem("token", response.access_token);

      const user = await getCurrentUser();
      await auth.login(user);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Welcome Back</h2>
        <p className="text-xs text-slate-500">
          Enter your details below to resume your financial growth.
        </p>
      </div>
      <div className="space-y-4">
        <Input 
          label="Email Address" 
          placeholder="you@example.com" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:ring-emerald-500/10 focus:border-emerald-500"
        />
        <div className="space-y-2">
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:ring-emerald-500/10 focus:border-emerald-500"
          />
          <div className="flex items-center justify-between text-[11px] px-0.5">
            <label className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20 h-3.5 w-3.5" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-primary font-semibold hover:underline">Forgot password?</a>
          </div>
        </div>
        
        {errorMsg && (
          <p className="text-xs font-semibold text-danger leading-none px-0.5">
            {errorMsg}
          </p>
        )}

        <Button 
          variant="primary" 
          className="w-full justify-center mt-2 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          onClick={handleLogin}
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </div>

      <div className="text-center text-[11px] text-slate-400 pt-2">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  )
}

const RegisterPage: React.FC = () => {
  const { login } = useAuth()
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Create Account</h2>
        <p className="text-xs text-slate-500">
          Begin your journey with your AI Financial Mentor today.
        </p>
      </div>
      <div className="space-y-4">
        <Input 
          label="Full Name" 
          placeholder="Alex Mercer" 
          className="focus:ring-emerald-500/10 focus:border-emerald-500"
        />
        <Input 
          label="Email Address" 
          placeholder="you@example.com" 
          type="email" 
          className="focus:ring-emerald-500/10 focus:border-emerald-500"
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••"
          className="focus:ring-emerald-500/10 focus:border-emerald-500"
        />
        
        <p className="text-[10px] text-slate-400 leading-normal px-0.5">
          By signing up, you agree to our{' '}
          <a href="#" className="text-slate-500 underline hover:text-slate-700">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-slate-500 underline hover:text-slate-700">Privacy Policy</a>.
        </p>

        <Button 
          variant="primary" 
          className="w-full justify-center mt-2 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          onClick={() => login('mock-jwt-token-123')}
        >
          Create Account
        </Button>
      </div>

      <div className="text-center text-[11px] text-slate-400 pt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}

// Global Redirect Resolver Component
const HomeRouteResolver: React.FC = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Redirect */}
        <Route path="/" element={<HomeRouteResolver />} />

        {/* Auth Group */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard/Feature Protected Group */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/ai" element={<AICoachPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
