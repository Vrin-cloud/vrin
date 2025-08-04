'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Zap, 
  Database, 
  Brain, 
  ArrowRight,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

export function UpdatedIntegrationSection() {
  const integrationSteps = [
    {
      step: "1",
      title: "Install SDK",
      description: "Simple pip install",
      code: "pip install vrin",
      icon: Code,
      color: "text-blue-600"
    },
    {
      step: "2",
      title: "Initialize Client",
      description: "3 lines of code",
      code: `from vrin import VRIN
vrin = VRIN(api_key="your_api_key")
# Ready to use!`,
      icon: Zap,
      color: "text-green-600"
    },
    {
      step: "3",
      title: "Insert Knowledge",
      description: "Store facts automatically",
      code: `vrin.insert("Python is a programming language created by Guido van Rossum")`,
      icon: Database,
      color: "text-purple-600"
    },
    {
      step: "4",
      title: "Query Memory",
      description: "Natural language retrieval",
      code: `results = vrin.query("What is Python?")
print(results)`,
      icon: Brain,
      color: "text-orange-600"
    }
  ];

  const apiEndpoints = [
    {
      endpoint: "POST /api/knowledge/insert",
      description: "Insert knowledge with automatic fact extraction",
      features: ["Temporal context detection", "Conflict resolution", "Entity extraction"]
    },
    {
      endpoint: "POST /api/knowledge/query-basic",
      description: "Fast fact retrieval without LLM processing",
      features: ["Sub-second response", "Direct text search", "No timeouts"]
    },
    {
      endpoint: "GET /api/knowledge-graph",
      description: "Retrieve complete knowledge graph",
      features: ["Real-time updates", "User isolation", "Graph visualization"]
    }
  ];

  const sdkFeatures = [
    {
      feature: "Simple Integration",
      description: "3 lines of code to production",
      icon: Target,
      color: "text-green-600"
    },
    {
      feature: "Automatic Fact Extraction",
      description: "AI identifies and stores key information",
      icon: Brain,
      color: "text-blue-600"
    },
    {
      feature: "Natural Language Queries",
      description: "Query knowledge using plain English",
      icon: Code,
      color: "text-purple-600"
    },
    {
      feature: "Real-time Updates",
      description: "Sub-second knowledge graph updates",
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Integration in 
              <span className="gradient-text"> Minutes, Not Months</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Drop Vrin into your existing stack with simple APIs. No complex setup or migration required.
            </p>
          </motion.div>

          {/* Integration Steps */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              Get Started in 4 Simple Steps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrationSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${step.color} bg-opacity-10`}>
                        <Icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {step.step}
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {step.description}
                    </p>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
                      {step.code}
                    </pre>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* API Endpoints */}
          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              Production-Ready API Endpoints
            </h3>
            <div className="space-y-6">
              {apiEndpoints.map((endpoint, index) => (
                <motion.div
                  key={endpoint.endpoint}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {endpoint.endpoint}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {endpoint.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Working</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {endpoint.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div> */}

          {/* SDK Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              SDK Features That Make Development Easy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sdkFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${feature.color} bg-opacity-10`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {feature.feature}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Complete Example */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg mb-16"
          >
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Complete Integration Example
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                From zero to production-ready memory orchestration in under 10 lines of code
              </p>
            </div>
            
            <div className="p-8">
              <div className="bg-gray-900 rounded-lg p-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-2 text-gray-400 text-sm">vrin-integration.py</span>
                </div>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`# 1. Install and import
pip install vrin
from vrin import VRIN

# 2. Initialize client
vrin = VRIN(api_key="your_api_key_here")

# 3. Insert knowledge
vrin.insert("Python is a programming language created by Guido van Rossum in 1991")
vrin.insert("Python is known for its simplicity and readability")
vrin.insert("Guido van Rossum is the creator of Python")

# 4. Query knowledge
results = vrin.query("What is Python?")
print(results)

# 5. Get knowledge graph
graph = vrin.get_knowledge_graph()
print(f"Knowledge graph: {len(graph['data']['nodes'])} entities")

# That's it! Your AI now has persistent memory.`}
                </pre>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Add Memory to Your AI?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of developers who have already integrated Vrin into their applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                  <Code className="mr-2 h-5 w-5" />
                  View Documentation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="inline-flex items-center px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Trial
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 