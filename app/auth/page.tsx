'use client';

import React, { useEffect } from 'react';
import { LoginForm } from '@/components/dashboard/auth/login-form';

export default function AuthPage() {
  useEffect(() => {
    // SECURITY FIX: Clear previous session when user visits auth page
    // This ensures no stale data persists between different users
    // Prevents cross-account data leakage vulnerability
    localStorage.removeItem('vrin_api_key');
    localStorage.removeItem('vrin_user');
    localStorage.removeItem('vrin_chat_session_id');
  }, []);

  return <LoginForm />;
} 