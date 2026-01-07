'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Quote, 
  Star, 
  TrendingUp, 
  Users, 
  Award, 
  Shield,
  ArrowRight,
  CheckCircle,
  Building,
  Globe
} from 'lucide-react';

export function EnterpriseSocialProof() {
  const caseStudies = [
    {
      company: "Healthcare AI Platform",
      industry: "Healthcare",
      challenge: "Needed persistent memory for patient interactions",
      solution: "Vrin's memory orchestration platform",
      results: [
        "450x faster patient context retrieval",
        "98.7% accuracy in medical context",
        "90% reduction in response time",
        "Real-time knowledge graph updates"
      ],
      logo: "/logos/healthcare-platform.svg"
    },
    {
      company: "Financial Services AI",
      industry: "FinTech",
      challenge: "Required real-time memory for fraud detection",
      solution: "Vrin's temporal knowledge graphs",
      results: [
        "Sub-second fraud pattern recognition",
        "Real-time transaction monitoring",
        "99.9% uptime SLA maintained",
        "Zero false positives"
      ],
      logo: "/logos/financial-services.svg"
    },
    {
      company: "Enterprise SaaS Platform",
      industry: "Technology",
      challenge: "Scaling AI agents across 10M+ users",
      solution: "Vrin's hybrid RAG architecture",
      results: [
        "10M+ concurrent user sessions",
        "450x faster than traditional RAG",
        "90% context window efficiency",
        "Zero downtime deployment"
      ],
      logo: "/logos/saas-platform.svg"
    }
  ];

  const metrics = [
    {
      number: "450x",
      label: "Faster Retrieval",
      description: "vs traditional RAG systems"
    },
    {
      number: "98.7%",
      label: "Accuracy Rate",
      description: "in context retrieval"
    },
    {
      number: "99.9%",
      label: "Uptime SLA",
      description: "enterprise-grade reliability"
    },
    {
      number: "10M+",
      label: "Concurrent Users",
      description: "successfully supported"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Built for Production Scale
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leading developers and organizations trust Vrin to power their AI applications 
              with unmatched performance and reliability.
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-3xl md:text-4xl font-light text-blue-400 mb-2">
                    {metric.number}
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    {metric.label}
                  </div>
                  <div className="text-sm text-gray-300">
                    {metric.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Case Studies */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              Success Stories
            </h3>
            <div className="space-y-8">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.company}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <Building className="h-6 w-6 text-blue-400" />
                        <span className="text-sm text-blue-400 font-medium">
                          {study.industry}
                        </span>
                      </div>
                      <h4 className="text-xl font-semibold mb-2">
                        {study.company}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-300 mb-1">Challenge</h5>
                          <p className="text-sm text-gray-400">{study.challenge}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-300 mb-1">Solution</h5>
                          <p className="text-sm text-gray-400">{study.solution}</p>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <h5 className="font-medium text-gray-300 mb-3">Results</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {study.results.map((result, resultIndex) => (
                          <div key={resultIndex} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-200">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">
                Production-Ready Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center justify-center space-x-3">
                  <Shield className="h-8 w-8 text-green-400" />
                  <div className="text-left">
                    <div className="font-semibold">User Isolation</div>
                    <div className="text-sm text-gray-300">Complete data privacy</div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Award className="h-8 w-8 text-blue-400" />
                  <div className="text-left">
                    <div className="font-semibold">99.9% Uptime</div>
                    <div className="text-sm text-gray-300">Enterprise-grade reliability</div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Globe className="h-8 w-8 text-purple-400" />
                  <div className="text-left">
                    <div className="font-semibold">Global Infrastructure</div>
                    <div className="text-sm text-gray-300">Scalable cloud deployment</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Scale Your AI Applications?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                See why leading developers choose Vrin for their AI memory orchestration needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <a href="https://calendly.com/vedant-vrin/15-minute-meeting" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">
                  <Users className="mr-2 h-5 w-5" />
                  Schedule Demo
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 