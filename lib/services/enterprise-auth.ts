import { DeploymentMode, SSOConfig, EnterpriseConfiguration, EnterpriseUser, EnterpriseApiKey } from '@/types/enterprise'

export class EnterpriseAuthService {
  private baseUrl: string
  private authToken: string | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_ENTERPRISE_API_URL || 'https://enterprise-api.vrin.ai'
    
    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('enterprise_token')
    }
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }
    
    return headers
  }

  async loginWithCredentials(email: string, password: string): Promise<{
    success: boolean
    user?: EnterpriseUser
    token?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        this.authToken = data.token
        if (typeof window !== 'undefined') {
          localStorage.setItem('enterprise_token', data.token)
          localStorage.setItem('enterprise_user', JSON.stringify(data.user))
        }
        return { success: true, user: data.user, token: data.token }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error during login' }
    }
  }

  async initiateSSOLogin(provider: 'saml' | 'oidc', organizationDomain: string): Promise<{
    success: boolean
    redirectUrl?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/sso/${provider}/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationDomain })
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, redirectUrl: data.redirectUrl }
      } else {
        return { success: false, error: data.error || 'SSO initiation failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error during SSO initiation' }
    }
  }

  async handleSSOCallback(provider: 'saml' | 'oidc', callbackData: any): Promise<{
    success: boolean
    user?: EnterpriseUser
    token?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/sso/${provider}/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callbackData)
      })

      const data = await response.json()

      if (response.ok) {
        this.authToken = data.token
        if (typeof window !== 'undefined') {
          localStorage.setItem('enterprise_token', data.token)
          localStorage.setItem('enterprise_user', JSON.stringify(data.user))
        }
        return { success: true, user: data.user, token: data.token }
      } else {
        return { success: false, error: data.error || 'SSO callback failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error during SSO callback' }
    }
  }

  async register(organizationData: {
    organizationName: string
    contactEmail: string
    firstName: string
    lastName: string
    password: string
    industry: string
    organizationSize: 'startup' | 'sme' | 'enterprise' | 'government'
    complianceRequirements: string[]
  }): Promise<{
    success: boolean
    user?: EnterpriseUser
    organizationId?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organizationData)
      })

      const data = await response.json()

      if (response.ok) {
        return { 
          success: true, 
          user: data.user, 
          organizationId: data.organizationId 
        }
      } else {
        return { success: false, error: data.error || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error during registration' }
    }
  }

  async generateEnterpriseApiKey(organizationId: string, config: {
    name: string
    environment: 'development' | 'staging' | 'production'
    deploymentMode: DeploymentMode
    infrastructure: any
    permissions: string[]
    rateLimit?: {
      requestsPerMinute: number
      requestsPerHour: number
      requestsPerDay: number
    }
  }): Promise<{
    success: boolean
    apiKey?: EnterpriseApiKey
    error?: string
  }> {
    try {
      const keyPrefix = this.determineKeyPrefix(config.deploymentMode)
      
      const response = await fetch(`${this.baseUrl}/auth/enterprise-keys`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          organizationId,
          keyPrefix,
          ...config
        })
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, apiKey: data.apiKey }
      } else {
        return { success: false, error: data.error || 'API key generation failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error during API key generation' }
    }
  }

  async listApiKeys(organizationId: string): Promise<{
    success: boolean
    apiKeys?: EnterpriseApiKey[]
    error?: string
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/auth/enterprise-keys?organizationId=${organizationId}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      )

      const data = await response.json()

      if (response.ok) {
        return { success: true, apiKeys: data.apiKeys }
      } else {
        return { success: false, error: data.error || 'Failed to fetch API keys' }
      }
    } catch (error) {
      return { success: false, error: 'Network error fetching API keys' }
    }
  }

  async deleteApiKey(apiKeyId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/enterprise-keys/${apiKeyId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      })

      if (response.ok) {
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || 'Failed to delete API key' }
      }
    } catch (error) {
      return { success: false, error: 'Network error deleting API key' }
    }
  }

  async rotateApiKey(apiKeyId: string): Promise<{
    success: boolean
    newApiKey?: EnterpriseApiKey
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/enterprise-keys/${apiKeyId}/rotate`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true, newApiKey: data.apiKey }
      } else {
        return { success: false, error: data.error || 'Failed to rotate API key' }
      }
    } catch (error) {
      return { success: false, error: 'Network error rotating API key' }
    }
  }

  async getCurrentUser(): Promise<{
    success: boolean
    user?: EnterpriseUser
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('enterprise_user', JSON.stringify(data.user))
        }
        return { success: true, user: data.user }
      } else {
        // Token might be expired
        this.logout()
        return { success: false, error: data.error || 'Authentication failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error fetching user' }
    }
  }

  async updateUserProfile(updates: Partial<EnterpriseUser>): Promise<{
    success: boolean
    user?: EnterpriseUser
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('enterprise_user', JSON.stringify(data.user))
        }
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error || 'Profile update failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error updating profile' }
    }
  }

  async configureSSOSettings(organizationId: string, ssoConfig: SSOConfig): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/sso/configure`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          organizationId,
          ssoConfig
        })
      })

      if (response.ok) {
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || 'SSO configuration failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error configuring SSO' }
    }
  }

  logout(): void {
    this.authToken = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('enterprise_token')
      localStorage.removeItem('enterprise_user')
      
      // Redirect to login
      window.location.href = '/login'
    }
  }

  isAuthenticated(): boolean {
    return this.authToken !== null
  }

  getStoredUser(): EnterpriseUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('enterprise_user')
      if (userStr) {
        try {
          return JSON.parse(userStr)
        } catch {
          return null
        }
      }
    }
    return null
  }

  private determineKeyPrefix(mode: DeploymentMode): string {
    switch(mode) {
      case 'air_gapped': return 'vrin_ent_airgap_'
      case 'vpc_isolated': return 'vrin_ent_vpc_'
      case 'hybrid_explicit': return 'vrin_ent_hybrid_'
      default: throw new Error('Invalid deployment mode')
    }
  }

  // Utility methods for checking permissions
  hasPermission(permission: string): boolean {
    const user = this.getStoredUser()
    return user?.permissions?.includes(permission) || user?.role === 'admin' || false
  }

  canManageUsers(): boolean {
    return this.hasPermission('manage_users') || this.getStoredUser()?.role === 'admin'
  }

  canManageDeployments(): boolean {
    return this.hasPermission('manage_deployments') || 
           ['admin', 'developer'].includes(this.getStoredUser()?.role || '')
  }

  canViewBilling(): boolean {
    return this.hasPermission('view_billing') || this.getStoredUser()?.role === 'admin'
  }
}