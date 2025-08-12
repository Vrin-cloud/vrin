'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Code, 
  Terminal, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Copy,
  Download,
  Play,
  Cpu,
  Database,
  Cloud,
  Settings,
  Monitor,
  Shield,
  GitBranch,
  Package,
  Layers,
  FileCode,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const integrationSteps = [
  {
    id: 'install',
    title: 'Install SDK',
    description: 'Get started with VRIN SDK v0.3.3 in seconds',
    icon: Package,
    command: 'pip install vrin==0.3.3',
    language: 'bash',
    notes: 'Latest stable version with enhanced multi-hop reasoning'
  },
  {
    id: 'initialize',
    title: 'Initialize Client',
    description: 'Simple setup with production-ready authentication',
    icon: Settings,
    command: `from vrin import VRINClient

# Production endpoints built-in
client = VRINClient(api_key="vrin_your_api_key")`,
    language: 'python',
    notes: 'No base_url needed - production APIs hardcoded'
  },
  {
    id: 'specialize',
    title: 'Configure Expert',
    description: 'Define custom AI specialization for your domain',
    icon: Sparkles,
    command: `# Define YOUR custom expert
custom_expert = """
You are a senior M&A legal partner with 25+ years experience.
Focus on risk quantification, cross-document synthesis,
and strategic recommendations with dollar amounts.
"""

# Configure VRIN with YOUR expert
result = client.specialize(
    custom_prompt=custom_expert,
    reasoning_focus=["cross_document_synthesis", "causal_chains"],
    analysis_depth="expert",
    confidence_threshold=0.8
)`,
    language: 'python',
    notes: 'Revolutionary user-defined specialization - no rigid templates'
  },
  {
    id: 'insert',
    title: 'Insert Knowledge',
    description: 'Smart deduplication with 40-60% storage reduction',
    icon: Database,
    command: `# Insert with expert processing
result = client.insert(
    content="Your document content here...",
    title="Strategic Analysis Report",
    tags=["analysis", "strategic", "legal"]
)

print(f"Facts extracted: {result['facts_extracted']}")
print(f"Storage efficiency: {result['storage_details']}")
print(f"Expert validated: {result['expert_validated']}")`,
    language: 'python',
    notes: 'Intelligent deduplication and confidence scoring'
  },
  {
    id: 'query',
    title: 'Expert Query',
    description: 'Multi-hop reasoning with professional insights',
    icon: Zap,
    command: `# Query with expert analysis
response = client.query(
    "What are the strategic risks in this M&A transaction?"
)

# Expert-level response with reasoning
print(f"Expert analysis: {response['summary']}")
print(f"Reasoning chains: {response['multi_hop_chains']}")
print(f"Cross-doc patterns: {response['cross_document_patterns']}")
print(f"Search time: {response['search_time']}")  # Typically <20s`,
    language: 'python',
    notes: 'Sub-20s expert analysis with multi-hop reasoning'
  }
];

const enterpriseFeatures = [
  {
    title: 'Production APIs',
    description: 'Built-in production endpoints with 99.9% uptime SLA',
    icon: Cloud,
    metrics: ['99.9% uptime', 'Global CDN', 'Auto-scaling']
  },
  {
    title: 'Expert Specialization',
    description: 'User-defined AI experts - no rigid templates',
    icon: Sparkles,
    metrics: ['Custom prompts', 'Domain expertise', 'Reasoning focus']
  },
  {
    title: 'Multi-hop Reasoning',
    description: 'Cross-document synthesis with relationship traversal',
    icon: GitBranch,
    metrics: ['3-hop traversal', 'Pattern detection', 'Conflict resolution']
  },
  {
    title: 'Smart Deduplication',
    description: '40-60% storage reduction through intelligent optimization',
    icon: Layers,
    metrics: ['Content similarity', 'Semantic analysis', 'Confidence scoring']
  },
  {
    title: 'Enterprise Security',
    description: 'JWT authentication, user isolation, audit logging',
    icon: Shield,
    metrics: ['Bearer tokens', 'Data isolation', 'Audit trail']
  },
  {
    title: 'Performance Optimized',
    description: 'Sub-20s expert queries with production monitoring',
    icon: Monitor,
    metrics: ['<20s queries', 'CloudWatch', 'Performance SLAs']
  }
];

