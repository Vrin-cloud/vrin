// UsageDisplay component for showing plan usage and limits
// Shows progress bars for uploads, API requests, and storage

'use client'

import React, { useState, useEffect } from 'react';
import { Upload, MessageSquare, HardDrive, Sparkles, TrendingUp } from 'lucide-react';

interface UsageData {
  plan: string;
  uploads: {
    used: number;
    limit: number | null;
    remaining: number | null;
    percentage: number;
  };
  api_requests: {
    used: number;
    limit: number | null;
    remaining: number | null;
    percentage: number;
  };
  storage: {
    used_bytes: number;
    limit_bytes: number | null;
    remaining_bytes: number | null;
    percentage: number;
  };
  allowed_models: string[];
  features: Record<string, boolean>;
}

interface UsageDisplayProps {
  apiKey: string;
  compact?: boolean;  // Compact version for sidebar
}

// Format bytes to human-readable string
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Get plan display name and color
function getPlanDisplay(plan: string): { name: string; color: string; bgColor: string } {
  const plans: Record<string, { name: string; color: string; bgColor: string }> = {
    free: { name: 'Free', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    pro: { name: 'Pro', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    team: { name: 'Team', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    enterprise: { name: 'Enterprise', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  };
  return plans[plan] || plans.free;
}

// Progress bar component
function ProgressBar({ percentage, color = 'blue' }: { percentage: number; color?: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  // Color based on percentage
  let barColor = colorClasses[color];
  if (percentage >= 90) barColor = colorClasses.red;
  else if (percentage >= 75) barColor = colorClasses.amber;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

export function UsageDisplay({ apiKey, compact = false }: UsageDisplayProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) return;

    const fetchUsage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/limits', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUsage(data);
          } else {
            setError('Failed to load usage data');
          }
        } else {
          setError('Failed to fetch usage');
        }
      } catch (err) {
        console.error('Error fetching usage:', err);
        setError('Error loading usage');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, [apiKey]);

  if (isLoading) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-white rounded-xl border border-gray-200`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !usage) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-white rounded-xl border border-gray-200`}>
        <p className="text-sm text-gray-500">{error || 'Unable to load usage'}</p>
      </div>
    );
  }

  const planDisplay = getPlanDisplay(usage.plan);

  if (compact) {
    // Compact version for sidebar
    return (
      <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Usage</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planDisplay.bgColor} ${planDisplay.color}`}>
            {planDisplay.name}
          </span>
        </div>

        {/* Uploads */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 flex items-center gap-1">
              <Upload className="w-3 h-3" />
              Uploads
            </span>
            <span className="text-gray-500">
              {usage.uploads.used}/{usage.uploads.limit ?? '∞'}
            </span>
          </div>
          <ProgressBar percentage={usage.uploads.percentage} color="blue" />
        </div>

        {/* API Requests */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Queries
            </span>
            <span className="text-gray-500">
              {usage.api_requests.used}/{usage.api_requests.limit ?? '∞'}
            </span>
          </div>
          <ProgressBar percentage={usage.api_requests.percentage} color="purple" />
        </div>

        {/* Storage */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              Storage
            </span>
            <span className="text-gray-500">
              {formatBytes(usage.storage.used_bytes)}/{usage.storage.limit_bytes ? formatBytes(usage.storage.limit_bytes) : '∞'}
            </span>
          </div>
          <ProgressBar percentage={usage.storage.percentage} color="green" />
        </div>

        {/* Upgrade CTA for free users */}
        {usage.plan === 'free' && (
          <a
            href="/pricing"
            className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade Plan
          </a>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Usage Overview</h3>
            <p className="text-sm text-gray-500">This month&apos;s resource usage</p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${planDisplay.bgColor} ${planDisplay.color}`}>
          {planDisplay.name} Plan
        </span>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Uploads */}
        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">File Uploads</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{usage.uploads.used} used</span>
              <span className="font-medium text-gray-900">
                {usage.uploads.limit !== null ? `${usage.uploads.limit} limit` : 'Unlimited'}
              </span>
            </div>
            <ProgressBar percentage={usage.uploads.percentage} color="blue" />
            {usage.uploads.remaining !== null && (
              <p className="text-xs text-gray-500">{usage.uploads.remaining} remaining</p>
            )}
          </div>
        </div>

        {/* API Requests */}
        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">API Queries</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{usage.api_requests.used} used</span>
              <span className="font-medium text-gray-900">
                {usage.api_requests.limit !== null ? `${usage.api_requests.limit} limit` : 'Unlimited'}
              </span>
            </div>
            <ProgressBar percentage={usage.api_requests.percentage} color="purple" />
            {usage.api_requests.remaining !== null && (
              <p className="text-xs text-gray-500">{usage.api_requests.remaining} remaining</p>
            )}
          </div>
        </div>

        {/* Storage */}
        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Storage</p>
              <p className="text-xs text-gray-500">Total used</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{formatBytes(usage.storage.used_bytes)}</span>
              <span className="font-medium text-gray-900">
                {usage.storage.limit_bytes !== null ? formatBytes(usage.storage.limit_bytes) : 'Unlimited'}
              </span>
            </div>
            <ProgressBar percentage={usage.storage.percentage} color="green" />
            {usage.storage.remaining_bytes !== null && (
              <p className="text-xs text-gray-500">{formatBytes(usage.storage.remaining_bytes)} remaining</p>
            )}
          </div>
        </div>
      </div>

      {/* Available Models */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Available Models</p>
        <div className="flex flex-wrap gap-2">
          {usage.allowed_models.map((model) => (
            <span
              key={model}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {model}
            </span>
          ))}
        </div>
      </div>

      {/* Upgrade CTA for free users */}
      {usage.plan === 'free' && (
        <div className="pt-4 border-t border-gray-200">
          <a
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Upgrade to Pro for more features
          </a>
        </div>
      )}
    </div>
  );
}
