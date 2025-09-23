'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Zap, 
  Brain, 
  Shield, 
  Database,
  ArrowRight,
  Star,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

export function VrinVsZepComparison() {
  const comparisonFeatures = [
    {
      feature: "Retrieval Architecture",
      vrin: {
        value: "Hybrid RAG (Dense + Sparse)",
        advantage: "450x faster than traditional RAG",
        icon: Zap,
        color: "text-green-600"
      },
      zep: {
        value: "Traditional RAG",
        disadvantage: "Limited to single approach",
        icon: XCircle,
        color: "text-red-600"
      }
    },
    {
      feature: "Memory Accuracy",
      vrin: {
        value: "98.7%",
        advantage: "Superior fact retention",
        icon: CheckCircle,
        color: "text-green-600"
      },
      zep: {
        value: "94.2%",
        disadvantage: "Standard baseline performance",
        icon: XCircle,
        color: "text-red-600"
      }
    },
    {
      feature: "Multi-hop Reasoning",
      vrin: {
        value: "+5.4pts improvement",
        advantage: "Superior complex query handling",
        icon: Brain,
        color: "text-green-600"
      },
      zep: {
        value: "Baseline performance",
        disadvantage: "Limited reasoning capabilities",
        icon: XCircle,
        color: "text-red-600"
      }
    },
    {
      feature: "Context Efficiency",
      vrin: {
        value: "90% token utilization",
        advantage: "25% more efficient",
        icon: TrendingUp,
        color: "text-green-600"
      },
      zep: {
        value: "65% token utilization",
        disadvantage: "Lower efficiency",
        icon: XCircle,
        color: "text-red-600"
      }
    },
    {
      feature: "Real-time Updates",
      vrin: {
        value: "Sub-second latency",
        advantage: "Live data synchronization",
        icon: Clock,
        color: "text-green-600"
      },
      zep: {
        value: "Batch processing",
        disadvantage: "Delayed updates",
        icon: XCircle,
        color: "text-red-600"
      }
    },
    {
      feature: "Developer Experience",
      vrin: {
        value: "3 lines of code",
        advantage: "Simplest integration",
        icon: Target,
        color: "text-green-600"
      },
      zep: {
        value: "Complex setup required",
        disadvantage: "Steeper learning curve",
        icon: XCircle,
        color: "text-red-600"
      }
    }
  ];

  const performanceMetrics = [
    {
      metric: "Query Response Time",
      vrin: "2 seconds",
      zep: "15-20 minutes",
      improvement: "450x faster"
    },
    {
      metric: "Memory Accuracy",
      vrin: "98.7%",
      zep: "94.2%",
      improvement: "+4.5%"
    },
    {
      metric: "Multi-hop QA Score",
      vrin: "+5.4pts",
      zep: "Baseline",
      improvement: "Superior reasoning"
    },
    {
      metric: "Storage Efficiency",
      vrin: "90% reduction",
      zep: "Standard",
      improvement: "10x more efficient"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
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
              Vrin vs Zep: 
              <span className="gradient-text"> The Clear Choice</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While Zep focuses on basic memory storage, Vrin delivers intelligent orchestration 
              that adapts to your specific use case and scales with your business needs.
            </p>
          </motion.div>

          {/* Feature Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg mb-16"
          >
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Head-to-Head Feature Comparison
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Independent analysis based on real-world testing and benchmarks
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Vrin
                    </th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Zep
                    </th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Advantage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {comparisonFeatures.map((row, index) => {
                    const VrinIcon = row.vrin.icon;
                    const ZepIcon = row.zep.icon;
                    return (
                      <motion.tr
                        key={row.feature}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                        viewport={{ once: true }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-8 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {row.feature}
                        </td>
                        <td className="px-8 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <VrinIcon className={`h-4 w-4 ${row.vrin.color}`} />
                            <span className="inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                              {row.vrin.value}
                            </span>
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                            {row.vrin.advantage}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <ZepIcon className={`h-4 w-4 ${row.zep.color}`} />
                            <span className="inline-flex items-center px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                              {row.zep.value}
                            </span>
                          </div>
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {row.zep.disadvantage}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Vrin Wins
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  {metric.metric}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">
                      {metric.vrin}
                    </span>
                    <span className="text-sm text-gray-500">vs</span>
                    <span className="text-lg font-medium text-red-600">
                      {metric.zep}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 font-semibold">
                    {metric.improvement}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div> */}

          {/* Why Choose Vrin */}
          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Leading Developers Choose Vrin
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our hybrid approach combines the best of dense and sparse retrieval with 
                intelligent orchestration for unmatched performance.
              </p>
            </div> */}

            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> */}
              {/* Technical Superiority */}
              {/* <div className="text-center">
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Superiority</h4>
                  <p className="text-sm text-gray-600">
                    450x faster retrieval with hybrid RAG architecture
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 mx-auto rotate-90 lg:rotate-0" />
              </div> */}

              {/* Developer Experience */}
              {/* <div className="text-center">
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
                  <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Developer Experience</h4>
                  <p className="text-sm text-gray-600">
                    3 lines of code to production with comprehensive SDK
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 mx-auto rotate-90 lg:rotate-0" />
              </div> */}

              {/* Enterprise Ready */}
              {/* <div className="text-center">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">Enterprise Ready</h4>
                  <p className="text-sm text-gray-600">
                    User isolation, data privacy, and 99.9% uptime SLA
                  </p>
                </div>
              </div>
            </div>
          </motion.div> */}

          {/* CTA Section */}
          {/* <motion.div
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
                Join developers who have already switched to Vrin and 
                are experiencing unprecedented performance improvements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Benchmarks
                </button>
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
} 