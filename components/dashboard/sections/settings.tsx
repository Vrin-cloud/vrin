'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Trash2,
  AlertTriangle,
  User,
  Shield,
  Key,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../../hooks/use-auth';
import { API_CONFIG, apiCall } from '../../../config/api';
import toast from 'react-hot-toast';

export function SettingsSection() {
  const { user, logout } = useAuth();
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      toast.error('Please enter your password to confirm deletion');
      return;
    }

    setIsDeleting(true);

    try {
      const result = await apiCall(API_CONFIG.ENDPOINTS.DELETE_ACCOUNT, {
        method: 'DELETE',
        body: JSON.stringify({ password })
      });

      if (result.success) {
        toast.success('Account deleted successfully');
        logout();
        // Redirect to login page
        window.location.href = '/';
      } else {
        toast.error(result.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
      setPassword('');
      setShowDeleteAccount(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Account Information
        </h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-sm text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <p className="text-sm text-gray-900 font-mono">{user?.user_id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Status</label>
            <p className="text-sm text-gray-900">Active</p>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Security
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">API Key Management</h3>
              <p className="text-sm text-gray-600">Manage your API keys for integrations</p>
            </div>
            <button
              onClick={() => window.location.href = '/home?section=api-keys'}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Manage Keys →
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-lg border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Danger Zone
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-red-900">Delete Account</h3>
            <p className="text-sm text-red-700 mb-4">
              This action cannot be undone. This will permanently delete your account, 
              all API keys, and all knowledge graph data associated with your account.
            </p>
            
            {!showDeleteAccount ? (
              <button
                onClick={() => setShowDeleteAccount(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label htmlFor="delete-password" className="block text-sm font-medium text-red-900">
                    Enter your password to confirm
                  </label>
                  <input
                    id="delete-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border border-red-300 rounded-md px-3 py-2 text-sm text-red-900 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your password"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || !password.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Confirm Deletion
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowDeleteAccount(false);
                      setPassword('');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 