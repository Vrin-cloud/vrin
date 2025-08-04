'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API_CONFIG, apiCall } from '../config/api';

interface User {
  user_id: string;
  email: string;
  api_key: string;
  token: string;
  is_verified?: boolean;
}

interface SignupResponse {
  success: boolean;
  user_id: string;
  api_key: string;
  email: string;
  token: string;
  is_verified?: boolean;
  verification_token?: string;
  message: string;
}

interface LoginResponse {
  success: boolean;
  user_id: string;
  api_key: string;
  email: string;
  token: string;
  is_verified: boolean;
  message: string;
}

interface AuthState {
  user: User | null;
  apiKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'vrin_auth';

// Load auth state from localStorage
const loadAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      apiKey: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Raw stored data:', parsed);
      
      // Check if we have valid authentication data
      const hasValidUser = parsed.user && parsed.user.user_id && parsed.user.email;
      const hasValidApiKey = parsed.apiKey && typeof parsed.apiKey === 'string' && parsed.apiKey.startsWith('vrin_');
      
      const authState = {
        user: hasValidUser ? parsed.user : null,
        apiKey: hasValidApiKey ? parsed.apiKey : null,
        isAuthenticated: hasValidUser && hasValidApiKey,
        isLoading: false,
      };
      
      console.log('Loaded auth state from localStorage:', authState);
      console.log('isAuthenticated calculation:', { hasValidUser, hasValidApiKey, isAuthenticated: authState.isAuthenticated });
      return authState;
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }

  return {
    user: null,
    apiKey: null,
    isAuthenticated: false,
    isLoading: false,
  };
};

// Save auth state to localStorage
const saveAuthState = (state: AuthState) => {
  if (typeof window === 'undefined') return;

  try {
    const dataToSave = {
      user: state.user,
      apiKey: state.apiKey,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('Saved auth state to localStorage:', dataToSave);
  } catch (error) {
    console.error('Failed to save auth state:', error);
  }
};

// Signup function
const signupUser = async (credentials: { email: string; password: string }): Promise<SignupResponse> => {
  return await apiCall(API_CONFIG.ENDPOINTS.SIGNUP, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// Login function
const loginUser = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  return await apiCall(API_CONFIG.ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize with default state (will be updated on client-side)
    return {
      user: null,
      apiKey: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true
    };
  });

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Load auth state on client-side mount
  useEffect(() => {
    const stored = loadAuthState();
    console.log('Loading auth state from localStorage:', stored);
    
    if (stored.isAuthenticated && stored.apiKey) {
      // Update global API key if we have stored credentials
      API_CONFIG.API_KEY = stored.apiKey;
      console.log('Setting API key from localStorage:', stored.apiKey);
    }
    
    const newState = {
      ...stored,
      isLoading: false,
    };
    
    setAuthState(newState);
    console.log('Auth state set to:', newState);
    console.log('isAuthenticated:', newState.isAuthenticated, 'user:', newState.user);
  }, []);

  // Signup function
  const handleSignup = async (credentials: { email: string; password: string }) => {
    setIsSigningUp(true);
    setSignupError(null);
    try {
      console.log('Starting signup...');
      const data = await signupUser(credentials);
      console.log('Signup successful:', data);
      
      if (data.success) {
        // AUTO-AUTHENTICATE: New users are auto-verified and authenticated immediately
        if (data.is_verified) {
          const newState: AuthState = {
            user: {
              user_id: data.user_id,
              email: data.email,
              api_key: data.api_key,
              token: data.token || '',
              is_verified: data.is_verified,
            },
            apiKey: data.api_key,
            isAuthenticated: true,
            isLoading: false,
          };
          
          console.log('Setting new auth state for auto-verified user:', newState);
          
          // Update the global API key first
          API_CONFIG.API_KEY = data.api_key;
          
          // Save to localStorage
          saveAuthState(newState);
          
          // Update state immediately
          setAuthState(newState);
          console.log('Auth state updated after signup:', newState);
          
          // Force immediate re-render
          setAuthState(prevState => {
            console.log('Forcing immediate auth state refresh after signup...');
            return { ...newState };
          });
        }
        
        return data;
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setSignupError(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setIsSigningUp(false);
    }
  };

  // Login function
  const handleLogin = async (credentials: { email: string; password: string }) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      console.log('Starting login...');
      const data = await loginUser(credentials);
      console.log('Login successful:', data);
      
      if (data.success && data.is_verified) {
        const newState: AuthState = {
          user: {
            user_id: data.user_id,
            email: data.email,
            api_key: data.api_key,
            token: data.token,
            is_verified: data.is_verified,
          },
          apiKey: data.api_key,
          isAuthenticated: true,
          isLoading: false,
        };
        
        console.log('Setting new auth state:', newState);
        
        // Update the global API key first
        API_CONFIG.API_KEY = data.api_key;
        
        // Save to localStorage
        saveAuthState(newState);
        
        // Update state immediately
        setAuthState(newState);
        console.log('Auth state updated after login:', newState);
        
        // Force immediate re-render
        setAuthState(prevState => {
          console.log('Forcing immediate auth state refresh...');
          return { ...newState };
        });
        
        return data;
      } else if (data.success && !data.is_verified) {
        throw new Error('Please verify your email before logging in');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout function
  const logout = () => {
    const newState: AuthState = {
      user: null,
      apiKey: null,
      isAuthenticated: false,
      isLoading: false,
    };
    
    setAuthState(newState);
    saveAuthState(newState);
    
    // Clear the global API key
    API_CONFIG.API_KEY = '';
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Check health status
  const checkHealth = async () => {
    try {
      await apiCall(API_CONFIG.ENDPOINTS.HEALTH);
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  };

  return {
    // State
    user: authState.user,
    apiKey: authState.apiKey,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    
    // Actions
    signup: handleSignup,
    login: handleLogin,
    logout,
    checkHealth,
    
    // Loading states
    isSigningUp,
    isLoggingIn,
    signupError,
    loginError,
  };
} 