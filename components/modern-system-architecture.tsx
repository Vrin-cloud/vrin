'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ArrowRight, 
  Database, 
  Brain, 
  Search, 
  Zap, 
  Clock,
  CheckCircle,
  TrendingUp,
  Network,
  Upload,
  Download,
  GitBranch,
  Activity,
  FileText,
  Layers,
  Server,
  Cpu,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const architecturePipelines = [
  {
    id: 'traditional',
    title: 'Traditional RAG Pipeline',
    description: 'Standard vector-based retrieval with limited context understanding and no domain specialization.',
    performance: { accuracy: '68.18 F1', speed: '~2-5s', limitation: 'Single-hop only' },
    components: [
      { name: 'Document Store', icon: FileText, type: 'storage' },
      { name: 'Vector Embeddings', icon: Database, type: 'processing' },
      { name: 'Similarity Search', icon: Search, type: 'retrieval' },
      { name: 'Basic LLM', icon: Brain, type: 'generation' }
    ]
  },
  {
    id: 'graph',
    title: 'Graph RAG Pipeline',
    description: 'Relationship-based traversal system optimized for multi-hop queries but lacks user-defined specialization.',
    performance: { accuracy: '71.17 Acc', speed: '~5-10s', limitation: 'No specialization' },
    components: [
      { name: 'Knowledge Graph', icon: Network, type: 'storage' },
      { name: 'Entity Extraction', icon: GitBranch, type: 'processing' },
      { name: 'Graph Traversal', icon: Layers, type: 'retrieval' },
      { name: 'Context LLM', icon: Brain, type: 'generation' }
    ]
  },
  {
    id: 'hybrid',
    title: 'VRIN HybridRAG Pipeline',
    description: 'Intelligent query routing with user-defined AI experts, combining vector search and graph traversal.',
    performance: { accuracy: '71.17+ Acc', speed: '<20s', limitation: 'None identified' },
    components: [
      { name: 'Dual Storage', icon: Database, type: 'storage' },
      { name: 'Query Router', icon: Zap, type: 'processing' },
      { name: 'Hybrid Retrieval', icon: Search, type: 'retrieval' },
      { name: 'Expert LLM', icon: Brain, type: 'generation' },
      { name: 'Facts Engine', icon: Cpu, type: 'processing' },
      { name: 'Specialization', icon: Activity, type: 'enhancement' }
    ]
  }
];

const getComponentColor = (type: string) => {
  switch (type) {
    case 'storage': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    case 'processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    case 'retrieval': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    case 'generation': return 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200';
    case 'enhancement': return 'bg-blue-200 dark:bg-blue-800/30 text-blue-800 dark:text-blue-200';
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  }
};

interface PipelineDiagramProps {
  pipeline: typeof architecturePipelines[0];
  index: number;
  isInView: boolean;
}

function PipelineDiagram({ pipeline, index, isInView }: PipelineDiagramProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="mb-20"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
          <div className="mb-6">
            <Badge variant="outline" className="mb-3">
              Pipeline {index + 1}
            </Badge>
            <h3 className="text-3xl font-medium text-foreground mb-4">
              {pipeline.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {pipeline.description}
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background border border-border/50 rounded-lg">
                <div className="text-lg font-medium text-foreground">
                  {pipeline.performance.accuracy}
                </div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-background border border-border/50 rounded-lg">
                <div className="text-lg font-medium text-foreground">
                  {pipeline.performance.speed}
                </div>
                <div className="text-xs text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center p-4 bg-background border border-border/50 rounded-lg">
                <div className="text-lg font-medium text-red-600 dark:text-red-400">
                  {pipeline.performance.limitation}
                </div>
                <div className="text-xs text-muted-foreground">Limitation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
          <div className="bg-background border border-border/50 rounded-xl p-8">
            <div className="text-center mb-6">
              <h4 className="text-lg font-medium text-foreground mb-2">System Architecture</h4>
              <div className="w-full h-px bg-border"></div>
            </div>
            
            {/* Diagram Flow */}
            <div className="space-y-6">
              {/* Input */}
              <div className="flex items-center">
                <div className="w-20 h-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Input</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 mx-3" />
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>

              {/* Processing Components */}
              <div className="grid grid-cols-2 gap-4">
                {pipeline.components.map((component, idx) => {
                  const Icon = component.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (index * 0.2) + (idx * 0.1) }}
                      className={`
                        p-4 rounded-lg border ${getComponentColor(component.type)}
                        hover:shadow-md transition-all duration-200
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{component.name}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Output */}
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                <ArrowRight className="w-4 h-4 text-gray-400 mx-3" />
                <div className="w-20 h-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                  <Brain className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">Output</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ModernSystemArchitecture() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1">
            System Architecture Comparison
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
            Architecture Comparison: Traditional vs HybridRAG
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Technical analysis of different RAG pipeline architectures, comparing performance, 
            limitations, and architectural components across three distinct approaches.
          </p>
        </motion.div>

        {/* Pipeline Comparisons */}
        <div className="space-y-0">
          {architecturePipelines.map((pipeline, index) => (
            <PipelineDiagram
              key={pipeline.id}
              pipeline={pipeline}
              index={index}
              isInView={inView}
            />
          ))}
        </div>

        {/* Summary Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 md:p-12 border border-border/50"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-medium text-foreground mb-4">
              Architecture Performance Summary
            </h3>
            <p className="text-muted-foreground text-lg">
              Comparative analysis across key performance metrics
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-medium text-foreground">Architecture</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground">Accuracy</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground">Speed</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground">Specialization</th>
                  <th className="text-left py-4 px-6 font-medium text-foreground">Multi-hop</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-6 text-muted-foreground">Traditional RAG</td>
                  <td className="py-4 px-6 text-muted-foreground">68.18 F1</td>
                  <td className="py-4 px-6 text-muted-foreground">~2-5s</td>
                  <td className="py-4 px-6 text-red-600 dark:text-red-400">None</td>
                  <td className="py-4 px-6 text-red-600 dark:text-red-400">Limited</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-6 text-muted-foreground">Graph RAG</td>
                  <td className="py-4 px-6 text-muted-foreground">71.17 Acc</td>
                  <td className="py-4 px-6 text-muted-foreground">~5-10s</td>
                  <td className="py-4 px-6 text-red-600 dark:text-red-400">None</td>
                  <td className="py-4 px-6 text-green-600 dark:text-green-400">Good</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-foreground">VRIN HybridRAG</td>
                  <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-medium">71.17+ Acc</td>
                  <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-medium">&lt;20s</td>
                  <td className="py-4 px-6 text-green-600 dark:text-green-400 font-medium">User-Defined</td>
                  <td className="py-4 px-6 text-green-600 dark:text-green-400 font-medium">Advanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}