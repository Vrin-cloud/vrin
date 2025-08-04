'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Search,
  Plus,
  RefreshCw,
  Settings,
  User,
  LogOut,
  Home,
  Key,
  FileText,
  BarChart3,
  Database,
  Globe,
  ChevronDown,
  Copy,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { Sidebar } from '@/components/dashboard/layout/sidebar';
import { HomeSection } from '@/components/dashboard/sections/home';
import { ApiKeysSection } from '@/components/dashboard/sections/api-keys';
import { ApiDocsSection } from '@/components/dashboard/sections/api-docs';
import { InteractiveGraph } from '@/components/dashboard/knowledge-graph/interactive-graph';
import { NodeDetailsDialog } from '@/components/dashboard/knowledge-graph/node-details-dialog';
import { LoginForm } from '@/components/dashboard/auth/login-form';
import { useRealKnowledgeGraph } from '../../hooks/use-knowledge-graph-real';
import { useAuth } from '../../hooks/use-auth';
import type { Node, Edge } from '../../types/knowledge-graph';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKnowledgeText, setNewKnowledgeText] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  
  const {
    data: graphData,
    isLoading,
    error,
    refetch,
    insertRecord,
    retrieveAndSummarize,
    isInserting,
    isRetrieving
  } = useRealKnowledgeGraph();

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  const handleAddKnowledge = async () => {
    if (!newKnowledgeText.trim()) return;
    
    try {
      await insertRecord({ text: newKnowledgeText });
      setNewKnowledgeText('');
      setShowAddModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to add knowledge:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      await retrieveAndSummarize({ query: searchQuery });
    } catch (error) {
      console.error('Failed to search:', error);
    }
  };

  const handleNodeSelect = (node: Node) => {
    console.log('Node selected:', node);
    setSelectedNode(node);
    setSelectedEdge(null);
    setShowDetailsDialog(true);
  };

  const handleEdgeSelect = (edge: Edge) => {
    console.log('Edge selected:', edge);
    setSelectedEdge(edge);
    setSelectedNode(null);
    setShowDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false);
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <HomeSection
            graphData={graphData}
            isLoading={isLoading}
            error={error}
            onAddKnowledge={() => setShowAddModal(true)}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isInserting={isInserting}
            isRetrieving={isRetrieving}
          />
        );
      case 'api-keys':
        return <ApiKeysSection />;
      case 'api-docs':
        return <ApiDocsSection />;
      case 'knowledge-graph':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-[70vh] min-h-[500px]">
            <InteractiveGraph
              data={graphData?.data}
              config={{
                layout: 'force',
                clustering: false,
                showLabels: true,
                showMetadata: false,
                colorBy: 'type',
                sizeBy: 'connections',
                physics: {
                  enabled: true,
                  gravity: 0.1,
                  repulsion: 100,
                  damping: 0.9
                },
                filters: {
                  nodeTypes: [],
                  edgeTypes: [],
                  confidenceRange: [0, 1],
                  timeRange: undefined
                }
              }}
              onNodeSelect={handleNodeSelect}
              onEdgeSelect={handleEdgeSelect}
              isLoading={isLoading}
              error={error?.message}
            />
          </div>
        );
      default:
        return <HomeSection
          graphData={graphData}
          isLoading={isLoading}
          error={error}
          onAddKnowledge={() => setShowAddModal(true)}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isInserting={isInserting}
          isRetrieving={isRetrieving}
        />;
    }
  };

  const getPageTitle = () => {
    switch (activeSection) {
      case 'home': return 'Dashboard';
      case 'knowledge-graph': return 'Knowledge Graph';
      case 'api-keys': return 'API Keys';
      case 'api-docs': return 'API Documentation';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 dashboard" data-theme="light">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative z-50 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300`}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setIsMobileMenuOpen(false);
          }}
          user={user}
          onLogout={logout}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search knowledge..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  ⌘K
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <Settings className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-white">
          <div className="p-6 lg:p-8">
            {renderSectionContent()}
          </div>
        </main>
      </div>

      {/* Add Knowledge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Knowledge</h3>
            <textarea
              value={newKnowledgeText}
              onChange={(e) => setNewKnowledgeText(e.target.value)}
              placeholder="Enter knowledge text..."
              className="w-full h-32 p-3 bg-gray-50 border border-gray-300 rounded-lg resize-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddKnowledge}
                disabled={isInserting || !newKnowledgeText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isInserting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Node/Edge Details Dialog */}
      <NodeDetailsDialog
        isOpen={showDetailsDialog}
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onClose={handleCloseDetailsDialog}
      />
    </div>
  );
} 