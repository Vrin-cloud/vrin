'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Plus,
  Brain,
  BarChart3,
  Settings,
  User,
  LogOut,
  Key,
  FileText,
  Zap,
  Database,
  Activity,
  TrendingUp,
  Globe,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
  Command,
  MessageSquare
} from 'lucide-react';
import { AuthService, VRINService } from '../../lib/services/vrin-service';
import type { VRINInsertResult, VRINQueryResult } from '../../lib/services/vrin-service';
import { ModernApiKeysSection } from '../../components/dashboard/sections/modern-api-keys';
import { ModernGraph } from '../../components/dashboard/knowledge-graph/modern-graph';
import { NodeDetailsDialog } from '../../components/dashboard/knowledge-graph/node-details-dialog';
import { ModernDocumentationSection } from '../../components/dashboard/sections/modern-documentation';
import { AISpecializationSection } from '../../components/dashboard/sections/ai-specialization';
import { ThinkingPanel } from '../../components/dashboard/thinking-panel';
import { SourcesPanel } from '../../components/dashboard/sources-panel';
import { DataSourcesSection } from '../../components/dashboard/sections/data-sources-section';
import { useAccountKnowledgeGraph } from '../../hooks/use-knowledge-graph';
import type { Node, Edge, Triple, GraphStatistics } from '../../types/knowledge-graph';

interface User {
  user_id: string;
  email: string;
  name?: string;
  created_at: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
  triples: Triple[];
  statistics: GraphStatistics;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [insertContent, setInsertContent] = useState('');
  const [insertTitle, setInsertTitle] = useState('');
  const [insertTags, setInsertTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<VRINQueryResult | null>(null);
  const [insertResult, setInsertResult] = useState<VRINInsertResult | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedGraphNode, setSelectedGraphNode] = useState<Node | null>(null);
  const [selectedGraphEdge, setSelectedGraphEdge] = useState<Edge | null>(null);
  const [showNodeDialog, setShowNodeDialog] = useState(false);

  const authService = new AuthService();
  const [vrinService, setVrinService] = useState<VRINService | null>(null);
  
  // For large datasets, offer performance optimization
  const [usePerformanceMode, setUsePerformanceMode] = useState(false);
  const [graphLimit, setGraphLimit] = useState<number | undefined>(undefined);
  
  // Use the proper knowledge graph hook for unified account data
  const { 
    data: knowledgeGraphResponse, 
    isLoading: isGraphLoading, 
    error: graphError,
    hasApiKey,
    refetch: refetchGraph
  } = useAccountKnowledgeGraph({ 
    limit: usePerformanceMode ? (graphLimit || 100) : undefined 
  });

  useEffect(() => {
    // Check for existing auth
    const storedApiKey = authService.getStoredApiKey();
    const storedUser = authService.getStoredUser();
    
    if (storedApiKey && storedUser) {
      setApiKey(storedApiKey);
      setUser(storedUser);
      setVrinService(new VRINService(storedApiKey));
      // Knowledge graph data is now handled by the useAccountKnowledgeGraph hook
    }

    // Check for URL query parameter to set active section
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['overview', 'knowledge', 'search', 'insert', 'data-sources', 'graph', 'ai-specialization', 'api-keys', 'api-docs'].includes(tab)) {
      setActiveSection(tab);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette]);

  // Extract graph data from the hook response
  const graphData = knowledgeGraphResponse?.data || null;
  
  // Extract error from response data or hook error
  const actualGraphError = knowledgeGraphResponse?.error || graphError?.message || null;
  
  console.log('📊 Dashboard - Knowledge graph state:', {
    hasResponse: !!knowledgeGraphResponse,
    hasData: !!graphData,
    nodesCount: graphData?.nodes?.length || 0,
    edgesCount: graphData?.edges?.length || 0,
    hookError: graphError?.message,
    responseError: knowledgeGraphResponse?.error,
    actualError: actualGraphError
  });

