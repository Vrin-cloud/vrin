'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  Mail,
  Lock,
  Building,
  AlertCircle,
  ArrowLeft,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organizationDomain, setOrganizationDomain] = useState('')
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'sso'>('credentials')
  const [ssoProvider, setSsoProvider] = useState<'saml' | 'oidc'>('saml')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { login, loginWithSSO } = useEnterpriseAuth()

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('DEBUG: Form submitted with:', { email, password: '***' })
    setLoading(true)
    setErrors({})

    // Validation
    if (!email.trim()) {
      console.log('DEBUG: Email validation failed')
      setErrors({ email: 'Email is required' })
      setLoading(false)
      return
    }
    if (!password.trim()) {
      console.log('DEBUG: Password validation failed')
      setErrors({ password: 'Password is required' })
      setLoading(false)
      return
    }

    console.log('DEBUG: Making direct API call (bypassing React auth)')
    try {
      const response = await fetch('https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod/enterprise/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      console.log('DEBUG: Response status:', response.status)
      const data = await response.json()
      console.log('DEBUG: Response data:', data)

      if (response.ok && data.success) {
        console.log('DEBUG: Login successful, storing data and redirecting')
        // Store token and user data directly
        localStorage.setItem('enterprise_token', data.token)
        localStorage.setItem('enterprise_user', JSON.stringify(data.user))
        
        toast.success('Welcome back!')
        window.location.href = '/enterprise/dashboard'
      } else {
        console.log('DEBUG: Login failed:', data.error || data.message)
        toast.error(data.error || data.message || 'Login failed')
        setErrors({ general: data.error || data.message || 'Login failed' })
      }
    } catch (error) {
      console.error('DEBUG: Direct API call error:', error)
      toast.error('Network error during login')
      setErrors({ general: 'Network error during login' })
    }
    
    setLoading(false)
  }

  const handleSSOLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    if (!organizationDomain.trim()) {
      setErrors({ organizationDomain: 'Organization domain is required' })
      setLoading(false)
      return
    }

    const result = await loginWithSSO(ssoProvider, organizationDomain)
    
    if (result.success && result.redirectUrl) {
      window.location.href = result.redirectUrl
    } else {
      toast.error(result.error || 'SSO login failed')
      setErrors({ general: result.error || 'SSO login failed' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VRIN</h1>
              <p className="text-sm text-gray-500">Enterprise</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-gray-600 mt-2">Sign in to manage your enterprise infrastructure</p>
        </motion.div>

        {/* Login Method Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex rounded-lg border border-gray-200 p-1 bg-white">
            <button
              onClick={() => setLoginMethod('credentials')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                loginMethod === 'credentials'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email & Password
            </button>
            <button
              onClick={() => setLoginMethod('sso')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                loginMethod === 'sso'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building className="w-4 h-4 inline mr-2" />
              Enterprise SSO
            </button>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {loginMethod === 'credentials' ? 'Sign In' : 'Enterprise SSO'}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Secure
                </Badge>
              </div>
              <CardDescription>
                {loginMethod === 'credentials' 
                  ? 'Enter your email and password to access your enterprise dashboard'
                  : 'Sign in using your organization\'s identity provider'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{errors.general}</span>
                </div>
              )}

              {loginMethod === 'credentials' ? (
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@company.com"
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    {errors.password && (
                      <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    variant="default"
                    disabled={loading}
                  >
                    Sign In
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSSOLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Domain
                    </label>
                    <Input
                      type="text"
                      value={organizationDomain}
                      onChange={(e) => setOrganizationDomain(e.target.value)}
                      placeholder="company.com"
                      disabled={loading}
                    />
                    {errors.organizationDomain && (
                      <p className="text-xs text-red-600 mt-1">{errors.organizationDomain}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your organization&apos;s domain (e.g., company.com)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SSO Provider
                    </label>
                    <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => setSsoProvider('saml')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                          ssoProvider === 'saml'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        SAML 2.0
                      </button>
                      <button
                        type="button"
                        onClick={() => setSsoProvider('oidc')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-colors ${
                          ssoProvider === 'oidc'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        OIDC
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    variant="default"
                    disabled={loading}
                  >
                    Continue with SSO
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an enterprise account?{' '}
                  <Link 
                    href="/enterprise/auth/register" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <Link 
            href="/enterprise" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}