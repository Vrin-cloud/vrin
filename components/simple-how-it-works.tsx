'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ingestionSteps = [
  {
    title: 'Content Input',
    description: 'Structured text, documents, and data sources',
    icon: Database,
    performance: null
  },
  {
    title: 'Fact Extraction',
    description: 'GPT-4o-mini powered intelligent fact extraction with confidence scoring',
    icon: Brain,
    performance: '<25s'
  },
  {
    title: 'Smart Deduplication',
    description: '40-60% storage reduction through semantic similarity detection',
    icon: TrendingUp,
    performance: '40-60% reduction'
  },
  {
    title: 'Store to Neptune/OpenSearch',
    description: 'Dual storage: Knowledge graphs and vector embeddings with full provenance',
    icon: Network,
    performance: null
  }
];

const querySteps = [
  {
    title: 'Load Specialization',
    description: 'Retrieve user-defined expert configuration and reasoning parameters',
    icon: Brain,
    performance: null
  },
  {
    title: 'Extract Entities',
    description: 'NLP-powered entity recognition from user queries',
    icon: Search,
    performance: null
  },
  {
    title: 'Graph + Vector Retrieval',
    description: 'Hybrid search combining knowledge graphs and semantic similarity',
    icon: Network,
    performance: 'Graph: <500ms, Vector: <200ms'
  },
  {
    title: 'Multi-hop Synthesis',
    description: 'Cross-document reasoning with relationship traversal and expert analysis',
    icon: Zap,
    performance: '<5s'
  }
];

const performanceMetrics = [
  {
    metric: 'Hybrid Query Response',
    target: '< 1.8s',
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

function PipelineStep({ step, index, isLast }: { step: any; index: number; isLast: boolean }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2">
              {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {step.description}
            </p>
            {step.performance && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {step.performance}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {!isLast && (
        <div className="flex justify-center my-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <ArrowDown className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function SimpleHowItWorks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium mb-4">
            System Architecture
          </span>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            How it Works
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Two powerful pipelines working together to deliver expert-level AI analysis 
            with unprecedented speed and accuracy.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Ingestion Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                <Database className="w-8 h-8 text-blue-600" />
                Ingestion Pipeline
              </h3>
              <p className="text-muted-foreground">
                Transform raw content into structured, searchable knowledge
              </p>
            </div>

            <div className="space-y-4">
              {ingestionSteps.map((step, index) => (
                <PipelineStep
                  key={step.title}
                  step={step}
                  index={index}
                  isLast={index === ingestionSteps.length - 1}
                />
              ))}
            </div>
          </motion.div>

          {/* Query Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                <Search className="w-8 h-8 text-purple-600" />
                Query Pipeline
              </h3>
              <p className="text-muted-foreground">
                Deliver expert insights through intelligent retrieval and reasoning
              </p>
            </div>

            <div className="space-y-4">
              {querySteps.map((step, index) => (
                <PipelineStep
                  key={step.title}
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
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl p-8 md:p-12 border border-border/50"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              Performance Targets
            </h3>
            <p className="text-muted-foreground text-lg">
              Production-validated performance metrics across all system components
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-border/50 bg-background/80">
                  <div className="flex justify-center mb-4">
                    {metric.achieved ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <Clock className="w-8 h-8 text-yellow-500" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">
                    {metric.target}
                  </div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    {metric.metric}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {metric.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}