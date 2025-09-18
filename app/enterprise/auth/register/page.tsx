'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Database,
  Building,
  User,
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
  Shield,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const complianceFrameworks = [
  { id: 'hipaa', label: 'HIPAA', description: 'Healthcare data protection' },
  { id: 'sox', label: 'SOX', description: 'Financial reporting compliance' },
  { id: 'gdpr', label: 'GDPR', description: 'European data protection' },
  { id: 'pci_dss', label: 'PCI DSS', description: 'Payment card security' },
  { id: 'fedramp', label: 'FedRAMP', description: 'Federal cloud security' },
  { id: 'iso_27001', label: 'ISO 27001', description: 'Information security management' }
]

export default function EnterpriseRegisterPage() {
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    contactEmail: '',
    industry: '',
    organizationSize: '',
    
    // Personal Information
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    
    // Compliance Requirements
    complianceRequirements: [] as string[],
    
    // Agreement
    agreesToTerms: false,
    agreesToPrivacy: false
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { register } = useEnterpriseAuth()

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const toggleComplianceRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      complianceRequirements: prev.complianceRequirements.includes(requirement)
        ? prev.complianceRequirements.filter(r => r !== requirement)
        : [...prev.complianceRequirements, requirement]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required'
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required'
    if (!formData.organizationSize.trim()) newErrors.organizationSize = 'Organization size is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Password confirmation is required'
    
    // Email validation
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Agreement validation
    if (!formData.agreesToTerms) newErrors.agreesToTerms = 'You must agree to the terms of service'
    if (!formData.agreesToPrivacy) newErrors.agreesToPrivacy = 'You must agree to the privacy policy'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const result = await register({
        organizationName: formData.companyName,
        contactEmail: formData.contactEmail,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        industry: formData.industry,
        organizationSize: formData.organizationSize as any,
        complianceRequirements: formData.complianceRequirements
      })
      
      if (result.success) {
        toast.success('Registration successful! Please check your email for verification.')
        // Redirect to a success page or login
        window.location.href = '/enterprise/auth/login?registered=true'
      } else {
        toast.error(result.error || 'Registration failed')
        setErrors({ general: result.error || 'Registration failed' })
      }
      
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
          <h2 className="text-2xl font-semibold text-gray-900">Create Enterprise Account</h2>
          <p className="text-gray-600 mt-2">Get started with your private AI infrastructure</p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organization Information</CardTitle>
              <CardDescription>
                Tell us about your organization and infrastructure requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.general && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateField('companyName', e.target.value)}
                      placeholder="Acme Corporation"
                      disabled={loading}
                      className={errors.companyName ? 'border-red-300' : ''}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-red-600">{errors.companyName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Contact Email *
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateField('contactEmail', e.target.value)}
                      placeholder="admin@company.com"
                      disabled={loading}
                      className={errors.contactEmail ? 'border-red-300' : ''}
                    />
                    {errors.contactEmail && (
                      <p className="text-xs text-red-600">{errors.contactEmail}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select 
                      value={formData.industry} 
                      onValueChange={(value) => updateField('industry', value)}
                    >
                      <SelectTrigger className={errors.industry ? 'border-red-300' : ''}>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Financial Services</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.industry && (
                      <p className="text-xs text-red-600">{errors.industry}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationSize">Organization Size *</Label>
                    <Select 
                      value={formData.organizationSize} 
                      onValueChange={(value) => updateField('organizationSize', value)}
                    >
                      <SelectTrigger className={errors.organizationSize ? 'border-red-300' : ''}>
                        <SelectValue placeholder="Select organization size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                        <SelectItem value="sme">SME (51-500 employees)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (500+ employees)</SelectItem>
                        <SelectItem value="government">Government Agency</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.organizationSize && (
                      <p className="text-xs text-red-600">{errors.organizationSize}</p>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Administrator Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        placeholder="John"
                        disabled={loading}
                        className={errors.firstName ? 'border-red-300' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        placeholder="Doe"
                        disabled={loading}
                        className={errors.lastName ? 'border-red-300' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        placeholder="Enter secure password"
                        disabled={loading}
                        className={errors.password ? 'border-red-300' : ''}
                      />
                      {errors.password && (
                        <p className="text-xs text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                        disabled={loading}
                        className={errors.confirmPassword ? 'border-red-300' : ''}
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compliance Requirements */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Compliance Requirements
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select any compliance frameworks your organization needs to adhere to
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {complianceFrameworks.map((framework) => (
                      <div
                        key={framework.id}
                        className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={framework.id}
                          checked={formData.complianceRequirements.includes(framework.id)}
                          onCheckedChange={() => toggleComplianceRequirement(framework.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={framework.id} className="text-sm font-medium cursor-pointer">
                            {framework.label}
                          </Label>
                          <p className="text-xs text-gray-500">{framework.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms and Privacy */}
                <div className="border-t pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreesToTerms}
                        onCheckedChange={(checked) => updateField('agreesToTerms', checked)}
                        className={errors.agreesToTerms ? 'border-red-300' : ''}
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                          Terms of Service
                        </Link>
                      </Label>
                    </div>
                    {errors.agreesToTerms && (
                      <p className="text-xs text-red-600 ml-6">{errors.agreesToTerms}</p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={formData.agreesToPrivacy}
                        onCheckedChange={(checked) => updateField('agreesToPrivacy', checked)}
                        className={errors.agreesToPrivacy ? 'border-red-300' : ''}
                      />
                      <Label htmlFor="privacy" className="text-sm cursor-pointer">
                        I agree to the{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.agreesToPrivacy && (
                      <p className="text-xs text-red-600 ml-6">{errors.agreesToPrivacy}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Enterprise Account
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an enterprise account?{' '}
                  <Link 
                    href="/enterprise/auth/login" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
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