  const handleSearch = async () => {
    if (!searchQuery.trim() || !vrinService) return;
    
    setIsLoading(true);
    try {
      const result = await vrinService.queryKnowledge(searchQuery);
      setQueryResult(result);
      setActiveSection('search-results');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = async () => {
    if (!insertContent.trim() || !vrinService) return;
    
    setIsLoading(true);
    try {
      const result = await vrinService.insertKnowledge(
        insertContent,
        insertTitle || undefined,
        insertTags ? insertTags.split(',').map(t => t.trim()) : undefined
      );
      setInsertResult(result);
      setInsertContent('');
      setInsertTitle('');
      setInsertTags('');
      // Refetch the knowledge graph to show new data
      await refetchGraph();
      setActiveSection('insert-results');
    } catch (error) {
      console.error('Insert failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setApiKey(null);
    setVrinService(null);
    window.location.href = '/auth';
  };

  const handleNodeSelect = (node: Node) => {
    setSelectedGraphNode(node);
    setSelectedGraphEdge(null);
    setShowNodeDialog(true);
  };

  const handleEdgeSelect = (edge: Edge) => {
    setSelectedGraphEdge(edge);
    setSelectedGraphNode(null);
    setShowNodeDialog(true);
  };

  const handleCloseNodeDialog = () => {
    setShowNodeDialog(false);
    setSelectedGraphNode(null);
    setSelectedGraphEdge(null);
  };

  if (!user || !apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to VRIN</h1>
            <p className="text-gray-600 mt-2">Please log in to access your dashboard</p>
          </div>
          <div className="text-center">
            <a
              href="/auth"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Go to Login <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'blue' },
    { id: 'knowledge', label: 'Knowledge Hub', icon: Brain, color: 'purple' },
    { id: 'search', label: 'Smart Search', icon: Search, color: 'green' },
    { id: 'insert', label: 'Add Knowledge', icon: Plus, color: 'orange' },
    { id: 'data-sources', label: 'Data Sources', icon: Globe, color: 'cyan', badge: 'NEW' },
    { id: 'graph', label: 'Knowledge Graph', icon: Database, color: 'pink' },
    { id: 'ai-specialization', label: 'AI Specialization', icon: Sparkles, color: 'purple' },
    { id: 'api-keys', label: 'API Keys', icon: Key, color: 'indigo' },
    { id: 'api-docs', label: 'Documentation', icon: FileText, color: 'teal' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection user={user} graphData={graphData} />;
      case 'search':
        return (
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isLoading={isLoading}
          />
        );
      case 'search-results':
        return <SearchResultsSection result={queryResult} />;
      case 'insert':
        return (
          <InsertSection
            content={insertContent}
            setContent={setInsertContent}
            title={insertTitle}
            setTitle={setInsertTitle}
            tags={insertTags}
            setTags={setInsertTags}
            handleInsert={handleInsert}
            isLoading={isLoading}
          />
        );
      case 'insert-results':
        return <InsertResultsSection result={insertResult} />;
      case 'data-sources':
        return <DataSourcesSection apiKey={apiKey || undefined} />;
      case 'knowledge':
        return <KnowledgeHubSection graphData={graphData} />;
      case 'graph':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Unified Account Knowledge Graph
              </h3>
              <p className="text-sm text-purple-700">
                This visualization shows your entire knowledge graph for this account. 
                All knowledge inserted via any of your API keys contributes to this single unified graph.
              </p>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Graph</h2>
              <p className="text-gray-600">Interactive visualization of your knowledge connections</p>
              
              {/* Performance optimization notice for large graphs */}
              {graphData && graphData.nodes && graphData.nodes.length > 500 && !usePerformanceMode && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Large Graph Detected</h4>
                        <p className="text-sm text-yellow-700">
                          Your graph has {graphData.nodes.length} nodes and {graphData.edges?.length || 0} edges. 
                          Consider enabling performance mode for better rendering.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUsePerformanceMode(true);
                        setGraphLimit(100);
                      }}
                      className="ml-4 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                    >
                      Enable Performance Mode
                    </button>
                  </div>
                </div>
              )}
              
              {/* Performance mode controls */}
              {usePerformanceMode && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-800">Performance Mode Active</h4>
                      <p className="text-sm text-blue-700">Showing limited data for better performance</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-blue-700">Limit:</label>
                        <select 
                          value={graphLimit} 
                          onChange={(e) => setGraphLimit(Number(e.target.value))}
                          className="px-2 py-1 border border-blue-300 rounded text-sm"
                        >
                          <option value={50}>50 nodes</option>
                          <option value={100}>100 nodes</option>
                          <option value={200}>200 nodes</option>
                          <option value={500}>500 nodes</option>
                        </select>
                      </div>
                      <button
                        onClick={() => setUsePerformanceMode(false)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Show Full Graph
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="h-[700px] bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden relative">
              <ModernGraph 
                data={graphData || undefined} 
                selectedProject="Default Project"
                isLoading={isGraphLoading}
                error={actualGraphError}
                onNodeSelect={handleNodeSelect}
                onEdgeSelect={handleEdgeSelect}
              />
              
              {/* Node Details Dialog */}
              <NodeDetailsDialog
                isOpen={showNodeDialog}
                onClose={handleCloseNodeDialog}
                selectedNode={selectedGraphNode}
                selectedEdge={selectedGraphEdge}
              />
            </div>
          </div>
        );
      case 'ai-specialization':
        return <AISpecializationSection apiKey={apiKey} />;
      case 'api-keys':
        return <ModernApiKeysSection />;
      case 'api-docs':
        return (
          <div className="absolute inset-0 -m-6 z-50">
            <ModernDocumentationSection standalone={true} />
          </div>
        );
      default:
        return <OverviewSection user={user} graphData={graphData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Command Palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh]"
            onClick={() => setShowCommandPalette(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <Command className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search or jump to..."
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setShowCommandPalette(false);
                    }}
                    className="flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-gray-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          className={`bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col relative z-30 ${
            isMobileMenuOpen ? 'fixed inset-y-0 left-0' : 'hidden lg:flex'
          }`}
        >
          {/* Sidebar Header - Logo Only */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              {isSidebarOpen ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/favicon.ico"
                    alt="VRIN"
                    width={56}
                    height={56}
                    className="rounded"
                  />
                  <p className="text-sm text-gray-500">v0.8.0</p>
                </motion.div>
              ) : (
                <Image
                  src="/favicon.ico"
                  alt="VRIN"
                  width={40}
                  height={40}
                  className="rounded mx-auto"
                />
              )}
              {isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Chat Page Link - Minimal Design */}
            <Link href="/chat">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left bg-gray-900 text-white hover:bg-gray-800">
                <MessageSquare className="w-4 h-4" />
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Chat with VRIN</span>
                      <span className="px-1.5 py-0.5 bg-white/20 text-xs font-medium rounded">
                        NEW
                      </span>
                    </div>
                  </motion.div>
                )}
              </button>
            </Link>

            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {isSidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-gray-100/50">
            {isSidebarOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {user.name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white/70 backdrop-blur-xl px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <p className="text-sm text-gray-500">
                  Hybrid RAG v0.8.0
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Quick Search */}
                <div className="hidden md:flex items-center gap-2 bg-gray-100/80 rounded-xl px-4 py-2 min-w-[300px]">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search knowledge..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-transparent outline-none flex-1 text-sm"
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Component sections...
function OverviewSection({ user, graphData }: { user: User; graphData: GraphData | null }) {
  return (
    <div className="space-y-8">
      {/* Welcome Header - Minimal Design */}
      <div className="bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome back, {user.name || user.email.split('@')[0]}
        </h2>
        <p className="text-gray-600">
          Your knowledge graph is growing. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Knowledge Nodes"
          value={graphData?.statistics?.nodeCount?.toString() || '0'}
          change="+12%"
          icon={Brain}
          color="blue"
        />
        <StatsCard
          title="Connections"
          value={graphData?.statistics?.edgeCount?.toString() || '0'}
          change="+8%"
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="Facts Extracted"
          value={graphData?.statistics?.tripleCount?.toString() || '0'}
          change="+15%"
          icon={Target}
          color="purple"
        />
        <StatsCard
          title="Graph Density"
          value={graphData?.statistics?.density?.toFixed(3) || '0.000'}
          change="+5%"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Quick Actions - Minimal Design */}
      <div className="bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickActionCard
            title="Add Knowledge"
            description="Insert new information with smart deduplication"
            icon={Plus}
            color="blue"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Smart Search"
            description="Query your knowledge with hybrid RAG"
            icon={Search}
            color="green"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Explore Graph"
            description="Visualize your knowledge connections"
            icon={Globe}
            color="purple"
            onClick={() => {}}
          />
          <QuickActionCard
            title="AI Expert"
            description="Configure custom AI specialization"
            icon={Sparkles}
            color="indigo"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo';
}) {
  const iconColorClasses = {
    blue: 'text-gray-700',
    green: 'text-gray-700',
    purple: 'text-gray-700',
    orange: 'text-gray-700',
    indigo: 'text-gray-700',
  };

  return (
    <div className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} />
        <span className="text-xs text-gray-500">{change}</span>
      </div>
      <div>
        <h3 className="text-3xl font-semibold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, icon: Icon, color, onClick }: {
  title: string;
  description: string;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo';
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-6 bg-gray-50 hover:bg-gray-100 text-left transition-colors duration-200 group"
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-gray-700" />
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

// Search Section
function SearchSection({ searchQuery, setSearchQuery, handleSearch, isLoading }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Search</h2>
        <p className="text-gray-600">Query your knowledge with hybrid RAG - combining graph reasoning and vector similarity</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200/50 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
              placeholder="What would you like to know?"
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Example Queries */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500" />
          Example Queries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "What is machine learning?",
            "Explain quantum computing",
            "How does neural networks work?",
            "What are the applications of AI?"
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(example)}
              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Additional component sections would continue here...
// For brevity, I'll include the main structure and a few key sections

function SearchResultsSection({ result }: { result: VRINQueryResult | null }) {
  const [sourcesOpen, setSourcesOpen] = React.useState(false);

  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Result Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {result.search_time}
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              {result.combined_results} results
            </span>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{result.total_facts}</div>
            <div className="text-sm text-blue-600">Graph Facts</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{result.total_chunks}</div>
            <div className="text-sm text-green-600">Vector Chunks</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{result.combined_results}</div>
            <div className="text-sm text-purple-600">Combined</div>
          </div>
        </div>

        {/* Answer */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            AI-Generated Answer
          </h3>
          <p className="text-gray-800 leading-relaxed">{result.summary}</p>
        </div>

        {/* Thinking Panel */}
        {result.metadata && (
          <ThinkingPanel metadata={result.metadata} />
        )}

        {/* Sources Button */}
        {result.sources && result.sources.length > 0 && (
          <button
            onClick={() => setSourcesOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 text-sm font-medium transition-colors flex items-center gap-2"
          >
            📚 Sources · {result.sources.length}
          </button>
        )}

        {/* Expert Analysis */}
        {result.expert_analysis && (
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Expert Analysis Applied
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Specialization:</span>
                <div className="font-medium">{result.expert_analysis.specialization_applied ? 'Yes' : 'No'}</div>
              </div>
              <div>
                <span className="text-gray-600">Confidence:</span>
                <div className="font-medium capitalize">{result.expert_analysis.confidence_level}</div>
              </div>
              <div>
                <span className="text-gray-600">Reasoning Chains:</span>
                <div className="font-medium">{result.expert_analysis.reasoning_chains_used}</div>
              </div>
              <div>
                <span className="text-gray-600">Analysis Depth:</span>
                <div className="font-medium capitalize">{result.expert_analysis.analysis_depth}</div>
              </div>
            </div>
          </div>
        )}

        {/* Entities */}
        {result.entities_found && result.entities_found.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Entities Found:</h4>
            <div className="flex flex-wrap gap-2">
              {result.entities_found.map((entity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {entity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sources Panel */}
      {result.sources && (
        <SourcesPanel
          sources={result.sources}
          isOpen={sourcesOpen}
          onClose={() => setSourcesOpen(false)}
        />
      )}
    </div>
  );
}

// Insert Section
function InsertSection({ content, setContent, title, setTitle, tags, setTags, handleInsert, isLoading }: {
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
  tags: string;
  setTags: (tags: string) => void;
  handleInsert: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Knowledge</h2>
        <p className="text-gray-600">Insert new information with smart deduplication and fact extraction</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200/50 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your knowledge"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the knowledge content you want to insert..."
              rows={8}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleInsert}
            disabled={isLoading || !content.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Insert Knowledge
              </>
            )}
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="Smart Deduplication"
          description="Prevents duplicate content, reduces storage by 40-60%"
          icon={CheckCircle2}
          color="green"
        />
        <FeatureCard
          title="Fact Extraction"
          description="Extracts 3-8 high-quality facts with 0.8+ confidence"
          icon={Brain}
          color="blue"
        />
        <FeatureCard
          title="Storage Optimization"
          description="Self-updating system with higher confidence facts"
          icon={Database}
          color="purple"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon: Icon, color }: {
  title: string;
  description: string;
  icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo';
}) {
  const colorClasses = {
    green: 'from-green-50 to-green-100 text-green-600',
    blue: 'from-blue-50 to-blue-100 text-blue-600',
    purple: 'from-purple-50 to-purple-100 text-purple-600',
    orange: 'from-orange-50 to-orange-100 text-orange-600',
    indigo: 'from-indigo-50 to-indigo-100 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

// Placeholder sections for other components
function InsertResultsSection({ result }: { result: VRINInsertResult | null }) {
  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 border border-gray-200/50 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Inserted Successfully!</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{result.facts_extracted}</div>
            <div className="text-sm text-blue-600">Facts Extracted</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{result.processing_time}</div>
            <div className="text-sm text-green-600">Processing Time</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-lg font-bold text-purple-600">{result.chunk_stored ? 'Yes' : 'No'}</div>
            <div className="text-sm text-purple-600">Chunk Stored</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="font-semibold mb-3">Storage Details</h3>
          <p className="text-gray-700 mb-2">{result.storage_details}</p>
          <p className="text-sm text-gray-600">Reason: {result.chunk_storage_reason.replace(/_/g, ' ')}</p>
        </div>
      </div>
    </div>
  );
}

function KnowledgeHubSection({ graphData }: { graphData: GraphData | null }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Hub</h2>
        <p className="text-gray-600">Explore and manage your knowledge base</p>
      </div>
      
      <div className="bg-white rounded-2xl p-8 border border-gray-200/50 shadow-sm">
        <p className="text-center text-gray-500">Knowledge Hub interface coming soon...</p>
      </div>
    </div>
  );
}