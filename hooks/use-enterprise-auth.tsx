'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { EnterpriseAuthService } from '@/lib/services/enterprise-auth'
import { EnterpriseUser } from '@/types/enterprise'
// Import the new context for future migration
import { useEnterpriseAuth as useNewEnterpriseAuth } from '@/contexts/EnterpriseAuthContext'

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
  console.log('DEBUG: EnterpriseAuthProvider component created')
  const [user, setUser] = useState<EnterpriseUser | null>(() => {
    console.log('DEBUG: Initializing user state, checking localStorage')
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('enterprise_user')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          console.log('DEBUG: Found stored user:', parsed)
          return parsed
        } catch (e) {
          console.log('DEBUG: Failed to parse stored user')
        }
      }
    }
    console.log('DEBUG: No stored user found')
    return null
  })
  const [loading, setLoading] = useState(() => {
    console.log('DEBUG: Initializing loading state to false')
    return false
  })
  
  const [authService] = useState(() => {
    console.log('DEBUG: Creating EnterpriseAuthService instance')
    return new EnterpriseAuthService()
  })

  useEffect(() => {
    console.log('DEBUG: useEffect triggered - checking auth state')
    console.log('DEBUG: User already set during initialization:', user)

    // Always check localStorage on mount to ensure fresh data
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('enterprise_user')
      const storedToken = localStorage.getItem('enterprise_token')

      console.log('DEBUG: Checking localStorage - storedUser:', !!storedUser, 'storedToken:', !!storedToken)

      if (storedUser && storedToken) {
        try {
          const parsed = JSON.parse(storedUser)
          console.log('DEBUG: Found stored user in useEffect, setting user:', parsed)
          // Always update user from localStorage to ensure we have latest data
          setUser(parsed)
        } catch (e) {
          console.log('DEBUG: Failed to parse stored user in useEffect:', e)
        }
      } else if (!storedUser || !storedToken) {
        // Clear user state if localStorage is empty
        console.log('DEBUG: No stored credentials, clearing user state')
        setUser(null)
      }
    }
  }, [])

  const initializeAuth = async () => {
    console.log('DEBUG: Initializing auth')
    try {
      // Check if user is stored locally
      const storedUser = authService.getStoredUser()
      console.log('DEBUG: Stored user:', storedUser)
      console.log('DEBUG: Is authenticated:', authService.isAuthenticated())
      
      if (storedUser && authService.isAuthenticated()) {
        console.log('DEBUG: User found, verifying token')
        // Verify token is still valid by fetching current user
        const result = await authService.getCurrentUser()
        console.log('DEBUG: Current user result:', result)
        
        if (result.success && result.user) {
          console.log('DEBUG: Token valid, setting user')
          setUser(result.user)
        } else {
          console.log('DEBUG: Token invalid, clearing storage')
          // Token invalid, clear storage
          authService.logout()
        }
      } else {
        console.log('DEBUG: No stored user or not authenticated')
      }
    } catch (error) {
      console.error('DEBUG: Auth initialization error:', error)
      authService.logout()
    } finally {
      console.log('DEBUG: Auth initialization complete, setting loading to false')
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log('DEBUG: Starting login process')
      const result = await authService.loginWithCredentials(email, password)
      console.log('DEBUG: Login result:', result)
      console.log('DEBUG: Auth service isAuthenticated after login:', authService.isAuthenticated())
      
      if (result.success && result.user) {
        console.log('DEBUG: Setting user in context:', result.user)
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

  const isAuthenticated = authService.isAuthenticated()
  console.log('DEBUG: Context render - user:', user)
  console.log('DEBUG: Context render - loading:', loading)
  console.log('DEBUG: Context render - isAuthenticated:', isAuthenticated)
  
  const value: EnterpriseAuthContextType = {
    user,
    loading,
    login,
    loginWithSSO,
    register,
    logout,
    refresh,
    isAuthenticated,
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