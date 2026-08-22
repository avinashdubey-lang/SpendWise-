import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import AuthLayout from '@/layouts/AuthLayout'
import { useAuth } from '@/providers/AuthProvider'
import { login, register } from '@/features/auth/api/authApi'
import { getCurrentUser } from '@/features/auth/api/userApi'

// Shared UI components to showcase in placeholders
import PageHeader from '@/components/common/PageHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'


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

import LessonsPageFeature from '@/features/lessons/LessonsPage'

const LessonsPage: React.FC = () => {
  return <LessonsPageFeature />
}

import AICoachFeature from '@/features/ai/AICoach'

const AICoachPage: React.FC = () => {
  return <AICoachFeature />
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
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorMsg, setErrorMsg] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const auth = useAuth()
  const navigate = useNavigate()

  const handleRegister = async () => {
    setErrorMsg('')
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('All fields are required.')
      return
    }

    try {
      setIsLoading(true)
      // 1. Call register
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      // 2. Call login
      let loginRes
      try {
        loginRes = await login({
          email: email.trim(),
          password,
        })
      } catch (loginErr) {
        setErrorMsg('Account created successfully, but automatic login failed. Please sign in manually.')
        setIsLoading(false)
        return
      }

      // 3. Store token
      localStorage.setItem("token", loginRes.access_token)

      // 4. Fetch profile
      const user = await getCurrentUser()
      await auth.login(user)

      // 5. Navigate to Dashboard
      navigate('/dashboard')
    } catch (err: any) {
      const status = err.response?.status
      if (status === 409) {
        setErrorMsg('Email already registered.')
      } else if (status === 400 || status === 422) {
        setErrorMsg('Invalid registration data. Please verify your details.')
      } else {
        setErrorMsg(err.response?.data?.detail || err.response?.data?.message || 'Failed to create account. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="focus:ring-emerald-500/10 focus:border-emerald-500"
        />
        <Input 
          label="Email Address" 
          placeholder="you@example.com" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="focus:ring-emerald-500/10 focus:border-emerald-500"
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="focus:ring-emerald-500/10 focus:border-emerald-500"
        />
        
        <p className="text-[10px] text-slate-400 leading-normal px-0.5">
          By signing up, you agree to our{' '}
          <a href="#" className="text-slate-500 underline hover:text-slate-700">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-slate-500 underline hover:text-slate-700">Privacy Policy</a>.
        </p>

        {errorMsg && (
          <p className="text-xs font-semibold text-danger leading-normal px-0.5">
            {errorMsg}
          </p>
        )}

        <Button 
          variant="primary" 
          className="w-full justify-center mt-2 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          onClick={handleRegister}
          isLoading={isLoading}
          disabled={isLoading}
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
          <Route path="/lessons" element={<LessonsPage />} />
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
