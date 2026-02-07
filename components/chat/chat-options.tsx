// ChatOptions component - '+' button popup for chat settings
// Contains: Model selection, Brainstorming mode toggle, Web Search toggle

'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronRight, Lightbulb, Globe, Lock, Zap } from 'lucide-react';
import { ModelSelectorPanel, getModelDisplayName, getModelInfo, PROVIDERS } from './model-selector';

interface ChatOptionsProps {
  // Model selection
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  allowedModels: string[];
  userPlan: string;

  // Brainstorming mode
  brainstormEnabled: boolean;
  onBrainstormChange: (enabled: boolean) => void;

  // Web search
  webSearchEnabled: boolean;
  onWebSearchChange: (enabled: boolean) => void;

  // Features available
  features: {
    brainstorm_mode: boolean;
    web_search: boolean;
  };

  disabled?: boolean;
}

// Toggle switch component
function Toggle({
  enabled,
  onChange,
  disabled = false,
  locked = false,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && !locked && onChange(!enabled)}
      className={`
        relative w-10 h-5 rounded-full transition-colors
        ${disabled || locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${enabled && !locked ? 'bg-blue-500' : 'bg-gray-300'}
      `}
    >
      <div
        className={`
          absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
          ${enabled && !locked ? 'translate-x-5' : 'translate-x-0.5'}
        `}
      />
    </button>
  );
}

// Provider dot indicator
function ProviderDot({ provider }: { provider: string }) {
  const providerInfo = PROVIDERS[provider];
  return (
    <div
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: providerInfo?.color || '#888' }}
    />
  );
}

export function ChatOptions({
  selectedModel,
  onModelChange,
  allowedModels,
  userPlan,
  brainstormEnabled,
  onBrainstormChange,
  webSearchEnabled,
  onWebSearchChange,
  features,
  disabled = false,
}: ChatOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowModelSelector(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const modelInfo = getModelInfo(selectedModel);
  const canUseBrainstorm = features.brainstorm_mode;
  const canUseWebSearch = features.web_search;

  return (
    <div className="relative" ref={menuRef}>
      {/* + Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-9 h-9 flex items-center justify-center rounded-lg border transition-all
          ${disabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : isOpen
              ? 'bg-blue-50 border-blue-300 text-blue-600'
              : 'bg-white border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800'
          }
        `}
        title="Chat options"
      >
        <Plus className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
      </button>

      {/* Options Popup */}
      {isOpen && !showModelSelector && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-3 py-1.5 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Options</p>
          </div>

          {/* Choose Model */}
          <button
            type="button"
            onClick={() => setShowModelSelector(true)}
            className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Model</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {modelInfo && <ProviderDot provider={modelInfo.provider} />}
                  <p className="text-xs text-gray-500">{getModelDisplayName(selectedModel)}</p>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Brainstorming Mode Toggle */}
          <div className="px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${canUseBrainstorm ? 'bg-amber-100' : 'bg-gray-100'}`}>
                <Lightbulb className={`w-4 h-4 ${canUseBrainstorm ? 'text-amber-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-medium ${canUseBrainstorm ? 'text-gray-900' : 'text-gray-400'}`}>
                    Brainstorm
                  </p>
                  {!canUseBrainstorm && (
                    <span className="text-[10px] font-medium text-white bg-blue-500 px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Creative thinking mode</p>
              </div>
            </div>
            {canUseBrainstorm ? (
              <Toggle
                enabled={brainstormEnabled}
                onChange={onBrainstormChange}
                disabled={disabled}
              />
            ) : (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
          </div>

          {/* Web Search Toggle */}
          <div className="px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${canUseWebSearch ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Globe className={`w-4 h-4 ${canUseWebSearch ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p className={`text-sm font-medium ${canUseWebSearch ? 'text-gray-900' : 'text-gray-400'}`}>
                    Web Search
                  </p>
                  {!canUseWebSearch && (
                    <span className="text-[10px] font-medium text-white bg-blue-500 px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Search the web for answers</p>
              </div>
            </div>
            {canUseWebSearch ? (
              <Toggle
                enabled={webSearchEnabled}
                onChange={onWebSearchChange}
                disabled={disabled}
              />
            ) : (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
          </div>

          {/* Upgrade CTA for free users */}
          {userPlan === 'free' && (!canUseBrainstorm || !canUseWebSearch) && (
            <div className="px-3 py-2 border-t border-gray-100 mt-1">
              <a
                href="/pricing"
                className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Upgrade for all features
              </a>
            </div>
          )}
        </div>
      )}

      {/* Model Selector Panel (sub-popup) */}
      {isOpen && showModelSelector && (
        <ModelSelectorPanel
          isOpen={showModelSelector}
          onClose={() => setShowModelSelector(false)}
          selectedModel={selectedModel}
          onModelChange={(modelId) => {
            onModelChange(modelId);
            setShowModelSelector(false);
          }}
          allowedModels={allowedModels}
          userPlan={userPlan}
        />
      )}
    </div>
  );
}

// Compact indicator showing current settings (for display in input area)
export function ChatOptionsIndicator({
  selectedModel,
  brainstormEnabled,
  webSearchEnabled,
}: {
  selectedModel: string;
  brainstormEnabled: boolean;
  webSearchEnabled: boolean;
}) {
  const modelInfo = getModelInfo(selectedModel);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      {modelInfo && (
        <div className="flex items-center gap-1">
          <ProviderDot provider={modelInfo.provider} />
          <span>{modelInfo.displayName}</span>
        </div>
      )}
      {brainstormEnabled && (
        <div className="flex items-center gap-1 text-amber-600">
          <Lightbulb className="w-3 h-3" />
          <span>Brainstorm</span>
        </div>
      )}
      {webSearchEnabled && (
        <div className="flex items-center gap-1 text-green-600">
          <Globe className="w-3 h-3" />
          <span>Web</span>
        </div>
      )}
    </div>
  );
}
