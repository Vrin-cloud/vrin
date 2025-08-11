'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  Activity,
  Settings,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Folder,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { AuthService } from '../../../lib/services/vrin-service';

interface ApiKey {
  api_key: string;
  user_id: string;
  created_at: string;
  last_used?: string;
  project_name?: string;
  usage_count?: number;
}

export function ModernApiKeysSection() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const authService = new AuthService();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiKey = authService.getStoredApiKey();
      if (!apiKey) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/auth/api-keys', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setApiKeys(data.api_keys || []);
      } else {
        throw new Error(data.error || 'Failed to fetch API keys');
      }
    } catch (err: any) {
      console.error('Failed to fetch API keys:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newProjectName.trim()) {
      setError('Project name is required');
      return;
    }

    setIsCreating(true);
    setError(null);
    
    try {
      const apiKey = authService.getStoredApiKey();
      if (!apiKey) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/auth/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ project_name: newProjectName.trim() })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(`API key created for project "${newProjectName}"`);
        setNewProjectName('');
        setShowCreateModal(false);
        await fetchApiKeys();
      } else {
        throw new Error(data.error || 'Failed to create API key');
      }
    } catch (err: any) {
      console.error('Failed to create API key:', err);
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 8)}${'•'.repeat(8)}${key.substring(key.length - 4)}`;
  };

  const getProjectColor = (projectName: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
      'from-red-500 to-red-600'
    ];
    
    let hash = 0;
    for (let i = 0; i < projectName.length; i++) {
      hash = projectName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Keys</h2>
          <p className="text-gray-600 mt-1">Manage your VRIN API access tokens and projects</p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            onClick={fetchApiKeys}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
          
          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New API Key
          </motion.button>
        </div>
      </div>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-green-700">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Keys List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-3"></div>
            <span className="text-gray-600">Loading API keys...</span>
          </div>
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No API Keys</h3>
          <p className="text-gray-600 mb-6">Create your first API key to start using the VRIN API</p>
          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium"
          >
            Create API Key
          </motion.button>
        </div>
      ) : (
        <div className="grid gap-4">
          {apiKeys.map((key, index) => (
            <motion.div
              key={key.api_key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Project Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getProjectColor(key.project_name || 'Default')} rounded-xl flex items-center justify-center`}>
                      <Folder className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{key.project_name || 'Default Project'}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {formatDate(key.created_at)}</span>
                        </div>
                        {key.last_used && (
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            <span>Last used {formatDate(key.last_used)}</span>
                          </div>
                        )}
                        {key.usage_count && (
                          <div className="flex items-center gap-1">
                            <span>{key.usage_count} requests</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* API Key */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                          API Key
                        </label>
                        <code className="text-sm font-mono text-gray-900">
                          {visibleKeys.has(key.api_key) ? key.api_key : maskApiKey(key.api_key)}
                        </code>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <motion.button
                          onClick={() => toggleKeyVisibility(key.api_key)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                          title={visibleKeys.has(key.api_key) ? 'Hide API key' : 'Show API key'}
                        >
                          {visibleKeys.has(key.api_key) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </motion.button>
                        
                        <motion.button
                          onClick={() => copyToClipboard(key.api_key, key.api_key)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Copy API key"
                        >
                          {copiedKey === key.api_key ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Active</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {key.user_id?.substring(0, 8) || 'N/A'}...
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete API key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* SDK Integration Examples */}
      {apiKeys.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Install VRIN SDK</h4>
              <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
                pip install vrin==0.3.2
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Initialize Client</h4>
              <div className="bg-gray-900 text-white rounded-lg p-4 font-mono text-sm">
                <pre className="whitespace-pre text-sm">
                  <code>
                    <span className="text-gray-500"># Python</span>
                    {'\n'}<span className="text-blue-400">from</span> <span className="text-yellow-400">vrin</span> <span className="text-blue-400">import</span> <span className="text-yellow-400">VRINClient</span>
                    {'\n'}
                    {'\n'}<span className="text-yellow-400">client</span> <span className="text-white">=</span> <span className="text-yellow-400">VRINClient</span><span className="text-white">(</span><span className="text-green-400">api_key</span><span className="text-white">=</span><span className="text-red-400">&quot;your_api_key&quot;</span><span className="text-white">)</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
            <ExternalLink className="w-4 h-4" />
            <button 
              onClick={() => window.location.href = '/dashboard?tab=api-docs'}
              className="hover:underline"
            >
              View full documentation
            </button>
          </div>
        </div>
      )}

      {/* Create API Key Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create New API Key</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name (e.g., 'Healthcare AI', 'Legal Assistant')"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will help you organize your knowledge graphs by project
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={() => setShowCreateModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    onClick={handleCreateApiKey}
                    disabled={isCreating || !newProjectName.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        Create Key
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}