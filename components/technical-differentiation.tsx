'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Shield, 
  Database, 
  Cpu, 
  Network, 
  Lock, 
  ArrowRight,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

export function TechnicalDifferentiation() {
  const vrinAdvantages = [
    {
      icon: Zap,
      title: "Hybrid RAG Architecture",
      description: "Combines dense and sparse retrieval for optimal performance",
      benefit: "450x faster than traditional RAG",
      color: "text-orange-600"
    },
    {
      icon: Brain,
      title: "Adaptive Memory Orchestration",
      description: "Dynamically adjusts retrieval strategy based on query patterns",
      benefit: "98.7% accuracy vs 94.2% baseline",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "User isolation and data privacy with complete audit logging",
      benefit: "Production-ready security",
      color: "text-green-600"
    },
    {
      icon: Database,
      title: "Temporal Knowledge Graphs",
      description: "Real-time graph updates with conflict resolution",
      benefit: "90% context window efficiency",
      color: "text-blue-600"
    }
  ];

  const comparisonTable = [
    {
      feature: "Retrieval Architecture",
      vrin: "Hybrid RAG (Dense + Sparse)",
      competitor: "Traditional RAG",
      advantage: "450x faster retrieval"
    },
    {
      feature: "Memory Accuracy",
      vrin: "98.7%",
      competitor: "94.2%",
      advantage: "+4.5% improvement"
    },
    {
      feature: "Context Efficiency",
      vrin: "90% token utilization",
      competitor: "65% token utilization",
      advantage: "+25% efficiency"
    },
    {
      feature: "Multi-hop Reasoning",
      vrin: "+5.4pts improvement",
      competitor: "Baseline performance",
      advantage: "Superior reasoning"
    },
    {
      feature: "Security Features",
      vrin: "User isolation + Audit logging",
      competitor: "Basic authentication",
      advantage: "Enterprise ready"
    },
    {
      feature: "Real-time Updates",
      vrin: "Sub-second latency",
      competitor: "Batch processing",
      advantage: "Live data sync"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Why Vrin Outperforms
              <span className="gradient-text"> Every Alternative</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While competitors focus on basic memory storage, Vrin delivers intelligent orchestration 
              that adapts to your specific use case and scales with your business.
            </p>
          </motion.div>

          {/* Technical Advantages Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {vrinAdvantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gray-50 ${advantage.color} bg-opacity-10`}>
                      <Icon className={`h-8 w-8 ${advantage.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {advantage.description}
                      </p>
                      <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {advantage.benefit}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Performance Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg mb-16"
          >
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Head-to-Head Performance Comparison
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Independent benchmarks conducted across 100+ enterprise use cases
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Vrin
                    </th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Competitors
                    </th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Advantage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {comparisonTable.map((row, index) => (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                      viewport={{ once: true }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-8 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {row.feature}
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {row.vrin}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                          <XCircle className="h-4 w-4 mr-1" />
                          {row.competitor}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {row.advantage}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Architecture Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vrin&apos;s Revolutionary Architecture
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our hybrid approach combines the best of dense and sparse retrieval with 
                intelligent orchestration for unmatched performance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Layer */}
              <div className="text-center">
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <Database className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Multi-Modal Input</h4>
                  <p className="text-sm text-gray-600">
                    Conversations, documents, structured data
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 mx-auto rotate-90 lg:rotate-0" />
              </div>

              {/* Processing Layer */}
              <div className="text-center">
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Hybrid RAG Engine</h4>
                  <p className="text-sm text-gray-600">
                    Dense + Sparse retrieval with conflict resolution
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 mx-auto rotate-90 lg:rotate-0" />
              </div>

              {/* Output Layer */}
              <div className="text-center">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Optimized Context</h4>
                  <p className="text-sm text-gray-600">
                    450x faster retrieval with 98.7% accuracy
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Experience the Difference?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join leading developers that have already switched to Vrin and 
                are experiencing unprecedented performance improvements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <a href="https://calendly.com/vedant-vrin/15-minute-meeting" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <Clock className="mr-2 h-5 w-5" />
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