import React, { ReactNode } from 'react'
import QueryProvider from './QueryProvider'
import { AuthProvider } from './AuthProvider'

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  )
}

export default AppProvider
