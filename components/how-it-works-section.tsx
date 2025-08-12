'use client';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  Database, 
  Brain, 
  Search, 
  Zap, 
  Clock,
  CheckCircle,
  TrendingUp,
  Network
} from 'lucide-react';

interface PipelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  performance?: string;
}

const ingestionSteps: PipelineStep[] = [
  {
    id: 'content',
    title: 'Content Input',
    description: 'Structured text, documents, and data sources',
    icon: <Database className="w-6 h-6" />,
    color: '#3B82F6'
  },
  {
    id: 'extraction',
    title: 'Fact Extraction',
    description: 'GPT-4o-mini powered intelligent fact extraction with confidence scoring',
    icon: <Brain className="w-6 h-6" />,
    color: '#8B5CF6',
    performance: '<25s'
  },
  {
    id: 'deduplication',
    title: 'Smart Deduplication',
    description: '40-60% storage reduction through semantic similarity detection',
    icon: <TrendingUp className="w-6 h-6" />,
    color: '#10B981',
    performance: '40-60% reduction'
  },
  {
    id: 'storage',
    title: 'Store to Neptune/OpenSearch',
    description: 'Dual storage: Knowledge graphs and vector embeddings with full provenance',
    icon: <Network className="w-6 h-6" />,
    color: '#F59E0B'
  }
];

const querySteps: PipelineStep[] = [
  {
    id: 'specialization',
    title: 'Load Specialization',
    description: 'Retrieve user-defined expert configuration and reasoning parameters',
    icon: <Brain className="w-6 h-6" />,
    color: '#3B82F6'
  },
  {
    id: 'entities',
    title: 'Extract Entities',
    description: 'NLP-powered entity recognition from user queries',
    icon: <Search className="w-6 h-6" />,
    color: '#8B5CF6'
  },
  {
    id: 'retrieval',
    title: 'Graph + Vector Retrieval',
    description: 'Hybrid search combining knowledge graphs and semantic similarity',
    icon: <Network className="w-6 h-6" />,
    color: '#10B981',
    performance: 'Graph: <500ms, Vector: <200ms'
  },
  {
    id: 'synthesis',
    title: 'Multi-hop Synthesis',
    description: 'Cross-document reasoning with relationship traversal and expert analysis',
    icon: <Zap className="w-6 h-6" />,
    color: '#F59E0B',
    performance: '<5s'
  }
];

const performanceMetrics = [
  {
    metric: 'Hybrid Query Response',
    target: '< 20s',
    description: 'Complete expert reasoning with multi-hop analysis',
    achieved: true
  },
  {
    metric: 'Graph Traversal',
    target: '< 500ms',
    description: 'Entity lookup and relationship navigation',
    achieved: true
  },
  {
    metric: 'Vector Search',
    target: '< 200ms',
    description: 'Semantic similarity matching',
    achieved: true
  },
  {
    metric: 'Multi-hop Synthesis',
    target: '< 5s',
    description: 'Cross-document pattern recognition',
    achieved: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1
  }
};

function PipelineStep({ step, index, isLast }: { step: PipelineStep; index: number; isLast: boolean }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      variants={stepVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Step Card */}
      <div
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 relative z-10"
        style={{
          background: `linear-gradient(135deg, ${step.color}10 0%, white 50%)`
        }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white"
          style={{ backgroundColor: step.color }}
        >
          {step.icon}
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {step.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {step.description}
        </p>

        {/* Performance Badge */}
        {step.performance && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            {step.performance}
          </div>
        )}
      </div>

      {/* Arrow to next step */}
      {!isLast && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center my-6"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <ArrowDown className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HowItWorksSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium mb-4">
              System Architecture
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-6"
          >
            How it Works
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Two powerful pipelines working together to deliver expert-level AI analysis 
            with unprecedented speed and accuracy.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Ingestion Pipeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <Database className="w-8 h-8 text-blue-600" />
                Ingestion Pipeline
              </h3>
              <p className="text-gray-600">
                Transform raw content into structured, searchable knowledge
              </p>
            </motion.div>

            <div className="space-y-4">
              {ingestionSteps.map((step, index) => (
                <PipelineStep
                  key={step.id}
                  step={step}
                  index={index}
                  isLast={index === ingestionSteps.length - 1}
                />
              ))}
            </div>
          </motion.div>

          {/* Query Pipeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <Search className="w-8 h-8 text-purple-600" />
                Query Pipeline
              </h3>
              <p className="text-gray-600">
                Deliver expert insights through intelligent retrieval and reasoning
              </p>
            </motion.div>

            <div className="space-y-4">
              {querySteps.map((step, index) => (
                <PipelineStep
                  key={step.id}
                  step={step}
                  index={index}
                  isLast={index === querySteps.length - 1}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Performance Targets
            </h3>
            <p className="text-gray-600 text-lg">
              Production-validated performance metrics across all system components
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-gray-200/50"
              >
                <div className="flex justify-center mb-4">
                  {metric.achieved ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <Clock className="w-8 h-8 text-yellow-500" />
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {metric.target}
                </div>
                <div className="text-lg font-semibold text-blue-600 mb-2">
                  {metric.metric}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {metric.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}