'use client';

import React from 'react';
import { X } from 'lucide-react';

interface Source {
  document_name: string;
  upload_id?: string;  // For graph/vector sources
  document_id?: string;  // For personal sources
  source_type: 'graph' | 'vector' | 'personal';
}

interface SourcesPanelProps {
  sources: Source[];
  isOpen: boolean;
  onClose: () => void;
}

export function SourcesPanel({ sources, isOpen, onClose }: SourcesPanelProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Sources · {sources.length}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Source list */}
        <div className="flex-1 overflow-y-auto p-4">
          {sources.map((source, index) => (
            <div
              key={index}
              className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {/* Source type badge */}
              <div className="mb-2">
                {source.source_type === 'graph' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    🕸️ Graph
                  </span>
                )}
                {source.source_type === 'vector' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                    📊 Vector
                  </span>
                )}
                {source.source_type === 'personal' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                    👤 Personal
                  </span>
                )}
              </div>

              {/* Document name */}
              <div className="text-sm font-medium text-gray-900 mb-1 leading-snug">
                {source.document_name}
              </div>

              {/* Document ID */}
              {(source.upload_id || source.document_id) && (
                <div className="text-xs text-gray-500 font-mono">
                  ID: {(source.upload_id || source.document_id)?.substring(0, 12)}...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
