'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  Search,
  BarChart3,
  Settings,
  User,
  LogOut,
  Key,
  FileText,
  Database,
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Menu,
  Command,
  MessageSquare,
  Brain,
  Loader2
} from 'lucide-react';
import { AuthService, VRINService } from '../../lib/services/vrin-service';
import { ModernApiKeysSection } from '../../components/dashboard/sections/modern-api-keys';
import { ModernGraph } from '../../components/dashboard/knowledge-graph/modern-graph';
import { NodeDetailsDialog } from '../../components/dashboard/knowledge-graph/node-details-dialog';
import { ModernDocumentationSection } from '../../components/dashboard/sections/modern-documentation';
import { AISpecializationSection } from '../../components/dashboard/sections/ai-specialization';
import { DataSourcesSection } from '../../components/dashboard/sections/data-sources-section';
import { useAccountKnowledgeGraph } from '../../hooks/use-knowledge-graph';
import type { Node, Edge, Triple, GraphStatistics } from '../../types/knowledge-graph';
import vrinIcon from '@/app/icon.svg';

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

// Sidebar navigation items - defined outside component for use in search
const sidebarItems = [
  { id: 'home', label: 'Home', icon: BarChart3, color: 'blue' },
  { id: 'data-sources', label: 'Data Sources', icon: Globe, color: 'cyan', badge: 'NEW' },
  { id: 'graph', label: 'Knowledge Graph', icon: Database, color: 'pink' },
  { id: 'ai-specialization', label: 'AI Specialization', icon: Sparkles, color: 'purple' },
  { id: 'api-keys', label: 'API Keys', icon: Key, color: 'indigo' },
  { id: 'api-docs', label: 'Documentation', icon: FileText, color: 'teal' },
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [showMenuSearch, setShowMenuSearch] = useState(false);
  const [selectedGraphNode, setSelectedGraphNode] = useState<Node | null>(null);
  const [selectedGraphEdge, setSelectedGraphEdge] = useState<Edge | null>(null);
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // NextAuth session for Google OAuth
  const { data: session, status: sessionStatus } = useSession();

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
    // Check for existing auth from localStorage first
    let storedApiKey = authService.getStoredApiKey();
    let storedUser = authService.getStoredUser();

    // SECURITY FIX: If NextAuth session exists, validate it matches localStorage
    // This prevents cross-account data leakage where a previous user's data persists
    if (session?.user?.email && storedUser?.email) {
      if (session.user.email !== storedUser.email) {
        // MISMATCH DETECTED - Clear stale data from previous user
        console.warn(`Security: Session mismatch detected! localStorage: ${storedUser.email}, NextAuth: ${session.user.email}. Clearing stale data.`);
        localStorage.removeItem('vrin_api_key');
        localStorage.removeItem('vrin_user');
        localStorage.removeItem('vrin_chat_session_id');
        // Clear local variables so we fall through to NextAuth sync
        storedApiKey = null;
        storedUser = null;
      }
    }

    if (storedApiKey && storedUser) {
      // Validate that stored user data has required fields
      if (!storedUser.user_id || !storedUser.email) {
        console.warn('Incomplete user data in localStorage, clearing and redirecting to login...');
        localStorage.removeItem('vrin_user');
        localStorage.removeItem('vrin_api_key');
        setIsCheckingAuth(false);
        window.location.href = '/auth';
        return;
      }
      setApiKey(storedApiKey);
      setUser(storedUser);
      setVrinService(new VRINService(storedApiKey));
      setIsCheckingAuth(false);
    } else if (sessionStatus === 'loading') {
      // Wait for NextAuth session to load
      return;
    } else if (session?.user) {
      // Google OAuth: Sync NextAuth session to localStorage
      const nextAuthUser = session.user as any;
      const nextAuthApiKey = nextAuthUser.apiKey;
      const nextAuthUserId = nextAuthUser.userId;

      if (nextAuthApiKey && nextAuthUserId) {
        // Save to localStorage for dashboard compatibility
        const userData = {
          user_id: nextAuthUserId,
          email: nextAuthUser.email || '',
          name: nextAuthUser.name || nextAuthUser.email?.split('@')[0] || '',
          created_at: new Date().toISOString()
        };

        localStorage.setItem('vrin_api_key', nextAuthApiKey);
        localStorage.setItem('vrin_user', JSON.stringify(userData));

        // Update component state
        setApiKey(nextAuthApiKey);
        setUser(userData);
        setVrinService(new VRINService(nextAuthApiKey));
        console.log('Synced NextAuth session to localStorage:', { apiKey: nextAuthApiKey, user: userData });
      }
      setIsCheckingAuth(false);
    } else {
      setIsCheckingAuth(false);
    }

    // Check for URL query parameter to set active section
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['home', 'data-sources', 'graph', 'ai-specialization', 'api-keys', 'api-docs'].includes(tab)) {
      setActiveSection(tab);
    }
  }, [session, sessionStatus]);

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

  const handleLogout = async () => {
    // Clear localStorage
    authService.logout();
    setUser(null);
    setApiKey(null);
    setVrinService(null);

    // Also sign out from NextAuth (for Google OAuth users)
    await signOut({ redirect: false });

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

  // Show loading state while checking authentication
  if (isCheckingAuth || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Loading...</h1>
            <p className="text-gray-600 mt-2">Checking authentication</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !apiKey) {
    // Redirect to auth page immediately instead of showing intermediate screen
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
    // Show loading while redirecting
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection user={user} onNavigate={setActiveSection} />;
      case 'data-sources':
        return <DataSourcesSection apiKey={apiKey || undefined} userId={user?.user_id} userEmail={user?.email} />;
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
            <div className="h-[700px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
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
        return <HomeSection user={user} onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
              className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4"
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
          className={`bg-white border-r border-gray-200 flex flex-col relative z-30 ${
            isMobileMenuOpen ? 'fixed inset-y-0 left-0' : 'hidden lg:flex'
          }`}
        >
          {/* Sidebar Header - Logo Only */}
          <div className="h-[57px] px-6 flex items-center">
            <div className="flex items-center justify-between w-full">
              {isSidebarOpen ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center flex-1"
                >
                  <Image
                    src="/og-image.png"
                    alt="VRiN"
                    width={80}
                    height={28}
                    className="object-contain object-left"
                    priority
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center w-full"
                >
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="relative group rounded-lg transition-colors flex items-center justify-center hover:bg-gray-100"
                    title="Expand sidebar"
                  >
                    <Image
                      src={vrinIcon}
                      alt="VRiN"
                      width={40}
                      height={40}
                      className="group-hover:opacity-0 transition-opacity duration-200"
                      priority
                      unoptimized
                    />
                    <Menu className="w-5 h-5 text-gray-600 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                </motion.div>
              )}
              {isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
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
          <div className="p-4">
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
                      {user.name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email || ''}
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
          <header className="bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Menu Search */}
                <div className="hidden md:flex relative">
                  <div className="flex items-center gap-2 bg-gray-100/80 rounded-xl px-4 py-2 min-w-[300px]">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={menuSearchQuery}
                      onChange={(e) => {
                        setMenuSearchQuery(e.target.value);
                        setShowMenuSearch(e.target.value.length > 0);
                      }}
                      onFocus={() => menuSearchQuery.length > 0 && setShowMenuSearch(true)}
                      onBlur={() => setTimeout(() => setShowMenuSearch(false), 200)}
                      className="bg-transparent outline-none flex-1 text-sm"
                    />
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Command className="w-3 h-3" />
                      <span>K</span>
                    </div>
                  </div>

                  {/* Search Results Dropdown */}
                  {showMenuSearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
                      {sidebarItems
                        .filter(item =>
                          item.label.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(menuSearchQuery.toLowerCase())
                        )
                        .map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveSection(item.id);
                                setMenuSearchQuery('');
                                setShowMenuSearch(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <Icon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{item.label}</span>
                              {item.badge && (
                                <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded ml-auto">
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      {sidebarItems.filter(item =>
                        item.label.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
                        item.id.toLowerCase().includes(menuSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                      )}
                    </div>
                  )}
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
function HomeSection({ user, onNavigate }: { user: User; onNavigate: (section: string) => void }) {
  const gettingStartedSteps = [
    {
      step: 1,
      title: 'Connect Your Data Sources',
      description: 'Link your apps like Notion, Google Drive, Slack, and more to automatically sync your knowledge into VRIN.',
      icon: Globe,
      action: 'Go to Data Sources',
      section: 'data-sources',
      tips: [
        'Click "Connect New Source" to see available integrations',
        'Authorize VRIN to access your apps securely',
        'Your data syncs automatically once connected'
      ]
    },
    {
      step: 2,
      title: 'Chat with Your Knowledge',
      description: 'Ask questions in natural language and get intelligent answers from your connected data using hybrid RAG technology.',
      icon: MessageSquare,
      action: 'Open Chat',
      section: 'chat',
      isLink: true,
      href: '/chat',
      tips: [
        'Ask questions like "What did we discuss about project X?"',
        'VRIN searches across all your connected sources',
        'Get answers with source citations for verification'
      ]
    },
    {
      step: 3,
      title: 'Create AI Specialists',
      description: 'Train custom AI experts with specific knowledge domains, communication styles, and expertise areas.',
      icon: Sparkles,
      action: 'Go to AI Specialization',
      section: 'ai-specialization',
      tips: [
        'Define your expert\'s area of expertise',
        'Customize response style and tone',
        'Add specific knowledge sources for the expert'
      ]
    },
    {
      step: 4,
      title: 'Explore Your Knowledge Graph',
      description: 'Visualize how your information connects. See entities, relationships, and discover hidden insights.',
      icon: Database,
      action: 'View Knowledge Graph',
      section: 'graph',
      tips: [
        'Click on nodes to see entity details',
        'Zoom and pan to explore connections',
        'Use filters to focus on specific topics'
      ]
    },
    {
      step: 5,
      title: 'Manage API Keys',
      description: 'Generate API keys to integrate VRIN into your own applications and workflows programmatically.',
      icon: Key,
      action: 'Go to API Keys',
      section: 'api-keys',
      tips: [
        'Create separate keys for different applications',
        'Set permissions and rate limits',
        'Revoke keys anytime for security'
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Welcome to VRIN, {user.name || user.email?.split('@')[0] || 'User'}
        </h1>
        <p className="text-gray-600 text-lg">
          Your intelligent knowledge management platform. Follow these steps to get started.
        </p>
      </div>

      {/* Getting Started Steps */}
      <div className="space-y-4">
        {gettingStartedSteps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Step Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {item.step}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-5 h-5 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3">{item.description}</p>

                      {/* Tips */}
                      <ul className="space-y-1 mb-4">
                        {item.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-500">
                            <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    {item.isLink ? (
                      <Link href={item.href || '#'}>
                        <button className="flex-shrink-0 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                          {item.action}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    ) : (
                      <button
                        onClick={() => onNavigate(item.section)}
                        className="flex-shrink-0 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        {item.action}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Links</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('api-docs')}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Documentation
          </button>
          <button
            onClick={() => onNavigate('data-sources')}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Data Sources
          </button>
          <button
            onClick={() => onNavigate('graph')}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Knowledge Graph
          </button>
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
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-200">
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
      className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 text-left transition-colors duration-200 group"
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

