'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Network, 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  Zap,
  Database
} from 'lucide-react';
import type { GraphStatistics as GraphStatsType } from '@/types/knowledge-graph';

interface GraphStatisticsProps {
  statistics?: GraphStatsType;
  isLoading?: boolean;
  detailed?: boolean;
}

export function GraphStatistics({ 
  statistics, 
  isLoading = false, 
  detailed = false 
}: GraphStatisticsProps) {
  
  // Sample statistics for demonstration
  const sampleStats: GraphStatsType = {
    nodeCount: 1247,
    edgeCount: 3891,
    tripleCount: 5638,
    density: 0.73,
    averageConnections: 6.2,
    clusters: 12,
    confidence: {
      average: 0.87,
      min: 0.34,
      max: 0.98,
      distribution: {
        'high': 64,
        'medium': 28,
        'low': 8
      }
    },
    temporal: {
      recentUpdates: 23,
      conflictedFacts: 3,
      averageFactAge: 45.2
    },
    domains: {
      'Science': 387,
      'Technology': 298,
      'Healthcare': 156,
      'Finance': 89,
      'Legal': 67,
      'Other': 250
    }
  };

  const displayStats = statistics || sampleStats;

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Graph Statistics
          </h3>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subtitle, 
    color = 'blue' 
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600'
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg p-4 border border-border-light shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Graph Statistics
        </h3>
        {displayStats.temporal.recentUpdates > 0 && (
          <div className="flex items-center text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {displayStats.temporal.recentUpdates} recent updates
          </div>
        )}
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Network}
          label="Nodes"
          value={formatNumber(displayStats.nodeCount)}
          subtitle="Knowledge entities"
          color="blue"
        />
        <StatCard
          icon={Zap}
          label="Edges"
          value={formatNumber(displayStats.edgeCount)}
          subtitle="Relationships"
          color="purple"
        />
        <StatCard
          icon={Database}
          label="Facts"
          value={formatNumber(displayStats.tripleCount)}
          subtitle="Total triples"
          color="green"
        />
        <StatCard
          icon={Target}
          label="Confidence"
          value={`${Math.round(displayStats.confidence.average * 100)}%`}
          subtitle="Average accuracy"
          color="yellow"
        />
      </div>

      {detailed && (
        <>
          {/* Advanced Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Users}
              label="Clusters"
              value={displayStats.clusters}
              subtitle="Knowledge groups"
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Connections"
              value={displayStats.averageConnections.toFixed(1)}
              subtitle="Per node"
              color="blue"
            />
            <StatCard
              icon={Clock}
              label="Conflicts"
              value={displayStats.temporal.conflictedFacts}
              subtitle="Requiring resolution"
              color={displayStats.temporal.conflictedFacts > 0 ? "red" : "green"}
            />
          </div>

          {/* Confidence Distribution */}
          <div className="card">
            <h4 className="font-medium text-slate-900 mb-4">Confidence Distribution</h4>
            <div className="space-y-3">
              {Object.entries(displayStats.confidence.distribution).map(([level, percentage]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 capitalize">{level}</span>
                  <div className="flex items-center space-x-3 flex-1 ml-4">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          level === 'high' ? 'bg-green-500' :
                          level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 w-10 text-right">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Distribution */}
          <div className="card">
            <h4 className="font-medium text-slate-900 mb-4">Knowledge Domains</h4>
            <div className="space-y-2">
              {Object.entries(displayStats.domains)
                .sort(([,a], [,b]) => b - a)
                .map(([domain, count]) => (
                <div key={domain} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-700">{domain}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-500 h-1.5 rounded-full"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(displayStats.domains))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Temporal Insights */}
          <div className="card">
            <h4 className="font-medium text-slate-900 mb-4">Temporal Insights</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {displayStats.temporal.recentUpdates}
                </div>
                <div className="text-sm text-slate-600">Recent Updates</div>
                <div className="text-xs text-slate-500">Last 24 hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {displayStats.temporal.conflictedFacts}
                </div>
                <div className="text-sm text-slate-600">Active Conflicts</div>
                <div className="text-xs text-slate-500">Need resolution</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {displayStats.temporal.averageFactAge.toFixed(0)}d
                </div>
                <div className="text-sm text-slate-600">Avg Fact Age</div>
                <div className="text-xs text-slate-500">Days since creation</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 