const performanceMetrics = [
  {
    metric: 'Expert Query Response',
    value: '< 20s',
    description: 'Complete multi-hop analysis',
    improvement: '450x faster than traditional RAG',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    metric: 'Storage Efficiency',
    value: '40-60%',
    description: 'Space reduction achieved',
    improvement: 'vs. unoptimized systems',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    metric: 'Expert Validation',
    value: '8.5/10',
    description: 'Performance vs professionals',
    improvement: 'M&A legal smoking gun test',
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    metric: 'Multi-hop Accuracy',
    value: '+5.4pts',
    description: 'Cross-document reasoning',
    improvement: 'Over traditional systems',
    color: 'text-orange-600 dark:text-orange-400'
  }
];

const frameworks = [
  { name: 'React/Next.js', logo: '⚛️', integration: 'TypeScript SDK' },
  { name: 'Python/Django', logo: '🐍', integration: 'Native SDK' },
  { name: 'Node.js/Express', logo: '🟢', integration: 'REST API' },
  { name: 'FastAPI', logo: '⚡', integration: 'Python SDK' },
  { name: 'LangChain', logo: '🦜', integration: 'Plugin Ready' },
  { name: 'AWS Lambda', logo: '☁️', integration: 'Serverless' }
];

interface CodeBlockProps {
  step: typeof integrationSteps[0];
  isActive: boolean;
  onClick: () => void;
}

function CodeBlock({ step, isActive, onClick }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(step.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className={`
          cursor-pointer transition-all duration-500 border-2 hover:shadow-xl
          ${isActive 
            ? 'border-blue-300 shadow-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 scale-105' 
            : 'border-border/50 hover:border-blue-200 hover:scale-102 bg-background/80'
          }
          backdrop-blur-sm
        `}
        onClick={onClick}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 
                flex items-center justify-center
                ${isActive ? 'scale-110' : ''}
                transition-transform duration-300
              `}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="opacity-70 hover:opacity-100"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Code Block */}
          <div className="relative">
            <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-3 text-slate-400 text-xs">
                  {step.id}.{step.language}
                </span>
              </div>
              
              <pre className="text-sm text-green-400 leading-relaxed overflow-x-auto">
                <code>{step.command}</code>
              </pre>
            </div>
            
            {/* Notes */}
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <FileCode className="w-3 h-3" />
                {step.notes}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function ProfessionalIntegrationSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [activeStepId, setActiveStepId] = useState<string>('install');
  
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
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-medium mb-4">
            Enterprise Integration
          </span>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            Production-Ready SDK
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Get started in minutes with VRIN SDK v0.3.3. Production endpoints, enterprise authentication, 
            and user-defined AI specialization built-in. No complex configuration required.
          </p>
        </motion.div>

        {/* Integration Steps */}
        <div className="grid lg:grid-cols-1 gap-8 mb-20">
          {integrationSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CodeBlock
                step={step}
                isActive={activeStepId === step.id}
                onClick={() => setActiveStepId(step.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Enterprise Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Enterprise-Grade Features
            </h3>
            <p className="text-lg text-muted-foreground">
              Built for production with enterprise security, scalability, and performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-background to-muted/30">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      {feature.title}
                    </h4>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {feature.metrics.map((metric, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-950/20 dark:to-blue-950/20 rounded-3xl p-8 md:p-12 border border-border/50 mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Production Performance
            </h3>
            <p className="text-lg text-muted-foreground">
              Validated metrics from enterprise deployments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                className="text-center"
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-background/90">
                  <div className={`text-3xl font-bold mb-2 ${metric.color}`}>
                    {metric.value}
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-2">
                    {metric.metric}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {metric.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {metric.improvement}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Framework Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Works with Your Stack
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {frameworks.map((framework, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 1.8 + index * 0.1 }}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors duration-300"
              >
                <div className="text-3xl mb-2">{framework.logo}</div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {framework.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {framework.integration}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 px-8 py-4"
            >
              <Download className="mr-2 h-5 w-5" />
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4"
            >
              <FileCode className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}