'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Brain,
  Key,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  BarChart3,
  Database,
  Globe,
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../hooks/use-auth';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any;
  onLogout: () => void;
}

const navigationItems = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    description: 'Overview and analytics',
    color: 'blue'
  },
  {
    id: 'knowledge-graph',
    label: 'Knowledge Graph',
    icon: Brain,
    description: 'Interactive visualization',
    color: 'purple'
  },
  {
    id: 'ai-specialization',
    label: 'AI Specialization',
    icon: Sparkles,
    description: 'Custom expert configuration',
    color: 'purple',
    badge: 'NEW'
  },
  {
    id: 'api-keys',
    label: 'API Keys',
    icon: Key,
    description: 'Manage access tokens',
    color: 'green'
  },
  {
    id: 'api-docs',
    label: 'API Documentation',
    icon: FileText,
    description: 'Integration guides',
    color: 'orange'
  }
];

export function Sidebar({
  isCollapsed,
  onToggle,
  activeSection,
  onSectionChange,
  user,
  onLogout
}: SidebarProps) {
  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-white/80 backdrop-blur-sm border-r border-gray-100 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">VRIN</h1>
                <p className="text-xs text-gray-500">Knowledge Graph</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-b border-gray-200"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              ⌘K
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Getting Started Section */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Getting Started
            </h3>
          </motion.div>
        )}

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`p-2 rounded-lg ${
                isActive
                  ? 'bg-blue-100 text-blue-600'
                  : `bg-gray-100 text-gray-600 group-hover:bg-gray-200`
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </motion.div>
              )}
            </motion.button>
          );
        })}

        {/* Core Concepts Section */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Core Concepts
            </h3>
            <div className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                  <Database className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Knowledge Storage</div>
                  <div className="text-xs text-gray-500">How data is organized</div>
                </div>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">API Integration</div>
                  <div className="text-xs text-gray-500">Connect your applications</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out</span>
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
} 