'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../../hooks/use-auth';
import { API_CONFIG, apiCall } from '../../../config/api';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
  is_active: boolean;
}

export function ApiKeysSection() {
  const { user, apiKey } = useAuth();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  console.log('ApiKeysSection - user:', user);
  console.log('ApiKeysSection - apiKey:', apiKey);

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, [apiKey]);

  const fetchApiKeys = async () => {
    if (!apiKey) return;

    try {
      setIsLoading(true);
      const response = await apiCall(API_CONFIG.ENDPOINTS.GET_API_KEYS, {}, apiKey);
      
      if (response.success) {
        // Transform the response to match our interface
        const keys = response.api_keys || [];
        const transformedKeys = keys.map((key: any) => ({
          id: key.id || `key_${Math.random()}`,
          name: key.name || 'Default API Key',
          key: key.key || key.api_key,
          created_at: key.created_at || new Date().toISOString(),
          last_used: key.last_used,
          is_active: key.is_active !== false
        }));

        // If no keys returned, create a default one from the current API key
        if (transformedKeys.length === 0 && apiKey) {
          transformedKeys.push({
            id: 'default',
            name: 'Default API Key',
            key: apiKey,
            created_at: new Date().toISOString(),
            is_active: true
          });
        }

        setApiKeys(transformedKeys);
      } else {
        // Fallback to showing the current API key
        if (apiKey) {
          setApiKeys([{
            id: 'default',
            name: 'Default API Key',
            key: apiKey,
            created_at: new Date().toISOString(),
            is_active: true
          }]);
        }
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      // Fallback to showing the current API key
      if (apiKey) {
        setApiKeys([{
          id: 'default',
          name: 'Default API Key',
          key: apiKey,
          created_at: new Date().toISOString(),
          is_active: true
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('API key copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy API key');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const createNewKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    if (!apiKey) {
      toast.error('Authentication required');
      return;
    }

    setIsCreating(true);
    
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.CREATE_API_KEY, {
        method: 'POST',
        body: JSON.stringify({
          name: newKeyName
        })
      }, apiKey);

      if (response.success) {
        const newKey: ApiKey = {
          id: response.api_key?.id || Date.now().toString(),
          name: newKeyName,
          key: response.api_key?.key || response.api_key,
          created_at: response.api_key?.created_at || new Date().toISOString(),
          is_active: true
        };

        setApiKeys(prev => [...prev, newKey]);
        setNewKeyName('');
        toast.success('New API key created successfully');
      } else {
        toast.error(response.message || 'Failed to create API key');
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteKey = async (keyId: string) => {
    const keyToDelete = apiKeys.find(key => key.id === keyId);
    if (!keyToDelete) return;

    if (apiKeys.length === 1) {
      toast.error('Cannot delete the last API key');
      return;
    }

    if (!apiKey) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.DELETE_API_KEY, {
        method: 'DELETE',
        body: JSON.stringify({
          api_key: keyToDelete.key
        })
      }, apiKey);

      if (response.success) {
        setApiKeys(prev => prev.filter(key => key.id !== keyId));
        toast.success('API key deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete API key');
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const regenerateKey = async (keyId: string) => {
    const keyToRegenerate = apiKeys.find(key => key.id === keyId);
    if (!keyToRegenerate || !apiKey) return;

    try {
      // Delete the old key
      await deleteKey(keyId);
      
      // Create a new key with the same name
      const response = await apiCall(API_CONFIG.ENDPOINTS.CREATE_API_KEY, {
        method: 'POST',
        body: JSON.stringify({
          name: keyToRegenerate.name
        })
      }, apiKey);

      if (response.success) {
        const newKey: ApiKey = {
          id: response.api_key?.id || Date.now().toString(),
          name: keyToRegenerate.name,
          key: response.api_key?.key || response.api_key,
          created_at: response.api_key?.created_at || new Date().toISOString(),
          is_active: true
        };

        setApiKeys(prev => prev.map(key => key.id === keyId ? newKey : key));
        toast.success('API key regenerated successfully');
      } else {
        toast.error(response.message || 'Failed to regenerate API key');
      }
    } catch (error) {
      console.error('Error regenerating API key:', error);
      toast.error('Failed to regenerate API key');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
            <p className="text-gray-600">Manage your API access keys for integrations</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading API keys...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600">Manage your API access keys for integrations</p>
        </div>
        <Button
          onClick={() => setNewKeyName('')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Key
        </Button>
      </div>

      {/* Create New Key Modal */}
      {newKeyName !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New API Key</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Name
              </label>
              <Input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
                className="w-full"
              />
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={createNewKey}
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Key
                  </>
                )}
              </Button>
              <Button
                onClick={() => setNewKeyName('')}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <motion.div
            key={apiKey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{apiKey.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created {new Date(apiKey.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                  {apiKey.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showKeys[apiKey.id] ? 'text' : 'password'}
                      value={apiKey.key}
                      readOnly
                      className="w-full pr-20"
                    />
                    <Button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                    >
                      {showKeys[apiKey.id] ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(apiKey.key)}
                    variant="outline"
                    size="sm"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => regenerateKey(apiKey.id)}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                {apiKeys.length > 1 && (
                  <Button
                    onClick={() => deleteKey(apiKey.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Security Notice</h4>
              <p className="text-sm text-blue-700 mt-1">
                Keep your API keys secure and never share them publicly. Each key provides full access to your knowledge graph data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 