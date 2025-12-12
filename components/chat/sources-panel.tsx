'use client'

import React from 'react'
import { X, FileText, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SampleFact {
  subject: string
  predicate: string
  object: string
  confidence: number
}

interface SourceDocument {
  document_name: string
  document_id?: string
  upload_id?: string  // Backend streaming sends upload_id instead of document_id
  source_type?: 'graph' | 'vector'  // Backend streaming sends source_type
  facts_count?: number
  avg_confidence?: number
  sample_facts?: SampleFact[]
}

interface SourcesPanelProps {
  isOpen: boolean
  onClose: () => void
  sources: SourceDocument[]
  metadata: {
    documents_used?: number
    facts_retrieved?: number
    response_time?: string
  }
}

export function SourcesPanel({ isOpen, onClose, sources, metadata }: SourcesPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[450px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sources</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {metadata.documents_used || sources.length} {(metadata.documents_used || sources.length) === 1 ? 'document' : 'documents'} used
                  {metadata.facts_retrieved && ` · ${metadata.facts_retrieved} facts`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {sources.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No sources available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sources.map((source, index) => (
                    <SourceCard key={source.document_id || index} source={source} index={index} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Optional metadata */}
            {metadata.response_time && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
                Response time: {metadata.response_time}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function SourceCard({ source, index }: { source: SourceDocument; index: number }) {
  const [showFacts, setShowFacts] = React.useState(false)

  // Handle both rich and simple source formats
  const documentId = source.document_id || source.upload_id || `source-${index}`
  const hasStats = source.facts_count !== undefined && source.avg_confidence !== undefined
  const hasFacts = source.sample_facts && source.sample_facts.length > 0

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      {/* Document Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          source.source_type === 'graph' ? 'bg-purple-100' : 'bg-blue-100'
        }`}>
          <FileText className={`w-5 h-5 ${
            source.source_type === 'graph' ? 'text-purple-600' : 'text-blue-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {source.document_name}
          </h4>
          {documentId && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {source.source_type && (
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mr-1 ${
                  source.source_type === 'graph'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {source.source_type === 'graph' ? 'Knowledge Graph' : 'Vector Search'}
                </span>
              )}
              {documentId.substring(0, 20)}...
            </p>
          )}
        </div>
      </div>

      {/* Stats - only show if available */}
      {hasStats && (
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">{source.facts_count} {source.facts_count === 1 ? 'fact' : 'facts'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
            <span className="text-gray-700">{Math.round((source.avg_confidence || 0) * 100)}% confidence</span>
          </div>
        </div>
      )}

      {/* Sample Facts - only show if available */}
      {hasFacts && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => setShowFacts(!showFacts)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showFacts ? 'Hide' : 'Show'} sample facts ({source.sample_facts!.length})
          </button>

          {showFacts && (
            <div className="mt-2 space-y-2">
              {source.sample_facts!.slice(0, 3).map((fact, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-700">{fact.subject}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-600">{fact.predicate}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-gray-700">{fact.object}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className="h-1 bg-green-500 rounded"
                          style={{ width: `${fact.confidence * 60}px` }}
                        />
                        <span className="text-gray-500 text-[10px]">
                          {Math.round(fact.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
