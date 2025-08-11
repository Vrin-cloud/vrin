'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Sparkles, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Users,
  TrendingUp,
  FileText,
  Briefcase,
  Stethoscope
} from 'lucide-react';
import { useVRINService } from '@/hooks/use-vrin-service';

interface AISpecializationProps {
  apiKey?: string;
}

const DOMAIN_PRESETS = {
  legal: {
    name: 'Legal Expert',
    icon: Briefcase,
    prompt: `You are a senior legal partner with 25+ years experience in corporate law.
Focus on:
1. Risk quantification with specific dollar amounts
2. Cross-document synthesis to identify hidden risks  
3. Strategic recommendations for deal structure
4. Regulatory compliance analysis
5. Contract interpretation and due diligence insights

Provide professional-grade analysis with confidence levels and actionable recommendations.`,
    reasoning_focus: ['legal_analysis', 'risk_assessment', 'compliance_review', 'cross_document_synthesis'],
    analysis_depth: 'expert' as const,
    confidence_threshold: 0.8
  },
  financial: {
    name: 'Financial Analyst',
    icon: TrendingUp,
    prompt: `You are a senior financial analyst with CFA certification and 20+ years experience.
Expertise areas:
1. Financial statement analysis with ratio calculations
2. Market trend identification and prediction
3. Risk assessment with quantified probabilities
4. Investment recommendations with target prices
5. Regulatory compliance analysis (SOX, SEC filings)

Provide quantitative analysis with supporting data and confidence intervals.`,
    reasoning_focus: ['financial_analysis', 'market_assessment', 'risk_quantification'],
    analysis_depth: 'expert' as const,
    confidence_threshold: 0.8
  },
  healthcare: {
    name: 'Healthcare Expert',
    icon: Stethoscope,
    prompt: `You are a board-certified physician with research experience and clinical expertise.
Specializations:
1. Clinical decision support with evidence levels
2. Drug interaction and contraindication analysis
3. Diagnostic differential reasoning
4. Treatment protocol optimization
5. Medical literature synthesis and meta-analysis

Provide evidence-based analysis with clinical confidence levels and safety considerations.`,
    reasoning_focus: ['clinical_reasoning', 'evidence_synthesis', 'risk_stratification'],
    analysis_depth: 'expert' as const,
    confidence_threshold: 0.9
  },
  technical: {
    name: 'Technical Architect',
    icon: Settings,
    prompt: `You are a principal software architect with 15+ years experience in scalable systems.
Focus on:
1. System design patterns and scalability analysis
2. Performance bottleneck identification
3. Security vulnerability assessment
4. Technology stack recommendations
5. Cost-benefit analysis of technical decisions

Provide architectural insights with implementation recommendations and risk assessments.`,
    reasoning_focus: ['technical_analysis', 'system_design', 'performance_optimization'],
    analysis_depth: 'expert' as const,
    confidence_threshold: 0.7
  }
};

export function AISpecializationSection({ apiKey }: AISpecializationProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<keyof typeof DOMAIN_PRESETS | 'custom'>('legal');
  const [reasoningFocus, setReasoningFocus] = useState<string[]>(['general_analysis']);
  const [analysisDepth, setAnalysisDepth] = useState<'surface' | 'detailed' | 'expert'>('expert');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);

  const {
    configureSpecialization,
    specializationData,
    isLoadingSpecialization,
    specializationError,
    isConfiguringSpecialization,
    refetchSpecialization
  } = useVRINService({ apiKey });

  const handlePresetSelect = (domain: keyof typeof DOMAIN_PRESETS) => {
    const preset = DOMAIN_PRESETS[domain];
    setSelectedDomain(domain);
    setCustomPrompt(preset.prompt);
    setReasoningFocus(preset.reasoning_focus);
    setAnalysisDepth(preset.analysis_depth);
    setConfidenceThreshold(preset.confidence_threshold);
  };

  const handleConfigureSpecialization = async () => {
    if (!customPrompt.trim()) return;

    try {
      await configureSpecialization(
        customPrompt,
        reasoningFocus,
        analysisDepth,
        confidenceThreshold,
        10 // max reasoning chains
      );
      await refetchSpecialization();
    } catch (error) {
      console.error('Failed to configure specialization:', error);
    }
  };

  const currentSpecialization = specializationData?.success ? specializationData : null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Specialization Configuration
              <Badge variant="secondary">v0.3.2</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Define your custom AI expert for domain-specific analysis and reasoning
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="presets" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="presets">Domain Presets</TabsTrigger>
                <TabsTrigger value="custom">Custom Expert</TabsTrigger>
              </TabsList>

              <TabsContent value="presets" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(DOMAIN_PRESETS).map(([key, preset]) => {
                    const Icon = preset.icon;
                    return (
                      <Card 
                        key={key}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedDomain === key ? 'ring-2 ring-purple-500' : ''
                        }`}
                        onClick={() => handlePresetSelect(key as keyof typeof DOMAIN_PRESETS)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Icon className="h-4 w-4" />
                            {preset.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {preset.prompt.split('\n')[0]}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {preset.reasoning_focus.slice(0, 2).map(focus => (
                              <Badge key={focus} variant="outline" className="text-xs">
                                {focus.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-prompt">Custom Expert Prompt</Label>
                    <Textarea
                      id="custom-prompt"
                      placeholder="Define your custom AI expert (e.g., 'You are a senior investment banker with 20+ years experience...')"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="min-h-[150px] mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="analysis-depth">Analysis Depth</Label>
                      <select
                        id="analysis-depth"
                        value={analysisDepth}
                        onChange={(e) => setAnalysisDepth(e.target.value as any)}
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                      >
                        <option value="surface">Surface</option>
                        <option value="detailed">Detailed</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                      <Input
                        id="confidence-threshold"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={confidenceThreshold}
                        onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Reasoning Focus Areas</Label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        'legal_analysis',
                        'financial_analysis', 
                        'technical_analysis',
                        'risk_assessment',
                        'market_assessment',
                        'cross_document_synthesis',
                        'causal_chains',
                        'pattern_recognition'
                      ].map(focus => (
                        <label key={focus} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={reasoningFocus.includes(focus)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setReasoningFocus([...reasoningFocus, focus]);
                              } else {
                                setReasoningFocus(reasoningFocus.filter(f => f !== focus));
                              }
                            }}
                          />
                          <span className="text-sm">{focus.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-between items-center">
              <Button
                onClick={handleConfigureSpecialization}
                disabled={!customPrompt.trim() || isConfiguringSpecialization}
                className="flex items-center gap-2"
              >
                {isConfiguringSpecialization ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Configuring...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Configure Expert
                  </>
                )}
              </Button>

              {currentSpecialization && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Expert Configured</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Specialization Status */}
      {currentSpecialization && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Current Expert Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Expert Prompt:</Label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    {currentSpecialization.custom_prompts?.user_specialization?.substring(0, 200)}
                    {(currentSpecialization.custom_prompts?.user_specialization?.length || 0) > 200 ? '...' : ''}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Analysis Depth:</Label>
                    <Badge variant="secondary" className="ml-2">
                      {currentSpecialization.analysis_depth}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Confidence Threshold:</Label>
                    <Badge variant="secondary" className="ml-2">
                      {currentSpecialization.confidence_threshold}
                    </Badge>
                  </div>
                </div>

                {currentSpecialization.reasoning_focus && (
                  <div>
                    <Label className="text-sm font-medium">Reasoning Focus:</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {currentSpecialization.reasoning_focus.map(focus => (
                        <Badge key={focus} variant="outline">
                          {focus.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {specializationError && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                {specializationError.message || 'Failed to load specialization configuration'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}