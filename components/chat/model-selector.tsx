// ModelSelector component for selecting LLM model
// Shows available models from multiple providers based on user's plan (free/pro)

'use client'

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Zap, Brain, Sparkles, Rocket, Lock, Bolt, X } from 'lucide-react';

// Provider metadata
export interface ProviderInfo {
  id: string;
  displayName: string;
  color: string;
}

export const PROVIDERS: Record<string, ProviderInfo> = {
  openai: { id: 'openai', displayName: 'OpenAI', color: '#10A37F' },
  anthropic: { id: 'anthropic', displayName: 'Anthropic', color: '#D4A574' },
  google: { id: 'google', displayName: 'Google', color: '#4285F4' },
  xai: { id: 'xai', displayName: 'xAI', color: '#000000' },
};

// Model metadata matching backend plan_config.py
export interface ModelInfo {
  id: string;
  displayName: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'google' | 'xai';
  tierRequired: 'free' | 'pro';
  icon: 'zap' | 'brain' | 'sparkles' | 'rocket' | 'bolt';
  isReasoningModel: boolean;
}

// All available models - matching backend plan_config.py MODEL_METADATA
export const MODEL_METADATA: ModelInfo[] = [
  // ============= OpenAI Models =============
  {
    id: 'gpt-5.2',
    displayName: 'GPT-5.2',
    description: 'Fast and capable for everyday tasks',
    provider: 'openai',
    tierRequired: 'free',
    icon: 'zap',
    isReasoningModel: false,
  },
  {
    id: 'gpt-5.2-turbo',
    displayName: 'GPT-5.2 Turbo',
    description: 'Enhanced speed and accuracy',
    provider: 'openai',
    tierRequired: 'pro',
    icon: 'bolt',
    isReasoningModel: false,
  },
  {
    id: 'o3-mini',
    displayName: 'o3 Mini',
    description: 'Compact reasoning model',
    provider: 'openai',
    tierRequired: 'pro',
    icon: 'brain',
    isReasoningModel: true,
  },
  {
    id: 'o3',
    displayName: 'o3',
    description: 'Advanced reasoning capabilities',
    provider: 'openai',
    tierRequired: 'pro',
    icon: 'sparkles',
    isReasoningModel: true,
  },
  {
    id: 'o4-mini',
    displayName: 'o4 Mini',
    description: 'Next-gen compact reasoning',
    provider: 'openai',
    tierRequired: 'pro',
    icon: 'rocket',
    isReasoningModel: true,
  },

  // ============= Anthropic Models =============
  {
    id: 'claude-4-haiku',
    displayName: 'Claude 4 Haiku',
    description: 'Fast and efficient responses',
    provider: 'anthropic',
    tierRequired: 'free',
    icon: 'zap',
    isReasoningModel: false,
  },
  {
    id: 'claude-4-sonnet',
    displayName: 'Claude 4 Sonnet',
    description: 'Balanced performance and capability',
    provider: 'anthropic',
    tierRequired: 'pro',
    icon: 'brain',
    isReasoningModel: false,
  },
  {
    id: 'claude-4-opus',
    displayName: 'Claude 4 Opus',
    description: 'Maximum capability and nuance',
    provider: 'anthropic',
    tierRequired: 'pro',
    icon: 'sparkles',
    isReasoningModel: true,
  },

  // ============= Google Models =============
  {
    id: 'gemini-3-flash',
    displayName: 'Gemini 3 Flash',
    description: 'Ultra-fast multimodal responses',
    provider: 'google',
    tierRequired: 'free',
    icon: 'zap',
    isReasoningModel: false,
  },
  {
    id: 'gemini-3-pro',
    displayName: 'Gemini 3 Pro',
    description: 'Advanced reasoning and analysis',
    provider: 'google',
    tierRequired: 'pro',
    icon: 'brain',
    isReasoningModel: true,
  },
  {
    id: 'gemini-3-ultra',
    displayName: 'Gemini 3 Ultra',
    description: 'Most capable Gemini model',
    provider: 'google',
    tierRequired: 'pro',
    icon: 'sparkles',
    isReasoningModel: true,
  },

  // ============= xAI Models =============
  {
    id: 'grok-3',
    displayName: 'Grok 3',
    description: 'Real-time knowledge and wit',
    provider: 'xai',
    tierRequired: 'free',
    icon: 'zap',
    isReasoningModel: false,
  },
  {
    id: 'grok-3-pro',
    displayName: 'Grok 3 Pro',
    description: 'Enhanced reasoning with humor',
    provider: 'xai',
    tierRequired: 'pro',
    icon: 'brain',
    isReasoningModel: true,
  },
];

// Get icon component for a model
function getModelIcon(iconName: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    zap: Zap,
    brain: Brain,
    sparkles: Sparkles,
    rocket: Rocket,
    bolt: Bolt,
  };
  return icons[iconName] || Zap;
}

// Provider dot indicator
function ProviderDot({ provider }: { provider: string }) {
  const providerInfo = PROVIDERS[provider];
  return (
    <div
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: providerInfo?.color || '#888' }}
      title={providerInfo?.displayName}
    />
  );
}

interface ModelSelectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  allowedModels: string[];
  userPlan: string;
}

