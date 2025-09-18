'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EnterpriseUser, Organization } from '@/types/enterprise';

interface EnterpriseAuthContextType {
  user: EnterpriseUser | null;
  organization: Organization | null;
  organizationId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const EnterpriseAuthContext = createContext<EnterpriseAuthContextType | undefined>(undefined);

export const useEnterpriseAuth = () => {
  const context = useContext(EnterpriseAuthContext);
  if (!context) {
    throw new Error('useEnterpriseAuth must be used within EnterpriseAuthProvider');
  }
  return context;
};

export const EnterpriseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<EnterpriseUser | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Implement login logic with your auth API
      // This is a placeholder - implement actual authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const { user, organization } = await response.json();
      setUser(user);
      setOrganization(organization);
      setOrganizationId(organization.id);
      
      // Store in localStorage for persistence
      localStorage.setItem('enterprise_auth', JSON.stringify({ user, organization }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    setOrganizationId(null);
    localStorage.removeItem('enterprise_auth');
  };

  useEffect(() => {
    // Check for existing authentication on load
    const stored = localStorage.getItem('enterprise_auth');
    if (stored) {
      try {
        const { user, organization } = JSON.parse(stored);
        setUser(user);
        setOrganization(organization);
        setOrganizationId(organization.id);
      } catch (err) {
        console.error('Failed to parse stored auth:', err);
        localStorage.removeItem('enterprise_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const value = {
    user,
    organization,
    organizationId,
    login,
    logout,
    isLoading,
    error
  };

  return (
    <EnterpriseAuthContext.Provider value={value}>
      {children}
    </EnterpriseAuthContext.Provider>
  );
};