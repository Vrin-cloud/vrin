'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Code,
  Terminal,
  Globe,
  Key,
  Layers,
  Zap,
  ChevronRight,
  Copy,
  CheckCircle2,
  ExternalLink,
  Download,
  Play,
  FileText,
  Settings,
  Database,
  Search,
  TrendingUp,
  Lightbulb,
  Shield,
  ArrowLeft,
  Home
} from 'lucide-react';

interface CodeExample {
  language: string;
  code: string;
  title: string;
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface ModernDocumentationSectionProps {
  standalone?: boolean;
}

export function ModernDocumentationSection({ standalone = false }: ModernDocumentationSectionProps = {}) {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('your_api_key_here');

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const CodeBlock = ({ example, id }: { example: CodeExample; id: string }) => (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-sm font-medium">{example.title}</span>
        </div>
        <motion.button
          onClick={() => copyToClipboard(example.code, id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          {copiedCode === id ? (
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-xs text-gray-400">
            {copiedCode === id ? 'Copied!' : 'Copy'}
          </span>
        </motion.button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-gray-100 whitespace-pre">
          {example.code}
        </code>
      </pre>
    </div>
  );

  const sections: DocSection[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">VRIN API Documentation</h2>
            <p className="text-xl text-gray-600 mb-6">
              Build intelligent applications with the VRIN Hybrid RAG engine v0.3.2 - featuring user-defined AI specialization and expert-level analysis.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Hybrid RAG</h3>
                <p className="text-gray-600 text-sm">
                  Combines the best of vector and graph-based retrieval for superior accuracy and context understanding.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Knowledge Graphs</h3>
                <p className="text-gray-600 text-sm">
                  Build dynamic, queryable knowledge structures with automatic entity resolution and relationship extraction.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Enterprise Ready</h3>
                <p className="text-gray-600 text-sm">
                  Production-grade APIs with authentication, rate limiting, monitoring, and comprehensive analytics.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">AI Specialization</h3>
                <p className="text-gray-600 text-sm">
                  Define custom AI experts with your own prompts for domain-specific analysis and expert-level reasoning.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>Automatic fact deduplication</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>Real-time knowledge insertion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>Advanced semantic search</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>Multi-modal understanding</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>User-defined AI specialization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>Multi-hop reasoning chains</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>Smart deduplication (40-60% savings)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>Expert-level performance validation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'quickstart',
      title: 'Quick Start',
      icon: <Play className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>
            <p className="text-gray-600 mb-8">
              Get started with VRIN in minutes. Follow these steps to build your first knowledge-powered application.
            </p>
          </div>

          <div className="space-y-8">
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <h3 className="text-xl font-semibold text-gray-900">Get Your API Key</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Create an API key from your dashboard to authenticate your requests.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                onClick={() => window.location.href = '/dashboard?tab=api-keys'}
              >
                Generate API Key
              </motion.button>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <h3 className="text-xl font-semibold text-gray-900">Install the SDK</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Install the VRIN Python SDK to get started quickly.
              </p>
              <CodeBlock
                id="install"
                example={{
                  language: 'bash',
                  title: 'Install VRIN SDK',
                  code: `# Install latest version with AI specialization
pip install vrin==0.3.2

# Force reinstall to get latest features
pip install vrin==0.3.2 --force-reinstall

# Verify installation
python -c "from vrin import VRINClient; print('✅ VRIN SDK v0.3.2 ready')"`
                }}
              />
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <h3 className="text-xl font-semibold text-gray-900">Initialize Client</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Create a VRIN client instance with your API key.
              </p>
              <CodeBlock
                id="initialize"
                example={{
                  language: 'python',
                  title: 'Initialize VRIN Client',
                  code: `from vrin import VRINClient

# SIMPLE: Only API key needed (URLs are hardcoded in v0.3.2)
client = VRINClient(api_key="${apiKey}")

# Test connection with expert analysis
try:
    response = client.query("Hello, VRIN!")
    print(f"✅ Connected! Response time: {response['search_time']}")
    print(f"Expert analysis available: {response.get('expert_analysis') is not None}")
except Exception as e:
    print(f"Connection failed: {e}")`
                }}
              />
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <h3 className="text-xl font-semibold text-gray-900">Insert Knowledge</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Start building your knowledge graph by inserting facts.
              </p>
              <CodeBlock
                id="insert"
                example={{
                  language: 'python',
                  title: 'Insert Knowledge',
                  code: `# Insert knowledge with smart deduplication
result = client.insert(
    content="Apple Inc. was founded by Steve Jobs in 1976.",
    title="Apple Company History",
    tags=["tech", "apple", "history"]
)

print(f"✅ {result['facts_extracted']} facts extracted")
print(f"📦 Chunk stored: {result['chunk_stored']}")
print(f"💾 {result['storage_details']}")

# Insert multiple documents
documents = [
    {
        "content": "Microsoft was founded by Bill Gates and Paul Allen in 1975.",
        "title": "Microsoft History",
        "tags": ["tech", "microsoft"]
    },
    {
        "content": "Google's parent company is Alphabet Inc., founded in 2015.",
        "title": "Google Corporate Structure",
        "tags": ["tech", "google", "alphabet"]
    }
]

# Process multiple documents
for doc in documents:
    result = client.insert(doc["content"], doc["title"], doc["tags"])
    print(f"Processed: {result['facts_extracted']} facts from {doc['title']}")`
                }}
              />
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
                <h3 className="text-xl font-semibold text-gray-900">Query Knowledge</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Query your knowledge graph using natural language.
              </p>
              <CodeBlock
                id="query"
                example={{
                  language: 'python',
                  title: 'Query Knowledge',
                  code: `# Standard query with AI summary
response = client.query("Who founded Apple?")

print(f"📝 Answer: {response['summary']}")
print(f"⚡ Search time: {response['search_time']}")
print(f"📊 Total results: {response['combined_results']}")
print(f"🔍 Entities found: {response['entities_found']}")

# Query with raw results for detailed analysis
detailed_response = client.query(
    query="technology companies founded in the 1970s",
    include_raw_results=True
)

print(f"📈 Graph facts: {detailed_response['total_facts']}")
print(f"🔗 Vector chunks: {detailed_response['total_chunks']}")

# Access raw graph facts if available
if 'graph_facts' in detailed_response:
    for fact in detailed_response['graph_facts'][:3]:
        print(f"- {fact['subject']} {fact['predicate']} {fact['object']}")
        print(f"  Confidence: {fact['confidence']:.2f}")`
                }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Authentication',
      icon: <Key className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-600 mb-6">
              VRIN uses API keys for authentication. All API requests must include a valid API key in the Authorization header.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">API Key Management</h3>
            <p className="text-blue-700 mb-4">
              API keys are project-specific and can be created, managed, and revoked from your dashboard.
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                onClick={() => window.location.href = '/dashboard?tab=api-keys'}
              >
                Manage API Keys
              </motion.button>
              <ExternalLink className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authentication Methods</h3>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Bearer Token (Recommended)</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Include your API key in the Authorization header as a Bearer token.
                  </p>
                  <CodeBlock
                    id="bearer-auth"
                    example={{
                      language: 'bash',
                      title: 'cURL with Bearer Token',
                      code: `curl -X POST "https://api.vrin.ai/insert" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "knowledge": "OpenAI developed GPT-4 in 2023.",
    "project_name": "AI Research"
  }'`
                    }}
                  />
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Python SDK</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    The Python SDK handles authentication automatically when you initialize the client.
                  </p>
                  <CodeBlock
                    id="python-auth"
                    example={{
                      language: 'python',
                      title: 'Python SDK Authentication',
                      code: `from vrin import VRINClient

# Option 1: Login existing user
client = VRINClient(api_key="dummy")  # Temporary for auth
login_result = client.login(
    email="user@company.com",
    password="secure_password"
)

if login_result['success']:
    # Use the returned API key for all operations
    client = VRINClient(api_key=login_result['api_key'])
    
    # Now all requests are authenticated
    result = client.insert(
        content="Your knowledge content here",
        title="Document Title",
        tags=["tag1", "tag2"]
    )

# Option 2: Register new user
register_result = client.register(
    email="newuser@company.com",
    password="secure_password",
    name="John Doe"
)

if register_result['success']:
    api_key = register_result['api_key']
    client = VRINClient(api_key=api_key)`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: <Code className="w-5 h-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API Reference</h2>
            <p className="text-gray-600 mb-6">
              Complete reference for the VRIN Hybrid RAG API endpoints with examples and response formats.
            </p>
          </div>

          <div className="space-y-8">
            {/* Insert Knowledge */}
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-mono">POST</span>
                <code className="text-lg font-mono">/insert</code>
              </div>
              <p className="text-gray-600 mb-6">
                Insert knowledge with smart deduplication. Automatically extracts facts with 0.8+ confidence and prevents duplicate storage.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Request Body</h4>
                  <CodeBlock
                    id="insert-request"
                    example={{
                      language: 'json',
                      title: 'Request Example',
                      code: `{
  "content": "Tesla Model S has a range of 405 miles and can accelerate from 0-60 mph in 3.1 seconds.",
  "title": "Tesla Model S Specifications",
  "tags": ["tesla", "electric", "specifications"]
}`
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Response</h4>
                  <CodeBlock
                    id="insert-response"
                    example={{
                      language: 'json',
                      title: 'Success Response',
                      code: `{
  "success": true,
  "chunk_id": "chunk_abc123",
  "facts_extracted": 3,
  "facts": [
    {
      "subject": "Tesla Model S",
      "predicate": "has_range",
      "object": "405 miles",
      "confidence": 0.95
    }
  ],
  "chunk_stored": true,
  "chunk_storage_reason": "new_content",
  "storage_details": "Document contains unique facts not seen before",
  "processing_time": "1.2s",
  "storage_result": {
    "stored_facts": 3,
    "updated_facts": 0,
    "skipped_duplicates": 0,
    "storage_efficiency": "100% new content"
  }
}`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Query Knowledge */}
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-mono">POST</span>
                <code className="text-lg font-mono">/query</code>
              </div>
              <p className="text-gray-600 mb-6">
                Hybrid query with sub-3s performance. Combines graph reasoning and vector similarity for comprehensive results.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Request Body</h4>
                  <CodeBlock
                    id="query-request"
                    example={{
                      language: 'json',
                      title: 'Query Request',
                      code: `{
  "query": "What is the range of Tesla vehicles?",
  "include_raw_results": false
}`
                    }}
                  />
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>Parameters:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><code>query</code> - Natural language question</li>
                      <li><code>include_raw_results</code> - Include detailed graph/vector data (optional)</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Response</h4>
                  <CodeBlock
                    id="query-response"
                    example={{
                      language: 'json',
                      title: 'Query Response',
                      code: `{
  "success": true,
  "query": "What is the range of Tesla vehicles?",
  "summary": "Tesla vehicles have different ranges: Model S has 405 miles, Model 3 has 358 miles range on a single charge.",
  "search_time": "1.2s",
  "entities_found": ["Tesla Model S", "Tesla Model 3"],
  "total_facts": 5,
  "total_chunks": 3,
  "combined_results": 8
}`
                    }}
                  />
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>Key Fields:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li><code>summary</code> - AI-generated answer</li>
                      <li><code>search_time</code> - Query performance</li>
                      <li><code>combined_results</code> - Total hybrid results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'python-sdk',
      title: 'Python SDK',
      icon: <Terminal className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Python SDK</h2>
            <p className="text-gray-600 mb-6">
              The official Python SDK provides a convenient interface for integrating VRIN into your Python applications.
            </p>
          </div>

          <div className="space-y-8">
            <div className="border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Installation & Setup</h3>
              <CodeBlock
                id="sdk-install"
                example={{
                  language: 'bash',
                  title: 'Install VRIN SDK',
                  code: `# Install latest version with AI specialization
pip install vrin==0.3.2

# Force reinstall to get latest features  
pip install vrin==0.3.2 --force-reinstall

# Development installation
git clone https://github.com/vrin-ai/vrin-python-sdk
cd vrin-python-sdk
pip install -e ".[dev]"

# Verify installation
python -c "from vrin import VRINClient; print('✅ VRIN SDK v0.3.2 ready')"`
                }}
              />
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Usage</h3>
              <CodeBlock
                id="sdk-basic"
                example={{
                  language: 'python',
                  title: 'Basic SDK Usage',
                  code: `from vrin import VRINClient
import os

# Initialize client
client = VRINClient(api_key=os.getenv('VRIN_API_KEY'))

# Insert knowledge with smart deduplication
result = client.insert(
    content="The iPhone 15 Pro has a titanium body and USB-C port.",
    title="iPhone 15 Pro Specifications",
    tags=["apple", "iphone", "specifications"]
)

print(f"✅ {result['facts_extracted']} facts extracted")
print(f"📦 Chunk stored: {result['chunk_stored']}")
print(f"💾 {result['storage_details']}")

# Query knowledge with hybrid search
response = client.query("What materials are used in iPhone 15?")

print(f"📝 Answer: {response['summary']}")
print(f"⚡ Search completed in {response['search_time']}")
print(f"📊 Found {response['combined_results']} results")
print(f"🔍 Entities: {response['entities_found']}")`
                }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'specialization',
      title: 'AI Specialization',
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">User-Defined AI Specialization</h2>
            <p className="text-gray-600 mb-6">
              NEW in v0.3.2: Define your own AI expert with custom prompt engineering for domain-specific analysis and multi-hop reasoning.
            </p>
          </div>

          <div className="space-y-8">
            {/* Configure Specialization */}
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <h3 className="text-xl font-semibold text-gray-900">Configure Custom Expert</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Define your own AI expert with specialized knowledge and reasoning patterns - no pre-built templates required.
              </p>
              <CodeBlock
                id="configure-expert"
                example={{
                  language: 'python',
                  title: 'Configure AI Specialization',
                  code: `# Define YOUR custom expert (unlimited customization!)
custom_expert_prompt = """
You are a senior M&A legal partner with 25+ years experience.
Focus on:
1. Risk quantification with specific dollar amounts
2. Cross-document synthesis to identify hidden risks  
3. Strategic recommendations for deal structure
4. Smoking gun insights that change everything
"""

# Configure VRIN with YOUR custom expert
result = client.specialize(
    custom_prompt=custom_expert_prompt,
    reasoning_focus=["cross_document_synthesis", "causal_chains"],
    analysis_depth="expert",  # "surface" | "detailed" | "expert"
    confidence_threshold=0.7,
    max_reasoning_chains=10
)

if result['success']:
    print("🧠 Custom Expert configured successfully!")
    print(f"Specialization ID: {result.get('specialization_id')}")
else:
    print(f"❌ Error: {result['error']}")`
                }}
              />
            </div>

            {/* Domain Examples */}
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <h3 className="text-xl font-semibold text-gray-900">Domain-Specific Examples</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Financial Analyst</h4>
                  <p className="text-blue-700 text-sm">CFA-level analysis with quantified risk assessment</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Technical Architect</h4>
                  <p className="text-green-700 text-sm">System design patterns and performance optimization</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Medical Expert</h4>
                  <p className="text-purple-700 text-sm">Clinical decision support with evidence synthesis</p>
                </div>
              </div>
              
              <CodeBlock
                id="financial-expert"
                example={{
                  language: 'python',
                  title: 'Financial Analysis Expert',
                  code: `financial_expert = """
You are a senior financial analyst with CFA certification and 20+ years experience.
Expertise areas:
1. Financial statement analysis with ratio calculations
2. Market trend identification and quantified predictions
3. Risk assessment with specific probabilities and dollar amounts
4. Investment recommendations with target prices and timelines
5. Regulatory compliance analysis (SOX, SEC filings)
"""

client.specialize(
    custom_prompt=financial_expert,
    reasoning_focus=["quantitative_analysis", "risk_assessment", "market_trends"],
    analysis_depth="expert",
    confidence_threshold=0.8
)`
                }}
              />
            </div>

            {/* Expert Queries */}
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <h3 className="text-xl font-semibold text-gray-900">Expert-Level Queries</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Query with your specialized expert for professional-grade analysis, multi-hop reasoning, and actionable insights.
              </p>
              <CodeBlock
                id="expert-query"
                example={{
                  language: 'python',
                  title: 'Expert Analysis Query',
                  code: `# Query with your custom expert reasoning
response = client.query("What are the strategic risks in this M&A transaction?")

# Expert-enhanced response (sub-20s performance):
{
    'success': True,
    'query': 'What are the strategic risks in this M&A transaction?',
    'summary': 'Based on my 25+ years of M&A legal experience, I identify three critical strategic risks: 1) Regulatory approval risk with estimated $15M cost if delayed by 6+ months...',
    'search_time': '14.2s',  # Expert analysis with multi-hop reasoning
    'entities_found': ['M&A transaction', 'strategic risks', 'regulatory approval'],
    'total_facts': 12,          # Multi-hop graph traversal results
    'total_chunks': 8,          # Vector similarity results  
    'combined_results': 20,     # Total hybrid results with deduplication
    
    # NEW: Expert analysis metadata (v0.3.2)
    'expert_analysis': {
        'specialization_applied': True,
        'reasoning_chains_used': 5,
        'confidence_level': 'high',
        'analysis_depth': 'expert'
    },
    
    # NEW: Multi-hop insights from specialized reasoning
    'multi_hop_insights': [
        {
            'insight': 'Cross-document analysis reveals regulatory exposure patterns in similar deals',
            'confidence': 0.94,
            'supporting_facts': ['SEC filing X shows...', 'Prior deal Y had...', 'Regulatory precedent Z indicates...']
        }
    ],
    
    # NEW: Reasoning chains for transparency
    'reasoning_chains': [
        {
            'chain_id': 1,
            'description': 'Regulatory risk cascade analysis',
            'final_conclusion': '$15M exposure with 60% probability',
            'overall_confidence': 0.88
        }
    ]
}`
                }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'examples',
      title: 'Examples',
      icon: <Lightbulb className="w-5 h-5" />,
      content: (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Examples & Use Cases</h2>
            <p className="text-gray-600 mb-6">
              Real-world examples showing how to build powerful applications with VRIN&apos;s Hybrid RAG engine.
            </p>
          </div>

          <div className="space-y-8">
            {/* Chatbot Example */}
            <div className="border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Intelligent Chatbot</h3>
              <p className="text-gray-600 mb-6">
                Build a chatbot that learns from conversations and provides accurate, contextual responses.
              </p>
              <CodeBlock
                id="chatbot-example"
                example={{
                  language: 'python',
                  title: 'Intelligent Chatbot with VRIN',
                  code: `from vrin import VRINClient
import openai

class VRINChatbot:
    def __init__(self, api_key, project_name="Chatbot"):
        self.vrin = VRINClient(api_key=api_key)
        self.project = project_name
        
    def learn(self, conversation_context):
        """Learn from conversation context"""
        response = self.vrin.insert(
            content=conversation_context,
            title="Conversation Context"
        )
        return response
    
    def answer(self, user_question):
        """Generate contextual answer using VRIN knowledge"""
        # Query relevant knowledge with raw results for context
        context = self.vrin.query(
            query=user_question,
            include_raw_results=True
        )
        
        # Build context from graph facts if available
        if context.get('graph_facts'):
            knowledge_context = "\\n".join([
                f"{fact['subject']} {fact['predicate']} {fact['object']}"
                for fact in context['graph_facts']
            ])
            return knowledge_context
        else:
            # Fallback to summary if no raw results
            return context.get('summary', 'No relevant information found.')

# Usage
chatbot = VRINChatbot("your-vrin-api-key")

# Learn from data
chatbot.learn("Our company offers 24/7 customer support via phone and email.")
chatbot.learn("We have a 30-day return policy for all products.")

# Answer user questions
response = chatbot.answer("What is your return policy?")
print(response)  # Will return relevant facts or AI summary`
                }}
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  const navigation = [
    { id: 'overview', title: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quickstart', title: 'Quick Start', icon: <Play className="w-4 h-4" /> },
    { id: 'authentication', title: 'Authentication', icon: <Key className="w-4 h-4" /> },
    { id: 'specialization', title: 'AI Specialization', icon: <Settings className="w-4 h-4" /> },
    { id: 'api-reference', title: 'API Reference', icon: <Code className="w-4 h-4" /> },
    { id: 'python-sdk', title: 'Python SDK', icon: <Terminal className="w-4 h-4" /> },
    { id: 'examples', title: 'Examples', icon: <Lightbulb className="w-4 h-4" /> },
  ];

  const currentSection = sections.find(s => s.id === activeSection);

  if (!standalone) {
    // Original compact layout for non-standalone mode
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">API Documentation</h2>
          <p className="text-gray-600">Learn how to integrate VRIN into your applications</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 border border-gray-200/50 shadow-sm">
          <p className="text-center text-gray-500">Documentation loading...</p>
        </div>
      </div>
    );
  }

  // Standalone layout with fixed sidebar
  return (
    <div className="absolute inset-0 bg-gray-50 flex">
      {/* Fixed Navigation Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 bottom-0 z-10">
        <div className="p-6 border-b border-gray-200">
          <motion.button
            onClick={() => window.location.href = '/dashboard'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 mb-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors w-full justify-center font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">VRIN Docs</h1>
            <p className="text-sm text-gray-500 mt-1">v0.3.2 AI Specialization</p>
            
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
              <Home className="w-3 h-3" />
              <span>Dashboard</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-600 font-medium">Documentation</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
                {activeSection === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Globe className="w-3 h-3" />
            <span>API Status: Online</span>
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentSection?.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}