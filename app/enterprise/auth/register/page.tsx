'use client';

/**
 * Enterprise Registration Page — Stytch B2B
 *
 * Matches the individual user auth page design (split-panel layout).
 *
 * Two-step registration:
 *   1. Organization info (name, domain, industry, size)
 *   2. Admin account — choose Google OAuth OR email/password
 *
 * Google OAuth flow:
 *   - Saves org info to sessionStorage
 *   - Starts Stytch discovery OAuth
 *   - Redirects to /enterprise/auth/authenticate which:
 *     a. Creates Stytch org from discovery intermediate session
 *     b. Calls backend to create VRIN DynamoDB records
 *     c. Redirects to dashboard
 *
 * Password flow:
 *   - Calls backend /enterprise/auth/register directly
 *   - Backend creates Stytch org + member + VRIN records
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useStytchB2BClient } from '@stytch/nextjs/b2b';
import {
  Loader2,
  Building2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import vrinIcon from '@/app/icon.svg';

export default function EnterpriseRegisterPage() {
  const router = useRouter();
  const stytch = useStytchB2BClient();

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const discoveryRedirectURL = typeof window !== 'undefined'
    ? `${window.location.origin}/enterprise/auth/authenticate`
    : '/enterprise/auth/authenticate';

  // Password strength
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

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Handle Google OAuth — save org info to sessionStorage, then start discovery
  const handleGoogleRegister = async () => {
    if (!stytch) return;

    setIsGoogleLoading(true);
    setError('');

    // Save org info so the authenticate page can use it after OAuth callback
    sessionStorage.setItem('enterprise_register_org_info', JSON.stringify({
      organizationName,
      organizationDomain,
      industry,
      companySize,
    }));

    try {
      await stytch.oauth.google.discovery.start({
        discovery_redirect_url: discoveryRedirectURL,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to start Google sign-up.');
      setIsGoogleLoading(false);
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

  const handleOrganizationNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (validateOrganizationStep()) {
      setStep('user');
    }
  };

  // Handle password registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateUserStep()) return;

    setLoading(true);

    try {
      const response = await fetch(
        '/api/auth/stytch/enterprise-register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationName,
            organizationDomain,
            contactEmail: email,
            firstName,
            lastName,
            password,
            industry,
            organizationSize: companySize,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.session_token) {
          document.cookie = `stytch_session=${data.session_token}; path=/; max-age=${24 * 60 * 60}; samesite=lax`;
        }
        if (data.session_jwt) {
          document.cookie = `stytch_session_jwt=${data.session_jwt}; path=/; max-age=${24 * 60 * 60}; samesite=lax`;
        }
        if (data.user) {
          localStorage.setItem('enterprise_user', JSON.stringify(data.user));
        }
        if (data.session_jwt) {
          localStorage.setItem('enterprise_token', data.session_jwt);
        }

        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/enterprise/dashboard';
        }, 1500);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-white flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Image src={vrinIcon} alt="VRiN Icon" width={56} height={56} unoptimized />
              <Image src="/og-image.png" alt="VRiN" width={160} height={53} priority />
            </div>
            <p className="text-gray-600 text-lg">Enterprise Knowledge Platform</p>
          </motion.div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Account created!</h1>
            <p className="text-gray-600 mb-6">
              Your enterprise organization has been set up successfully.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image src={vrinIcon} alt="VRiN Icon" width={56} height={56} unoptimized />
            <Image src="/og-image.png" alt="VRiN" width={160} height={53} priority />
          </div>
          <p className="text-gray-600 text-lg">Enterprise Knowledge Platform</p>
        </motion.div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src={vrinIcon} alt="VRiN" width={48} height={48} unoptimized />
              <Image src="/og-image.png" alt="VRiN" width={120} height={40} priority />
            </div>
            <p className="text-gray-600">Enterprise Knowledge Platform</p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Enterprise</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
            <p className="text-gray-600 mt-2">
              {step === 'organization'
                ? 'Tell us about your organization'
                : 'Set up your admin account'
              }
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'organization'
                  ? 'bg-gray-900 text-white'
                  : 'bg-green-600 text-white'
              }`}>
                {step === 'user' ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-sm text-gray-600">Organization</span>
            </div>
            <div className="w-12 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="text-sm text-gray-600">Account</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ── Step 1: Organization Info ── */}
          {step === 'organization' && (
            <form onSubmit={handleOrganizationNext}>
              <div className="space-y-4">
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Organization name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                />

                <input
                  type="text"
                  value={organizationDomain}
                  onChange={(e) => setOrganizationDomain(e.target.value)}
                  placeholder="Company domain (e.g. acme.com)"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                />

                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all text-gray-900 appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat"
                  style={!industry ? { color: '#9ca3af' } : {}}
                >
                  <option value="" disabled>Select your industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="education">Education</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all text-gray-900 appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat"
                  style={!companySize ? { color: '#9ca3af' } : {}}
                >
                  <option value="" disabled>Select company size</option>
                  <option value="startup">1-10 employees</option>
                  <option value="sme">11-100 employees</option>
                  <option value="enterprise">101-1000 employees</option>
                  <option value="large">1000+ employees</option>
                </select>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ── Step 2: Admin Account (Google OAuth OR Password) ── */}
          {step === 'user' && (
            <>
              {/* Google Sign Up */}
              <button
                onClick={handleGoogleRegister}
                disabled={isGoogleLoading || !stytch}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="font-medium text-gray-700">Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or create with password</span>
                </div>
              </div>

              {/* Password Form */}
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400 disabled:opacity-50"
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400 disabled:opacity-50"
                    />
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email (e.g. john@acme.com)"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400 disabled:opacity-50"
                  />

                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400 disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Password strength</span>
                          <span className={`font-medium ${
                            passwordStrength < 40 ? 'text-red-600' :
                            passwordStrength < 70 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400 disabled:opacity-50"
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-500 leading-relaxed">
                      I agree to the{' '}
                      <a href="/terms" className="text-gray-700 hover:text-gray-900 underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-gray-700 hover:text-gray-900 underline">Privacy Policy</a>
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep('organization'); setError(''); }}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Create account'
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Back link (for Google users who don't want password) */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => { setStep('organization'); setError(''); }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
                >
                  Back to organization details
                </button>
              </div>
            </>
          )}

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an enterprise account?{' '}
              <Link href="/enterprise/auth/login" className="text-gray-700 hover:text-gray-900 font-semibold underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-gray-700 hover:text-gray-900 underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-gray-700 hover:text-gray-900 underline">Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
