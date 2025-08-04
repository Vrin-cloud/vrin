'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, GitBranch, AlertTriangle, CheckCircle } from 'lucide-react';
import type { KnowledgeGraphResponse } from '@/types/knowledge-graph';

interface TemporalTimelineProps {
  data?: KnowledgeGraphResponse['data'];
  isLoading?: boolean;
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'fact_added' | 'fact_updated' | 'conflict_detected' | 'conflict_resolved';
  description: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export function TemporalTimeline({ data, isLoading = false }: TemporalTimelineProps) {
  
  // Sample timeline events for demonstration
  const sampleEvents: TimelineEvent[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      type: 'fact_added',
      description: 'Marie Curie discovered Polonium',
      confidence: 0.95
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      type: 'conflict_detected',
      description: 'Conflicting information about Nobel Prize year',
      confidence: 0.78
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'conflict_resolved',
      description: 'Resolved: Nobel Prize awarded in 1903',
      confidence: 0.92
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      type: 'fact_updated',
      description: 'Updated Pierre Curie relationship details',
      confidence: 0.89
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: 'fact_added',
      description: 'Added research collaboration with Becquerel',
      confidence: 0.91
    }
  ];

  const events = sampleEvents; // In real app, this would come from data

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'fact_added':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fact_updated':
        return <GitBranch className="h-4 w-4 text-blue-600" />;
      case 'conflict_detected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'conflict_resolved':
        return <CheckCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'fact_added':
        return 'border-green-200 bg-green-50';
      case 'fact_updated':
        return 'border-blue-200 bg-blue-50';
      case 'conflict_detected':
        return 'border-red-200 bg-red-50';
      case 'conflict_resolved':
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Temporal Timeline
          </h3>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Temporal Timeline
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Recent changes and conflicts in the knowledge graph
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            {/* Event Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-white flex items-center justify-center">
                {getEventIcon(event.type)}
              </div>
            </div>

            {/* Event Content */}
            <div className="flex-1 min-w-0">
              <div className={`p-3 rounded-lg border ${getEventColor(event.type)}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900">
                    {event.description}
                  </p>
                  {event.confidence && (
                    <span className="text-xs font-medium text-slate-600">
                      {Math.round(event.confidence * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {formatTimestamp(event.timestamp)}
                </p>
              </div>
            </div>

            {/* Timeline Connector */}
            {index < events.length - 1 && (
              <div className="absolute left-4 mt-8 w-0.5 h-4 bg-slate-200"></div>
            )}
          </motion.div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">No recent timeline events</p>
          </div>
        )}
      </div>
    </div>
  );
} 