'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Zap,
  Shield,
  Globe,
  Package,
  Terminal,
  Download
} from 'lucide-react';
import { useAuth } from '../../../hooks/use-auth';
import toast from 'react-hot-toast';

interface CodeExample {
  title: string;
  description: string;
  language: string;
  code: string;
}

export function ApiDocsSection() {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, title: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(title);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const codeExamples: CodeExample[] = [
    {
      title: 'Installation',
      description: 'Install the VRIN Python SDK from PyPI',
      language: 'bash',
      code: `pip install vrin`
    },
    {
      title: 'Quick Start',
      description: 'Basic usage with the VRIN SDK',
      language: 'python',
      code: `from vrin import VRIN

# Initialize with your API key
vrin = VRIN(api_key="${user?.api_key || 'your_api_key'}")

# Insert knowledge
result = vrin.insert("Albert Einstein was a German-born theoretical physicist who developed the theory of relativity.")
print(result)

# Query knowledge
results = vrin.query("Who was Albert Einstein?")
print(results)`
    },
    {
      title: 'Advanced Usage',
      description: 'Complete example with error handling and knowledge graph visualization',
      language: 'python',
      code: `from vrin import VRIN
import json

# Initialize client
vrin = VRIN(api_key="${user?.api_key || 'your_api_key'}")

try:
    # Insert multiple facts
    facts = [
        "Python is a programming language created by Guido van Rossum in 1991.",
        "Python is known for its simplicity and readability.",
        "Guido van Rossum is a Dutch programmer."
    ]
    
    for fact in facts:
        result = vrin.insert(fact)
        print(f"Inserted: {result.get('message', 'Success')}")
    
    # Query with context
    query_result = vrin.query("What is Python and who created it?")
    print("\\nQuery Results:")
    print(json.dumps(query_result, indent=2))
    
    # Advanced query with LLM processing
    advanced_result = vrin.query("Explain Python's history and creator")
    print("\\nAdvanced Query Results:")
    print(json.dumps(advanced_result, indent=2))
    
    # Get knowledge graph
    graph = vrin.get_knowledge_graph()
    print(f"\\nGraph has {len(graph.get('nodes', []))} nodes and {len(graph.get('edges', []))} edges")
    
except Exception as e:
    print(f"Error: {e}")`
    },
    {
      title: 'JavaScript/TypeScript',
      description: 'Using VRIN with JavaScript or TypeScript',
      language: 'javascript',
      code: `// Install: npm install vrin-js

import { VRIN } from 'vrin-js';

const vrin = new VRIN({
  apiKey: "${user?.api_key || 'your_api_key'}"
});

// Insert knowledge
const result = await vrin.insert(
  "React is a JavaScript library for building user interfaces."
);

// Query knowledge
const results = await vrin.query("What is React?");

// Advanced query with LLM processing
const advancedResults = await vrin.queryAdvanced("Explain React's features and benefits");

console.log(results);`
    },
    {
      title: 'API Reference',
      description: 'Complete method reference for the VRIN SDK',
      language: 'python',
      code: `from vrin import VRIN

vrin = VRIN(api_key="your_api_key")

# Core Methods
vrin.insert(text)                    # Insert knowledge from text
vrin.query(query)                    # Query knowledge (basic, reliable)
vrin.query(query)           # Advanced query with LLM processing
vrin.get_knowledge_graph()           # Get full knowledge graph data

# Response Format
{
  "success": true,
  "message": "Processed 3 knowledge triples",
  "extracted_count": 3,
  "inserted_count": 3,
  "user_id": "your_user_id",
  "timestamp": "2025-08-02T06:38:38.441495"
}`
    }
  ];

  const features = [
    {
      icon: Package,
      title: 'Easy Installation',
      description: 'Simple pip install from PyPI'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Instant knowledge extraction and conflict resolution'
    },
    {
      icon: Shield,
      title: 'Secure & Isolated',
      description: 'Bearer token authentication and user isolation'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Python, JavaScript, and REST API support'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">VRIN SDK Documentation</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Build intelligent applications with persistent memory using our simple and powerful SDK
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Install</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400 font-mono">pip install vrin</code>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Use</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-green-400 font-mono text-sm">
{`from vrin import VRIN

vrin = VRIN(api_key="${user?.api_key || 'your_api_key'}")
result = vrin.insert("Your knowledge here")`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center space-y-3"
            >
              <div className="inline-flex p-3 bg-blue-100 rounded-xl">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Code Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Code Examples</h2>
        {codeExamples.map((example, index) => (
          <motion.div
            key={example.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{example.title}</h3>
                <p className="text-gray-600 mt-1">{example.description}</p>
              </div>
              <button
                onClick={() => copyToClipboard(example.code, example.title)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copiedCode === example.title ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                <span className="text-sm text-gray-300 font-medium">{example.language}</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <pre className="p-4 text-green-400 font-mono text-sm overflow-x-auto">
                <code>{example.code}</code>
              </pre>
            </div>
          </motion.div>
        ))}
      </div>

      {/* API Reference */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">API Reference</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Authentication</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">All requests require an API key:</p>
              <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                Authorization: Bearer your_api_key
              </code>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Rate Limits</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Insert Operations</span>
                <span className="font-mono">10/min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Query Operations</span>
                <span className="font-mono">30/min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Graph Retrieval</span>
                <span className="font-mono">60/min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Response Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Response Examples</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Success Response</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`{
  "success": true,
  "message": "Processed 3 knowledge triples",
  "extracted_count": 3,
  "inserted_count": 3,
  "user_id": "user_id",
  "timestamp": "2025-08-02T06:38:38.441495"
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Error Response</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-red-400 font-mono text-sm overflow-x-auto">
{`{
  "success": false,
  "error": "Invalid API key"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex flex-wrap items-center justify-center space-x-6">
          <a
            href="https://pypi.org/project/vrin/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Package className="h-5 w-5" />
            <span>PyPI Package</span>
          </a>
          <a
            href="https://github.com/vrin-ai/vrin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            <span>GitHub Repository</span>
          </a>
          <a
            href="https://docs.vrin.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            <span>Full Documentation</span>
          </a>
        </div>
      </div>
    </div>
  );
} 