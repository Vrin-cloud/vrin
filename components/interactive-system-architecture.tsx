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
  Network,
  ArrowRight,
  ArrowUpRight,
  Layers,
  GitBranch,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

const pipelineSteps = [
  {
    id: 'input',
    title: 'Content Input',
    description: 'Structured text, documents, and data sources',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
    position: { x: 0, y: 0 },
    connections: ['extraction']
  },
  {
    id: 'extraction',
    title: 'Fact Extraction',
    description: 'GPT-4o-mini powered intelligent fact extraction with confidence scoring',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
    performance: '<25s',
    position: { x: 1, y: 0 },
    connections: ['deduplication']
  },
  {
    id: 'deduplication',
    title: 'Smart Deduplication',
    description: '40-60% storage reduction through semantic similarity detection',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10 dark:bg-green-500/20',
    performance: '40-60% reduction',
    position: { x: 2, y: 0 },
    connections: ['storage']
  },
  {
    id: 'storage',
    title: 'Dual Storage',
    description: 'Neptune knowledge graphs and OpenSearch vector embeddings with full provenance',
    icon: Network,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    position: { x: 3, y: 0 },
    connections: ['query']
  },
  {
    id: 'query',
    title: 'Query Processing',
    description: 'Load user specialization and extract entities from queries',
    icon: Search,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
    position: { x: 3, y: 1 },
    connections: ['retrieval']
  },
  {
    id: 'retrieval',
    title: 'Hybrid Retrieval',
    description: 'Parallel graph traversal and vector search with intelligent routing',
    icon: GitBranch,
    color: 'from-cyan-500 to-teal-500',
    bgColor: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    performance: 'Graph: <500ms, Vector: <200ms',
    position: { x: 2, y: 1 },
    connections: ['synthesis']
  },
  {
    id: 'synthesis',
    title: 'Multi-hop Synthesis',
    description: 'Cross-document reasoning with relationship traversal and expert analysis',
    icon: Zap,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/20',
    performance: '<5s',
    position: { x: 1, y: 1 },
    connections: ['output']
  },
  {
    id: 'output',
    title: 'Expert Response',
    description: 'Domain-specific insights with confidence scoring and provenance',
    icon: Activity,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10 dark:bg-violet-500/20',
    position: { x: 0, y: 1 },
    connections: []
  }
];

const performanceMetrics = [
  {
    metric: 'End-to-End Response',
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
    metric: 'Storage Efficiency',
    target: '40-60%',
    description: 'Reduction through smart deduplication',
    achieved: true
  }
];

interface ArchitectureNodeProps {
  step: typeof pipelineSteps[0];
  isActive: boolean;
  isConnected: boolean;
  onClick: () => void;
  gridSize: number;
}

