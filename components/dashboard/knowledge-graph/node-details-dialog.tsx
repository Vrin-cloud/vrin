'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Building, User, Link, Clock, TrendingUp } from 'lucide-react';
import type { Node, Edge } from '../../../types/knowledge-graph';

interface NodeDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode?: Node | null;
  selectedEdge?: Edge | null;
}

export function NodeDetailsDialog({
  isOpen,
  onClose,
  selectedNode,
  selectedEdge
}: NodeDetailsDialogProps) {
  const selectedItem = selectedNode || selectedEdge;
  
  if (!selectedItem) return null;

  const formatTimestamp = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTemporalContextColor = (context: string) => {
    switch (context) {
      case 'current': return 'text-green-600';
      case 'past': return 'text-blue-600';
      case 'future': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedNode ? 'Node Details' : 'Edge Details'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {selectedNode ? (
                    <>
                      <User className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedNode.name}
                      </h3>
                    </>
                  ) : (
                    <>
                      <Link className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedEdge?.label}
                      </h3>
                    </>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedNode?.type || 'Relationship'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className={`text-sm font-medium ${getConfidenceColor(selectedItem.confidence || 0)}`}>
                      {(selectedItem.confidence || 0) * 100}%
                    </span>
                  </div>

                  {selectedNode && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Connections:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedNode.connections || 0}
                      </span>
                    </div>
                  )}

                  {/* Timestamp Information */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedItem.timestamp ? formatTimestamp(selectedItem.timestamp) : 'Unknown'}
                    </span>
                  </div>

                  {/* ID Information */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ID:</span>
                    <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {selectedItem.id}
                    </span>
                  </div>

                  {/* Description */}
                  {selectedNode?.description && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-sm text-gray-600">Description:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedNode.description}
                      </p>
                    </div>
                  )}

                  {/* Edge-specific information */}
                  {selectedEdge && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">From:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedEdge.from}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">To:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedEdge.to}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Relationship:</span>
                        <span className="text-sm font-medium text-blue-600">
                          {selectedEdge.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Weight:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedEdge.weight || 1.0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedEdge.type || 'Relationship'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Additional Information
                </h4>
                <div className="space-y-2">
                  {/* Last Updated */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedItem.timestamp ? formatTimestamp(selectedItem.timestamp) : 'Unknown'}
                    </span>
                  </div>

                  {/* Source */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Source:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedNode?.metadata?.source || selectedEdge?.metadata?.source || 'API'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-green-600">
                      {selectedNode?.metadata?.status || selectedEdge?.metadata?.status || 'Active'}
                    </span>
                  </div>

                  {/* Properties */}
                  {((selectedNode?.metadata && Object.keys(selectedNode.metadata).length > 0) || 
                    (selectedEdge?.metadata && Object.keys(selectedEdge.metadata).length > 0)) && 
                    Object.entries(selectedNode?.metadata || selectedEdge?.metadata || {}).map(([key, value]) => {
                      if (['source', 'status', 'timestamp'].includes(key)) return null;
                      return (
                        <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {key === 'timestamp' ? formatTimestamp(value as string) : value as string}
                          </span>
                        </div>
                      );
                    })
                  }
                </div>
              </div>

              {/* Edge Details Section */}
              {selectedEdge && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Link className="h-4 w-4 mr-2" />
                    Edge Details
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>Relationship:</strong> {selectedEdge.label}
                      </div>
                      <div className="text-sm text-blue-700 mt-1">
                        <strong>Connection:</strong> {selectedEdge.from} → {selectedEdge.to}
                      </div>
                      {selectedEdge.metadata?.fact_id && (
                        <div className="text-sm text-blue-600 mt-1">
                          <strong>Fact ID:</strong> {selectedEdge.metadata.fact_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Temporal Context */}
              {((selectedNode?.metadata?.temporal_context) || (selectedEdge?.metadata?.temporal_context)) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Temporal Context
                  </h4>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className={`text-sm font-medium ${getTemporalContextColor((selectedNode?.metadata?.temporal_context || selectedEdge?.metadata?.temporal_context) as string)}`}>
                      {((selectedNode?.metadata?.temporal_context || selectedEdge?.metadata?.temporal_context) as string).charAt(0).toUpperCase() +
                       ((selectedNode?.metadata?.temporal_context || selectedEdge?.metadata?.temporal_context) as string).slice(1)}
                    </span>
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Statistics
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-lg font-semibold text-green-700">
                      {selectedItem.confidence ? Math.round((selectedItem.confidence || 0) * 100) : 0}%
                    </div>
                    <div className="text-xs text-green-600">Confidence</div>
                  </div>
                  
                  {selectedNode && (
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-lg font-semibold text-blue-700">
                        {selectedNode.connections || 0}
                      </div>
                      <div className="text-xs text-blue-600">Connections</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    View Related
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 