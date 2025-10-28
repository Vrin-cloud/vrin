'use client';

/**
 * Enterprise Registration Page - Modern Design with Google OAuth
 *
 * Features:
 * - Organization and user registration
 * - Google OAuth integration
 * - Form validation with real-time feedback
 * - Password strength indicator
 * - Modern glassmorphism design
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Database,
  Building2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
} from 'lucide-react';

export default function EnterpriseRegisterPage() {
  const router = useRouter();

  // Form state
  const [step, setStep] = useState<'organization' | 'user'>('organization');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationDomain, setOrganizationDomain] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/\d/.test(pwd)) strength += 12.5;
    if (/[^a-zA-Z\d]/.test(pwd)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(password);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  // Validate email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle Google OAuth registration
  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const response = await fetch('https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod/enterprise/auth/google/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'register' }),
      });

      const data = await response.json();

      if (data.success && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setError('Google sign-up is temporarily unavailable');
        setGoogleLoading(false);
      }
    } catch (err) {
      setError('Failed to initialize Google sign-up');
      setGoogleLoading(false);
    }
  };

  // Validate organization step
  const validateOrganizationStep = (): boolean => {
    if (!organizationName.trim()) {
      setError('Organization name is required');
      return false;
    }
    if (!organizationDomain.trim()) {
      setError('Organization domain is required');
      return false;
    }
    if (!industry) {
      setError('Please select an industry');
      return false;
    }
    if (!companySize) {
      setError('Please select company size');
      return false;
    }
    return true;
  };

  // Validate user step
  const validateUserStep = (): boolean => {
    if (!firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  // Handle organization step submission
  const handleOrganizationNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (validateOrganizationStep()) {
      setStep('user');
    }
  };

  // Handle final registration submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateUserStep()) return;

    setLoading(true);

    try {
      // Step 1: Create organization
      const orgResponse = await fetch('https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod/enterprise/organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: organizationName,
          domain: organizationDomain,
          contact_email: email,
          industry: industry,
          size: companySize,
        }),
      });

      const orgData = await orgResponse.json();

      if (!orgResponse.ok || !orgData.success) {
        setError(orgData.error || 'Failed to create organization');
        setLoading(false);
        return;
      }

      const organizationId = orgData.organization_id;

      // Step 2: Create user
      const userResponse = await fetch('https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod/enterprise/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization_id: organizationId,
          email: email,
          first_name: firstName,
          last_name: lastName,
          password: password,
          role: 'admin', // First user is always admin
        }),
      });

      const userData = await userResponse.json();

      if (!userResponse.ok || !userData.success) {
        setError(userData.error || 'Failed to create user account');
        setLoading(false);
        return;
      }

      // Success!
      setSuccess(true);

      // Redirect to login
      setTimeout(() => {
        router.push('/enterprise/auth/login?registered=true');
      }, 2000);
    } catch (err: any) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Enterprise Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'organization'
              ? 'Tell us about your organization'
              : 'Set up your admin account'
            }
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-6 flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'organization'
                ? 'bg-indigo-600 text-white'
                : 'bg-green-600 text-white'
            }`}>
              {step === 'user' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Organization</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Account</span>
          </div>
        </div>

        {/* Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start text-green-700 dark:text-green-400"
              >
                <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Account created successfully!</p>
                  <p className="text-sm mt-1">Redirecting to login...</p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-700 dark:text-red-400"
              >
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {step === 'organization' && (
              <>
                {/* Google Sign Up Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-6 h-12 text-gray-700 dark:text-gray-300 border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={handleGoogleRegister}
                  disabled={googleLoading || loading}
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400">
                    Or register with email
                  </span>
                </div>

                {/* Organization Form */}
                <form onSubmit={handleOrganizationNext} className="space-y-5">
                  <div>
                    <Label htmlFor="orgName" className="text-gray-700 dark:text-gray-300 font-medium">
                      Organization Name
                    </Label>
                    <div className="relative mt-2">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="orgName"
                        type="text"
                        placeholder="Acme Corporation"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="orgDomain" className="text-gray-700 dark:text-gray-300 font-medium">
                      Organization Domain
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="orgDomain"
                        type="text"
                        placeholder="acme.com"
                        value={organizationDomain}
                        onChange={(e) => setOrganizationDomain(e.target.value)}
                        className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        disabled={loading || googleLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="industry" className="text-gray-700 dark:text-gray-300 font-medium">
                      Industry
                    </Label>
                    <Select value={industry} onValueChange={setIndustry} disabled={loading || googleLoading}>
                      <SelectTrigger className="mt-2 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="companySize" className="text-gray-700 dark:text-gray-300 font-medium">
                      Company Size
                    </Label>
                    <Select value={companySize} onValueChange={setCompanySize} disabled={loading || googleLoading}>
                      <SelectTrigger className="mt-2 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">1-10 employees</SelectItem>
                        <SelectItem value="sme">11-100 employees</SelectItem>
                        <SelectItem value="enterprise">101-1000 employees</SelectItem>
                        <SelectItem value="large">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                    disabled={loading || googleLoading}
                  >
                    Continue
                  </Button>
                </form>
              </>
            )}

            {step === 'user' && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium">
                      First Name
                    </Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-2 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                    Email Address
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@acme.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
                        <span className={`font-medium ${
                          passwordStrength < 40 ? 'text-red-600' :
                          passwordStrength < 70 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <Progress value={passwordStrength} className="h-2" />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      disabled={loading}
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-relaxed"
                  >
                    I agree to the{' '}
                    <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => setStep('organization')}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/enterprise/auth/login"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/enterprise" className="hover:text-gray-900 dark:hover:text-gray-200">
              Home
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-900 dark:hover:text-gray-200">
              Terms
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-gray-900 dark:hover:text-gray-200">
              Help
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
