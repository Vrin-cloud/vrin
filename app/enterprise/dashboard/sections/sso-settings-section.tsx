'use client';

/**
 * SSO & Security Settings Section
 *
 * Uses Stytch Admin Portal components for self-service:
 *   - SSO (SAML/OIDC) configuration
 *   - Organization auth settings (MFA, JIT provisioning)
 *
 * These are embeddable React components from @stytch/nextjs/b2b/adminPortal
 * that Stytch hosts and manages — no backend code needed.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Lock, Globe } from 'lucide-react';

// Note: The AdminPortal components require @stytch/nextjs >= 18.0.0
// and are only available when the Stytch session is active.
// We dynamic-import them to avoid SSR issues and provide fallbacks.

let AdminPortalSSO: React.ComponentType | null = null;
let AdminPortalOrgSettings: React.ComponentType | null = null;

try {
  // These imports may not be available in all environments
  const adminPortal = require('@stytch/nextjs/b2b/adminPortal');
  AdminPortalSSO = adminPortal.AdminPortalSSO;
  AdminPortalOrgSettings = adminPortal.AdminPortalOrgSettings;
} catch {
  // Will show manual configuration fallback
}

export default function SSOSettingsSection() {
  const [activeTab, setActiveTab] = useState<'sso' | 'org-settings'>('sso');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">SSO & Security</h2>
        <p className="text-gray-600 mt-1">
          Configure Single Sign-On, authentication policies, and security settings for your organization.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'sso'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('sso')}
        >
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>SSO Configuration</span>
          </div>
        </button>
        <button
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'org-settings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('org-settings')}
        >
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Auth Settings</span>
          </div>
        </button>
      </div>

      {/* SSO Tab */}
      {activeTab === 'sso' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span>Single Sign-On (SSO)</span>
              <Badge variant="secondary" className="ml-2">Enterprise</Badge>
            </CardTitle>
            <CardDescription>
              Connect your identity provider (Okta, Azure AD, Google Workspace) for seamless team access.
              Your team members can sign in using their existing corporate credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {AdminPortalSSO ? (
              <div className="min-h-[400px]">
                <AdminPortalSSO />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">SSO Configuration</h3>
                <p className="text-sm max-w-md mx-auto">
                  SSO configuration is available through the Stytch Admin Portal.
                  Contact your administrator to enable SSO for your organization.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Org Settings Tab */}
      {activeTab === 'org-settings' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              <span>Authentication Settings</span>
            </CardTitle>
            <CardDescription>
              Configure authentication policies for your organization: allowed auth methods,
              MFA requirements, JIT provisioning, and email domain restrictions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {AdminPortalOrgSettings ? (
              <div className="min-h-[400px]">
                <AdminPortalOrgSettings />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Key className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Organization Settings</h3>
                <p className="text-sm max-w-md mx-auto">
                  Organization authentication settings are available through the Stytch Admin Portal.
                  These include MFA policies, allowed auth methods, and domain restrictions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Enterprise Security</h4>
              <p className="text-sm text-blue-700 mt-1">
                VRIN uses Stytch B2B for enterprise authentication. Stytch is SOC 2 Type II certified,
                GDPR compliant, and provides RS256-signed JWTs for session management.
                Your documents and knowledge graphs never leave your cloud — only authentication
                identity data is stored by Stytch.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
