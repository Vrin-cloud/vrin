'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ThinkingStep {
  step: string;
  description: string;
  icon: string;
}

interface ReasoningMetadata {
  model: string;
  reasoning_tokens: number;
  input_tokens: number;  // Renamed from prompt_tokens
  output_tokens: number;  // Renamed from completion_tokens
  total_tokens: number;
  processing_time?: string;  // Processing time (e.g., "72.4s")
  thinking_steps: ThinkingStep[];
  reasoning_summary?: string;  // GPT-5 reasoning summary (the model's thinking process)
}

interface ThinkingPanelProps {
  metadata?: ReasoningMetadata;  // Renamed from reasoningMetadata
}

export function ThinkingPanel({ metadata }: ThinkingPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Show panel if we have reasoning_tokens OR thinking_steps
  if (!metadata || (!metadata.thinking_steps?.length && !metadata.reasoning_tokens)) {
    return null; // No reasoning metadata available
  }

  const hasDetailedSteps = metadata.thinking_steps && metadata.thinking_steps.length > 0;

  return (
    <div className="thinking-panel mt-4 border border-gray-200 rounded-lg overflow-hidden">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-gray-600">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {hasDetailedSteps
            ? `Show thinking · ${metadata.thinking_steps.length} steps`
            : `Show reasoning · ${metadata.reasoning_tokens?.toLocaleString()} tokens`
          }
        </span>
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="thinking-content bg-white p-4 border-t border-gray-200">
          {hasDetailedSteps ? (
            <>
              {/* Detailed thinking steps */}
              {metadata.thinking_steps.map((step, index) => (
                <div
                  key={index}
                  className={`thinking-step pb-4 mb-4 ${
                    index === metadata.thinking_steps.length - 1 && !metadata.reasoning_summary ? 'border-b-0 mb-0 pb-0' : 'border-b border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{step.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900 mb-1">
                        {step.step}
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* GPT-5 Reasoning Summary (if available) */}
              {metadata.reasoning_summary && (
                <div className="reasoning-summary pb-4 mb-0">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🧠</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900 mb-2">
                        GPT-5 Reasoning Process
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <div className="whitespace-pre-wrap">{metadata.reasoning_summary}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // No detailed steps, just show reasoning summary
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                The model used advanced reasoning to analyze your question and the retrieved context.
                This involved {metadata.reasoning_tokens?.toLocaleString()} reasoning tokens of internal thought before generating the response.
              </p>
              {metadata.reasoning_summary ? (
                <div className="mt-3 bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="text-xs font-semibold text-purple-900 mb-1">Reasoning Process:</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{metadata.reasoning_summary}</div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">
                  Note: Detailed reasoning steps are not available for this response, but the model&apos;s reasoning capability was utilized.
                </p>
              )}
            </div>
          )}

          {/* Token usage stats */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Reasoning tokens:</span>
              <span className="font-semibold text-gray-900">
                {(metadata.reasoning_tokens || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total tokens:</span>
              <span className="font-semibold text-gray-900">
                {metadata.total_tokens.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Model:</span>
              <span className="font-semibold text-gray-900">
                {metadata.model}
              </span>
            </div>
            {metadata.processing_time && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Processing time:</span>
                <span className="font-semibold text-gray-900">
                  {metadata.processing_time}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
