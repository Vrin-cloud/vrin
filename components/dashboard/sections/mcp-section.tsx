'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plug,
  Copy,
  CheckCircle2,
  Eye,
  EyeOff,
  MessageSquare,
  Search,
  Database,
  Terminal,
  Code,
  ExternalLink,
} from 'lucide-react';

interface MCPSectionProps {
  apiKey: string | null;
}

const MCP_SERVER_URL = 'https://ofcrp2bnpjrhz3gngzusvqodsm0khzzq.lambda-url.us-east-1.on.aws/mcp';

interface CodeExample {
  language: string;
  code: string;
  title: string;
}

function CodeBlock({ example, id, copiedCode, onCopy }: {
  example: CodeExample;
  id: string;
  copiedCode: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-gray-600 text-sm font-medium">{example.title}</span>
        </div>
        <motion.button
          onClick={() => onCopy(example.code, id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          {copiedCode === id ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-xs text-gray-500">
            {copiedCode === id ? 'Copied!' : 'Copy'}
          </span>
        </motion.button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-gray-800 whitespace-pre">
          {example.code}
        </code>
      </pre>
    </div>
  );
}

export function MCPSection({ apiKey }: MCPSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 8)}${'*'.repeat(Math.max(0, apiKey.length - 12))}${apiKey.slice(-4)}`
    : '••••••••••••••••';

  const claudeDesktopConfig = JSON.stringify({
    mcpServers: {
      vrin: {
        url: MCP_SERVER_URL
      }
    }
  }, null, 2);

  const claudeCodeCommand = `claude mcp add vrin --transport streamable-http ${MCP_SERVER_URL}`;

  const pythonExample = `from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

async def main():
    async with streamablehttp_client(
        "${MCP_SERVER_URL}"
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # List available tools
            tools = await session.list_tools()
            print(f"Available tools: {[t.name for t in tools.tools]}")

            # Query your knowledge base
            result = await session.call_tool(
                "vrin_query",
                arguments={
                    "query": "What do you know about our Q4 results?",
                    "mode": "expert"
                }
            )
            print(result.content[0].text)`;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Plug className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Model Context Protocol (MCP)</h2>
            <p className="text-gray-600">Connect VRIN as a reasoning layer to any AI agent</p>
          </div>
        </div>
      </div>

      {/* MCP Server URL */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">MCP Server URL</h3>
        <p className="text-sm text-gray-600 mb-4">
          Use this URL to connect any MCP-compatible AI agent to your VRIN knowledge base.
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-gray-100 px-4 py-3 rounded-lg text-sm font-mono text-gray-800 break-all">
            {MCP_SERVER_URL}
          </code>
          <motion.button
            onClick={() => copyToClipboard(MCP_SERVER_URL, 'server-url')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 p-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copiedCode === 'server-url' ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication</h3>
        <p className="text-sm text-gray-600 mb-4">
          VRIN uses OAuth 2.1 for MCP authentication. Your AI agent handles the OAuth flow
          automatically when connecting — you&apos;ll be prompted to sign in via your browser.
        </p>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Your API Key</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-gray-100 px-4 py-3 rounded-lg text-sm font-mono text-gray-800">
              {showApiKey ? (apiKey || 'No API key found') : maskedKey}
            </code>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="flex-shrink-0 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title={showApiKey ? 'Hide API key' : 'Reveal API key'}
            >
              {showApiKey ? (
                <EyeOff className="w-4 h-4 text-gray-600" />
              ) : (
                <Eye className="w-4 h-4 text-gray-600" />
              )}
            </button>
            {apiKey && (
              <motion.button
                onClick={() => copyToClipboard(apiKey, 'api-key')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {copiedCode === 'api-key' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Connection Guides */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Guides</h3>
        <div className="space-y-6">

          {/* Claude Desktop / Claude Code */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Terminal className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Claude Desktop & Claude Code</h4>
                <p className="text-sm text-gray-500">Anthropic&apos;s native AI tools</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Claude Desktop</p>
                <p className="text-sm text-gray-600 mb-3">
                  Add this to your <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">claude_desktop_config.json</code> file:
                </p>
                <CodeBlock
                  example={{ language: 'json', code: claudeDesktopConfig, title: 'claude_desktop_config.json' }}
                  id="claude-desktop"
                  copiedCode={copiedCode}
                  onCopy={copyToClipboard}
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Claude Code</p>
                <p className="text-sm text-gray-600 mb-3">
                  Run this command in your terminal:
                </p>
                <CodeBlock
                  example={{ language: 'bash', code: claudeCodeCommand, title: 'Terminal' }}
                  id="claude-code"
                  copiedCode={copiedCode}
                  onCopy={copyToClipboard}
                />
              </div>

              <p className="text-sm text-gray-500">
                When you first use a VRIN tool, Claude will open your browser to complete OAuth sign-in.
              </p>
            </div>
          </div>

          {/* ChatGPT */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">ChatGPT</h4>
                <p className="text-sm text-gray-500">OpenAI&apos;s ChatGPT with MCP support</p>
              </div>
            </div>

            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">1</span>
                <span className="text-sm text-gray-700">
                  Open ChatGPT and go to <strong>Settings</strong> (gear icon in the sidebar)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">2</span>
                <span className="text-sm text-gray-700">
                  Navigate to <strong>Connected Apps</strong> (or <strong>MCP Servers</strong>)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">3</span>
                <span className="text-sm text-gray-700">
                  Click <strong>Add MCP Server</strong> and paste the MCP Server URL above
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">4</span>
                <span className="text-sm text-gray-700">
                  Complete the OAuth sign-in when prompted in your browser
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">5</span>
                <span className="text-sm text-gray-700">
                  Start a new chat — VRIN tools will be available automatically
                </span>
              </li>
            </ol>
          </div>

          {/* Custom Agents / SDKs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Custom Agents & SDKs</h4>
                <p className="text-sm text-gray-500">Build your own MCP-powered applications</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Use the official MCP Python SDK to connect programmatically:
            </p>

            <CodeBlock
              example={{ language: 'python', code: pythonExample, title: 'main.py' }}
              id="python-sdk"
              copiedCode={copiedCode}
              onCopy={copyToClipboard}
            />

            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://modelcontextprotocol.io/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                MCP Documentation
              </a>
              <a
                href="https://pypi.org/project/mcp/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Python SDK on PyPI
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Available Tools */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Tools</h3>
        <p className="text-sm text-gray-600 mb-4">
          These tools become available to your AI agent once connected via MCP.
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Search className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <code className="text-sm font-semibold text-gray-900 font-mono">vrin_query</code>
              </div>
              <p className="text-sm text-gray-600">
                Query your knowledge base with natural language. Supports multiple response modes:
                <code className="bg-gray-200 px-1 py-0.5 rounded text-xs mx-1">chat</code>
                <code className="bg-gray-200 px-1 py-0.5 rounded text-xs mx-1">expert</code>
                <code className="bg-gray-200 px-1 py-0.5 rounded text-xs mx-1">brainstorm</code>
                <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">raw_facts</code>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Search className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <code className="text-sm font-semibold text-gray-900 font-mono">vrin_search_entities</code>
              </div>
              <p className="text-sm text-gray-600">
                Search for entities in your knowledge graph by name or partial match. Useful for discovering
                what entities exist before querying for specific facts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <code className="text-sm font-semibold text-gray-900 font-mono">vrin_get_facts</code>
              </div>
              <p className="text-sm text-gray-600">
                Retrieve structured facts (subject-predicate-object triples) about a specific entity,
                with confidence scores and source documents. Supports temporal filtering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
