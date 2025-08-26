'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { EnterpriseAuthService } from '@/lib/services/enterprise-auth'
import { EnterpriseUser } from '@/types/enterprise'

interface EnterpriseAuthContextType {
  user: EnterpriseUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithSSO: (provider: 'saml' | 'oidc', organizationDomain: string) => Promise<{ success: boolean; redirectUrl?: string; error?: string }>
  register: (data: any) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refresh: () => Promise<void>
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
  canManageUsers: boolean
  canManageDeployments: boolean
  canViewBilling: boolean
}

const EnterpriseAuthContext = createContext<EnterpriseAuthContextType | null>(null)

export function EnterpriseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EnterpriseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authService] = useState(() => new EnterpriseAuthService())

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Check if user is stored locally
      const storedUser = authService.getStoredUser()
      if (storedUser && authService.isAuthenticated()) {
        // Verify token is still valid by fetching current user
        const result = await authService.getCurrentUser()
        if (result.success && result.user) {
          setUser(result.user)
        } else {
          // Token invalid, clear storage
          authService.logout()
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      authService.logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await authService.loginWithCredentials(email, password)
      if (result.success && result.user) {
        setUser(result.user)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const loginWithSSO = async (provider: 'saml' | 'oidc', organizationDomain: string) => {
    setLoading(true)
    try {
      const result = await authService.initiateSSOLogin(provider, organizationDomain)
      return result
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: any) => {
    setLoading(true)
    try {
      const result = await authService.register(data)
      return result
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    authService.logout()
  }

  const refresh = async () => {
    if (!authService.isAuthenticated()) return
    
    try {
      const result = await authService.getCurrentUser()
      if (result.success && result.user) {
        setUser(result.user)
      } else {
        logout()
      }
    } catch (error) {
      console.error('Auth refresh error:', error)
      logout()
    }
  }

  const hasPermission = (permission: string) => {
    return authService.hasPermission(permission)
  }

  const value: EnterpriseAuthContextType = {
    user,
    loading,
    login,
    loginWithSSO,
    register,
    logout,
    refresh,
    isAuthenticated: authService.isAuthenticated(),
    hasPermission,
    canManageUsers: authService.canManageUsers(),
    canManageDeployments: authService.canManageDeployments(),
    canViewBilling: authService.canViewBilling(),
  }

  return (
    <EnterpriseAuthContext.Provider value={value}>
      {children}
    </EnterpriseAuthContext.Provider>
  )
}

export function useEnterpriseAuth() {
  const context = useContext(EnterpriseAuthContext)
  if (!context) {
    throw new Error('useEnterpriseAuth must be used within an EnterpriseAuthProvider')
  }
  return context
}

// Hook for protected routes
export function useRequireAuth() {
  const { user, loading, isAuthenticated } = useEnterpriseAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login'
    }
  }, [loading, isAuthenticated])

  return { user, loading, isAuthenticated }
}