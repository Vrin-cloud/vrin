'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  XCircle,
  Loader2,
  UserPlus,
  Mail,
  Lock,
  User,
  Building2,
  Shield,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'

const ENTERPRISE_PORTAL_API = 'https://6xjf0e7djg.execute-api.us-east-1.amazonaws.com/dev'

interface InvitationDetails {
  invitation_id: string
  email: string
  organization_id: string
  organization_name: string
  role: string
  clearance_level?: string
  department?: string
  team?: string
  expires_at: number
}

function AcceptInvitationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptingInvitation, setAcceptingInvitation] = useState(false)

  useEffect(() => {
    if (token) {
      validateToken(token)
    } else {
      setValidatingToken(false)
      setErrorMessage('No invitation token provided')
    }
  }, [token])

  const validateToken = async (invitationToken: string) => {
    try {
      const response = await fetch(
        `${ENTERPRISE_PORTAL_API}/enterprise/users/invite/validate?token=${invitationToken}`
      )

      const data = await response.json()

      if (response.ok && data.valid) {
        setTokenValid(true)
        setInvitation(data.invitation)
      } else {
        setTokenValid(false)
        setErrorMessage(data.error || 'Invalid or expired invitation token')
      }
    } catch (error) {
      console.error('Error validating token:', error)
      setTokenValid(false)
      setErrorMessage('Failed to validate invitation. Please try again.')
    } finally {
      setValidatingToken(false)
    }
  }

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Please enter your first and last name')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setAcceptingInvitation(true)

    try {
      const response = await fetch(
        `${ENTERPRISE_PORTAL_API}/enterprise/users/invite/accept`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token,
            first_name: firstName,
            last_name: lastName,
            password: password
          })
        }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        // Store auth token
        if (data.token) {
          localStorage.setItem('enterprise_token', data.token)
        }

        toast.success('Welcome to the team! Redirecting to dashboard...')

        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push('/enterprise/dashboard')
        }, 1500)
      } else {
        toast.error(data.error || 'Failed to accept invitation')
      }
    } catch (error) {
      console.error('Error accepting invitation:', error)
      toast.error('Failed to accept invitation. Please try again.')
    } finally {
      setAcceptingInvitation(false)
    }
  }

  // Loading state
  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600 text-lg">Validating invitation...</p>
        </div>
      </div>
    )
  }

  // Invalid token state
  if (!tokenValid || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border-red-200 bg-white shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-red-900">Invalid Invitation</CardTitle>
                  <CardDescription className="text-red-700">
                    This invitation link is not valid
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-semibold">Possible reasons:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>The invitation has expired (valid for 14 days)</li>
                  <li>The invitation has already been used</li>
                  <li>The invitation was revoked by an administrator</li>
                  <li>The link was copied incorrectly</li>
                </ul>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">
                  Please contact your organization administrator for a new invitation.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/enterprise/auth/login')}
                >
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Valid invitation - show registration form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <Image
            src="/og-image.png"
            alt="VRiN"
            width={120}
            height={42}
            className="mx-auto mb-4"
            priority
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Join Your Team
          </h1>
          <p className="text-gray-600">
            You&apos;ve been invited to join <strong>{invitation.organization_name}</strong>
          </p>
        </div>

        <Card className="border-blue-200 bg-white shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-gray-900">Invitation Details</CardTitle>
                <CardDescription>
                  Complete your profile to accept this invitation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Invitation Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{invitation.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Organization</p>
                    <p className="font-medium text-gray-900">{invitation.organization_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Role</p>
                    <Badge variant="outline" className="capitalize">
                      {invitation.role}
                    </Badge>
                  </div>
                </div>
                {invitation.clearance_level && (
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Clearance Level</p>
                      <Badge variant="outline" className="capitalize">
                        {invitation.clearance_level.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleAcceptInvitation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">Passwords do not match</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900">
                  By accepting this invitation, you agree to join{' '}
                  <strong>{invitation.organization_name}</strong> and comply with their
                  policies and guidelines.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push('/enterprise/auth/login')}
                  disabled={acceptingInvitation}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={acceptingInvitation || password !== confirmPassword}
                >
                  {acceptingInvitation ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept & Join
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a
            href="/enterprise/auth/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  )
}