// Model selector panel (opens from the side)
export function ModelSelectorPanel({
  isOpen,
  onClose,
  selectedModel,
  onModelChange,
  allowedModels,
  userPlan,
}: ModelSelectorPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const providers = ['openai', 'anthropic', 'google', 'xai'] as const;

  return (
    <div
      ref={panelRef}
      className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 max-h-[400px] overflow-y-auto"
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Choose Model</p>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {providers.map((providerId) => {
        const providerModels = MODEL_METADATA.filter(m => m.provider === providerId);
        const providerInfo = PROVIDERS[providerId];

        return (
          <div key={providerId} className="mt-1">
            {/* Provider Header */}
            <div className="px-3 py-1.5 flex items-center gap-2">
              <ProviderDot provider={providerId} />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {providerInfo.displayName}
              </span>
            </div>

            {/* Provider's Models */}
            {providerModels.map((model) => {
              const isLocked = !allowedModels.includes(model.id);
              const isSelected = selectedModel === model.id;
              const Icon = getModelIcon(model.icon);

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    if (!isLocked) {
                      onModelChange(model.id);
                      onClose();
                    }
                  }}
                  className={`
                    w-full px-3 py-2 flex items-start gap-3 transition-colors
                    ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    ${isLocked ? 'cursor-default opacity-60' : 'cursor-pointer'}
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isLocked ? 'bg-gray-100' : isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    <Icon className={`w-3.5 h-3.5 ${isLocked ? 'text-gray-400' : isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>

                  {/* Model Info */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                        {model.displayName}
                      </span>
                      {model.isReasoningModel && !isLocked && (
                        <span className="text-[10px] font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">
                          Reasoning
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-[10px] font-medium text-white bg-blue-500 px-1.5 py-0.5 rounded">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                      {model.description}
                    </p>
                  </div>

                  {/* Lock Icon or Check */}
                  <div className="flex-shrink-0 mt-1">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}

      {/* Upgrade CTA for free users */}
      {userPlan === 'free' && (
        <div className="px-3 py-2 border-t border-gray-100 mt-1">
          <a
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to Pro for all models
          </a>
        </div>
      )}
    </div>
  );
}

// Helper to get default model for a plan
export function getDefaultModelForPlan(plan: string): string {
  return 'gpt-5.2';
}

// Helper to get all allowed models for a plan
export function getAllowedModelsForPlan(plan: string): string[] {
  const freeModels = ['gpt-5.2', 'claude-4-haiku', 'gemini-3-flash', 'grok-3'];
  const proModels = [
    ...freeModels,
    'gpt-5.2-turbo', 'o3-mini', 'o3', 'o4-mini',
    'claude-4-sonnet', 'claude-4-opus',
    'gemini-3-pro', 'gemini-3-ultra',
    'grok-3-pro',
  ];

  return plan === 'pro' ? proModels : freeModels;
}

// Get model display name
export function getModelDisplayName(modelId: string): string {
  const model = MODEL_METADATA.find(m => m.id === modelId);
  return model?.displayName || modelId;
}

// Get model info
export function getModelInfo(modelId: string): ModelInfo | undefined {
  return MODEL_METADATA.find(m => m.id === modelId);
}

// Original ModelSelector component (inline dropdown version)
// Kept for backward compatibility with existing chat page
interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  allowedModels: string[];
  userPlan: string;
  disabled?: boolean;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  allowedModels,
  userPlan,
  disabled = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModelInfo = MODEL_METADATA.find(m => m.id === selectedModel) || MODEL_METADATA[0];
  const SelectedIcon = getModelIcon(selectedModelInfo?.icon || 'zap');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const providers = ['openai', 'anthropic', 'google', 'xai'] as const;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
          ${disabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 hover:border-gray-400 text-gray-700 cursor-pointer'
          }
        `}
        title={`${selectedModelInfo?.displayName} (${PROVIDERS[selectedModelInfo?.provider]?.displayName})`}
      >
        <ProviderDot provider={selectedModelInfo?.provider || 'openai'} />
        <SelectedIcon className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium hidden sm:inline">{selectedModelInfo?.displayName}</span>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 max-h-[400px] overflow-y-auto">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Select Model</p>
          </div>

          {providers.map((providerId) => {
            const providerModels = MODEL_METADATA.filter(m => m.provider === providerId);
            const providerInfo = PROVIDERS[providerId];

            return (
              <div key={providerId} className="mt-1">
                <div className="px-3 py-1.5 flex items-center gap-2">
                  <ProviderDot provider={providerId} />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {providerInfo.displayName}
                  </span>
                </div>

                {providerModels.map((model) => {
                  const isLocked = !allowedModels.includes(model.id);
                  const isSelected = selectedModel === model.id;
                  const Icon = getModelIcon(model.icon);

                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        if (!isLocked) {
                          onModelChange(model.id);
                          setIsOpen(false);
                        }
                      }}
                      className={`
                        w-full px-3 py-2 flex items-start gap-3 transition-colors
                        ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        ${isLocked ? 'cursor-default opacity-60' : 'cursor-pointer'}
                      `}
                    >
                      <div className={`
                        w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                        ${isLocked ? 'bg-gray-100' : isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                      `}>
                        <Icon className={`w-3.5 h-3.5 ${isLocked ? 'text-gray-400' : isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                            {model.displayName}
                          </span>
                          {model.isReasoningModel && !isLocked && (
                            <span className="text-[10px] font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">
                              Reasoning
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-[10px] font-medium text-white bg-blue-500 px-1.5 py-0.5 rounded">
                              PRO
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 truncate ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                          {model.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0 mt-1">
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-gray-400" />
                        ) : isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {userPlan === 'free' && (
            <div className="px-3 py-2 border-t border-gray-100 mt-1">
              <a
                href="/pricing"
                className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Upgrade to Pro for all models
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