function ArchitectureNode({ step, isActive, isConnected, onClick, gridSize }: ArchitectureNodeProps) {
  const Icon = step.icon;
  const cellSize = gridSize / 4;
  
  return (
    <motion.div
      className={`absolute cursor-pointer transition-all duration-500 ${isActive ? 'z-20' : 'z-10'}`}
      style={{
        left: `${step.position.x * cellSize + cellSize * 0.1}px`,
        top: `${step.position.y * cellSize + cellSize * 0.1}px`,
        width: `${cellSize * 0.8}px`,
        height: `${cellSize * 0.8}px`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <Card 
        className={`
          w-full h-full p-4 transition-all duration-500 border-2
          ${isActive 
            ? 'border-blue-400 shadow-2xl scale-110 bg-background' 
            : isConnected 
              ? 'border-blue-200 shadow-lg bg-background/90' 
              : 'border-border/50 shadow-sm bg-background/70'
          }
          ${step.bgColor}
          hover:shadow-xl backdrop-blur-sm
        `}
      >
        <div className="flex flex-col h-full">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 mx-auto`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          
          <h4 className="text-sm font-bold text-foreground text-center mb-2 leading-tight">
            {step.title}
          </h4>
          
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <p className="text-xs text-muted-foreground text-center leading-relaxed mb-2">
                {step.description}
              </p>
              
              {step.performance && (
                <Badge variant="secondary" className="text-xs w-full justify-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {step.performance}
                </Badge>
              )}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function ConnectionLine({ from, to, isActive, gridSize }: { from: typeof pipelineSteps[0], to: typeof pipelineSteps[0], isActive: boolean, gridSize: number }) {
  const cellSize = gridSize / 4;
  const fromX = from.position.x * cellSize + cellSize * 0.5;
  const fromY = from.position.y * cellSize + cellSize * 0.5;
  const toX = to.position.x * cellSize + cellSize * 0.5;
  const toY = to.position.y * cellSize + cellSize * 0.5;
  
  const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
  
  return (
    <div
      className={`absolute transition-all duration-500 ${isActive ? 'z-15' : 'z-5'}`}
      style={{
        left: `${fromX}px`,
        top: `${fromY}px`,
        width: `${length}px`,
        height: '2px',
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
      }}
    >
      <div className={`
        w-full h-full transition-all duration-500 relative
        ${isActive 
          ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg' 
          : 'bg-gradient-to-r from-border to-border/50'
        }
      `}>
        {isActive && (
          <motion.div
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ArrowRight className="w-3 h-3 text-blue-400" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function InteractiveSystemArchitecture() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [activeNodeId, setActiveNodeId] = useState<string>('input');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [gridSize, setGridSize] = useState(600);

  // Auto-play through the pipeline
  useEffect(() => {
    if (!isAutoPlaying || !inView) return;
    
    const interval = setInterval(() => {
      setActiveNodeId(prev => {
        const currentIndex = pipelineSteps.findIndex(step => step.id === prev);
        const nextIndex = (currentIndex + 1) % pipelineSteps.length;
        return pipelineSteps[nextIndex].id;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, inView]);

  // Handle responsive grid size
  useEffect(() => {
    const updateGridSize = () => {
      if (window.innerWidth < 640) {
        setGridSize(350);
      } else if (window.innerWidth < 1024) {
        setGridSize(500);
      } else {
        setGridSize(600);
      }
    };
    
    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  const activeStep = pipelineSteps.find(step => step.id === activeNodeId);
  const connectedStepIds = activeStep ? [activeNodeId, ...activeStep.connections] : [activeNodeId];

  const handleNodeClick = (stepId: string) => {
    setActiveNodeId(stepId);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

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
            Interactive pipeline visualization showing how VRIN processes data through intelligent 
            fact extraction, hybrid retrieval, and multi-hop reasoning.
          </p>
        </motion.div>

        {/* Interactive Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div 
            className="relative bg-gradient-to-br from-background to-muted/50 rounded-3xl p-8 border border-border/50 shadow-2xl"
            style={{ width: gridSize + 100, height: gridSize / 2 + 100 }}
          >
            {/* Connection Lines */}
            {pipelineSteps.map((step) => 
              step.connections.map((connId) => {
                const targetStep = pipelineSteps.find(s => s.id === connId);
                if (!targetStep) return null;
                
                return (
                  <ConnectionLine
                    key={`${step.id}-${connId}`}
                    from={step}
                    to={targetStep}
                    isActive={connectedStepIds.includes(step.id) && connectedStepIds.includes(connId)}
                    gridSize={gridSize - 100}
                  />
                );
              })
            )}
            
            {/* Architecture Nodes */}
            {pipelineSteps.map((step) => (
              <ArchitectureNode
                key={step.id}
                step={step}
                isActive={activeNodeId === step.id}
                isConnected={connectedStepIds.includes(step.id)}
                onClick={() => handleNodeClick(step.id)}
                gridSize={gridSize - 100}
              />
            ))}
            
            {/* Flow Labels */}
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                <Layers className="w-3 h-3 mr-1" />
                Ingestion Pipeline
              </Badge>
            </div>
            
            <div className="absolute bottom-4 right-4">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Query Pipeline
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Active Step Details */}
        {activeStep && (
          <motion.div
            key={activeNodeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <Card className="p-8 bg-gradient-to-br from-background to-muted/30 border-2 border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeStep.color} flex items-center justify-center mx-auto mb-4`}>
                  <activeStep.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {activeStep.title}
                </h3>
                
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  {activeStep.description}
                </p>
                
                {activeStep.performance && (
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Performance: {activeStep.performance}
                  </Badge>
                )}
              </div>
            </Card>
          </motion.div>
        )}

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