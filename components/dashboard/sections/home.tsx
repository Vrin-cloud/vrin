'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  BarChart3,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  Zap,
  Activity,
  Plus,
  Search,
  Key,
  Database,
  Network,
  Shield,
  Globe,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../hooks/use-auth';
import { useRealKnowledgeGraph } from '../../../hooks/use-knowledge-graph-real';

interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface HomeSectionProps {
  graphData?: any;
  isLoading?: boolean;
  error?: any;
  onAddKnowledge?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  isInserting?: boolean;
  isRetrieving?: boolean;
}

export function HomeSection({
  graphData: propGraphData,
  isLoading: propIsLoading,
  error,
  onAddKnowledge,
  onSearch,
  searchQuery,
  setSearchQuery,
  isInserting,
  isRetrieving
}: HomeSectionProps = {}) {
  const { user } = useAuth();
  const { data: hookGraphData, isLoading: hookIsLoading } = useRealKnowledgeGraph();
  
  // Use props if provided, otherwise use hook data
  const graphData = propGraphData || hookGraphData;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;

  const metrics: MetricCard[] = [
    {
      title: 'Knowledge Nodes',
      value: graphData?.data?.statistics?.nodeCount || 0,
      change: '+12%',
      icon: Brain,
      color: 'blue',
      description: 'Total entities in your knowledge graph',
      trend: 'up'
    },
    {
      title: 'Connections',
      value: graphData?.data?.statistics?.edgeCount || 0,
      change: '+8%',
      icon: Network,
      color: 'green',
      description: 'Relationships between entities',
      trend: 'up'
    },
    {
      title: 'Temporal Facts',
      value: graphData?.data?.statistics?.temporal?.recentUpdates || 0,
      change: '+15%',
      icon: Clock,
      color: 'purple',
      description: 'Time-aware knowledge entries',
      trend: 'up'
    },
    {
      title: 'Conflicts Resolved',
      value: graphData?.data?.statistics?.temporal?.conflictedFacts || 0,
      change: '-5%',
      icon: AlertTriangle,
      color: 'orange',
      description: 'Contradictions handled',
      trend: 'down'
    }
  ];

  const quickActions = [
    {
      title: 'Add Knowledge',
      description: 'Insert new facts and information',
      icon: Plus,
      action: onAddKnowledge || (() => console.log('Add knowledge')),
      color: 'blue'
    },
    {
      title: 'Query Graph',
      description: 'Search through your knowledge',
      icon: Search,
      action: () => console.log('Query graph'),
      color: 'green'
    },
    {
      title: 'View Knowledge Graph',
      description: 'Interactive graph visualization',
      icon: BarChart3,
      action: () => {
        // This will be handled by the parent component
        console.log('View knowledge graph');
      },
      color: 'purple'
    },
    {
      title: 'Manage API Keys',
      description: 'Configure API access',
      icon: Key,
      action: () => console.log('Manage API keys'),
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome to VRIN Knowledge Graph
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              Your context engineering platform that systematically assembles personalized context—user preferences, traits, and business data—for reliable AI applications.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <Brain className="h-20 w-20 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${metric.color}-50`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
                {metric.trend && (
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    metric.trend === 'up' 
                      ? 'bg-green-50 text-green-700' 
                      : metric.trend === 'down'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${
                      metric.trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    <span>{metric.change}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={action.action}
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors text-left group border border-gray-200"
              >
                <div className={`p-2 rounded-lg bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors`}>
                  <Icon className={`h-5 w-5 text-${action.color}-600`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 