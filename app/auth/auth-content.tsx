'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Mail, ArrowRight } from 'lucide-react';
import { useStytchB2BClient, useStytchMemberSession } from '@stytch/nextjs/b2b';
import vrinIcon from '@/app/icon.svg';

/**
 * VRIN Authentication Page Content - Custom UI with Stytch Headless SDK
 *
 * Supports return_to parameter for OAuth flows (ChatGPT, Claude Web, etc.).
 * After login, redirects to return_to or /dashboard.
 *
 * NOTE: This component must be dynamically imported with ssr: false
 * because it uses Stytch hooks that require the browser.
 */
export default function AuthContent() {
  const router = useRouter();
  const stytch = useStytchB2BClient();
  const { session, isInitialized } = useStytchMemberSession();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Read return_to from URL search params (set by OAuth authorize page)
  const returnTo = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('return_to')
    : null;

  // Persist return_to in localStorage so it survives the Stytch redirect chain.
  // We can't put it in the redirect URL because Stytch validates query params
  // against the exact URLs registered in the dashboard.
  useEffect(() => {
    if (returnTo) {
      localStorage.setItem('oauth_return_to', returnTo);
    }
  }, [returnTo]);

  // Discovery redirect URL — must be a clean URL matching the Stytch dashboard exactly.
  // No query params allowed (Stytch rejects unregistered query param patterns).
  const discoveryRedirectURL = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/authenticate`
    : '/auth/authenticate';

  // Redirect if already authenticated with VRIN credentials
  useEffect(() => {
    if (isInitialized && session) {
      const vrinApiKey = localStorage.getItem('vrin_api_key');
      const vrinUser = localStorage.getItem('vrin_user');

      if (vrinApiKey && vrinUser) {
        const destination = returnTo || '/dashboard';
        console.log(`[Auth] Already authenticated, redirecting to ${destination}`);
        router.replace(destination);
      } else if (returnTo) {
        // Has Stytch session but no VRIN credentials — for OAuth flow,
        // the session is enough, redirect back to authorize page
        console.log('[Auth] Stytch session active, redirecting to OAuth authorize');
        router.replace(returnTo);
      } else {
        console.log('[Auth] Stytch session exists but no VRIN credentials, staying on auth page');
      }
    }
  }, [isInitialized, session, router, returnTo]);

  // Handle email magic link
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stytch || !email) return;

    setIsLoading(true);
    setError('');

    try {
      if (showPasswordField && password) {
        // Password authentication
        await stytch.passwords.authenticate({
          organization_id: '', // Discovery flow doesn't need this
          email_address: email,
          password: password,
          session_duration_minutes: 60,
        });
        router.replace(returnTo || '/dashboard');
      } else {
        // Send magic link — return_to is persisted in localStorage above
        await stytch.magicLinks.email.discovery.send({
          email_address: email,
          discovery_redirect_url: discoveryRedirectURL,
        });
        setMagicLinkSent(true);
      }
    } catch (err: any) {
      console.error('[Auth] Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    if (!stytch) {
      console.error('[Auth] Stytch client not available');
      return;
    }

    setIsGoogleLoading(true);
    setError('');

    try {
      console.log('[Auth] Starting Google OAuth...');
      await stytch.oauth.google.discovery.start({
        discovery_redirect_url: discoveryRedirectURL,
      });
    } catch (err: any) {
      console.error('[Auth] Google OAuth error:', err);
      setError(err.message || 'Failed to start Google sign-in.');
      setIsGoogleLoading(false);
    }
  };

  // Show loading while Stytch initializes
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Check if Stytch is configured
  const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;
  const isConfigured = !!(publicToken && !publicToken.includes('REPLACE_WITH'));

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Not Configured
          </h1>
          <p className="text-gray-600 mb-6">
            Please configure NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN in environment variables.
          </p>
        </div>
      </div>
    );
  }

  // Magic link sent confirmation
  if (magicLinkSent) {
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
              <Image
                src={vrinIcon}
                alt="VRiN Icon"
                width={56}
                height={56}
                unoptimized
              />
              <Image
                src="/og-image.png"
                alt="VRiN"
                width={160}
                height={53}
                priority
              />
            </div>
            <p className="text-gray-600 text-lg">
              AI Deep Reasoning and Action Engine
            </p>
          </motion.div>
        </div>

        {/* Right Panel - Confirmation */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Check your email
            </h1>
            <p className="text-gray-600 mb-6">
              We sent a magic link to <span className="font-medium text-gray-900">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Click the link in the email to sign in. The link expires in 10 minutes.
            </p>
            <button
              onClick={() => {
                setMagicLinkSent(false);
                setEmail('');
              }}
              className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
            >
              Use a different email
            </button>
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
            <Image
              src={vrinIcon}
              alt="VRiN Icon"
              width={56}
              height={56}
              unoptimized
            />
            <Image
              src="/og-image.png"
              alt="VRiN"
              width={160}
              height={53}
              priority
            />
          </div>
          <p className="text-gray-600 text-lg">
            AI Deep Reasoning and Action Engine
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src={vrinIcon}
                alt="VRiN"
                width={48}
                height={48}
                unoptimized
              />
              <Image
                src="/og-image.png"
                alt="VRiN"
                width={120}
                height={40}
                priority
              />
            </div>
            <p className="text-gray-600">
              AI Deep Reasoning and Action Engine
            </p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Sign in to VRIN
            </h1>
            <p className="text-gray-600 mt-2">
              Enter your email to get started
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || !stytch}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Password Input (conditional) */}
              {showPasswordField && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  />
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !stytch}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {showPasswordField ? 'Sign in' : 'Continue with email'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle password option */}
          <button
            onClick={() => setShowPasswordField(!showPasswordField)}
            className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {showPasswordField ? 'Use magic link instead' : 'Use a password instead'}
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-gray-700 hover:text-gray-900 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-gray-700 hover:text-gray-900 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
