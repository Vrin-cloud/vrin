'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConflictResolution as ConflictType } from '@/types/knowledge-graph';

interface ConflictResolutionProps {
  conflicts: ConflictType[];
  onResolve: (conflictId: string, resolution: string) => void;
  isLoading?: boolean;
}

export function ConflictResolution({ 
  conflicts, 
  onResolve, 
  isLoading = false 
}: ConflictResolutionProps) {
  
  // Sample conflicts for demonstration
  const sampleConflicts: ConflictType[] = [
    {
      conflictId: 'conflict-1',
      conflictType: 'contradiction',
      facts: [
        {
          subject: 'Marie Curie',
          predicate: 'won Nobel Prize',
          object: '1903',
          id: 'fact-1',
          confidence: 0.89,
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          status: 'conflicted'
        },
        {
          subject: 'Marie Curie',
          predicate: 'won Nobel Prize',
          object: '1911',
          id: 'fact-2',
          confidence: 0.92,
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          status: 'conflicted'
        }
      ],
             confidence: 0.85,
       timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
       resolution: 'manual_review'
     },
    {
      conflictId: 'conflict-2',
      conflictType: 'temporal_overlap',
      facts: [
        {
          subject: 'Pierre Curie',
          predicate: 'worked at',
          object: 'University of Paris',
          id: 'fact-3',
          confidence: 0.91,
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          status: 'conflicted'
        },
        {
          subject: 'Pierre Curie',
          predicate: 'worked at',
          object: 'Sorbonne',
          id: 'fact-4',
          confidence: 0.88,
          timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
          status: 'conflicted'
        }
      ],
             confidence: 0.79,
       timestamp: new Date(Date.now() - 5400000),
       resolution: 'manual_review'
     }
  ];

  const displayConflicts = conflicts.length > 0 ? conflicts : sampleConflicts;

  const getConflictTypeColor = (type: ConflictType['conflictType']) => {
    switch (type) {
      case 'contradiction':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'temporal_overlap':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'ambiguity':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getConflictTypeLabel = (type: ConflictType['conflictType']) => {
    switch (type) {
      case 'contradiction':
        return 'Direct Contradiction';
      case 'temporal_overlap':
        return 'Temporal Overlap';
      case 'ambiguity':
        return 'Ambiguous Information';
      default:
        return 'Unknown Conflict';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (isLoading) {
    return (
      <div className="card h-full">
        <div className="card-header">
          <h3 className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Conflict Resolution
          </h3>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-lg p-4">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
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
        <div className="flex items-center justify-between">
          <h3 className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Conflict Resolution
          </h3>
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
            {displayConflicts.length} conflicts
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Resolve temporal conflicts in the knowledge graph
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {displayConflicts.map((conflict, index) => (
          <motion.div
            key={conflict.conflictId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-lg p-4 bg-white"
          >
            {/* Conflict Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${getConflictTypeColor(conflict.conflictType)}`}>
                  {getConflictTypeLabel(conflict.conflictType)}
                </span>
                <span className="text-xs text-slate-500">
                  {Math.round(conflict.confidence * 100)}% confidence
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatTimestamp(conflict.timestamp)}
              </div>
            </div>

            {/* Conflicting Facts */}
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium text-slate-900">Conflicting Information:</h4>
              {conflict.facts.map((fact, factIndex) => (
                <div 
                  key={fact.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    factIndex === 0 ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      {fact.subject} {fact.predicate} {fact.object}
                    </p>
                    <span className="text-xs text-slate-600">
                      {Math.round((fact.confidence || 0) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <User className="h-3 w-3 mr-1" />
                    Added {formatTimestamp(fact.timestamp || new Date())}
                  </div>
                </div>
              ))}
            </div>

            {/* Resolution Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="flex space-x-2">
                <Button
                  onClick={() => onResolve(conflict.conflictId, 'keep_latest')}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-3 py-1"
                >
                  Keep Latest
                </Button>
                <Button
                  onClick={() => onResolve(conflict.conflictId, 'keep_highest_confidence')}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-3 py-1"
                >
                  Keep Highest Confidence
                </Button>
                <Button
                  onClick={() => onResolve(conflict.conflictId, 'merge')}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-3 py-1"
                >
                  Merge
                </Button>
              </div>
              <Button
                onClick={() => onResolve(conflict.conflictId, 'manual_review')}
                variant="outline"
                size="sm"
                className="text-xs px-3 py-1"
              >
                Manual Review
              </Button>
            </div>
          </motion.div>
        ))}

        {displayConflicts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-slate-500">No conflicts detected</p>
            <p className="text-xs text-slate-400 mt-1">
              All facts are consistent with each other
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 