'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnterpriseUser } from '@/types/enterprise'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import {
  Home,
  Settings,
  Database,
  Cloud,
  Shield,
  BarChart3,
  Key,
  Users,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Monitor,
  DollarSign,
  Bell,
  HelpCircle
} from 'lucide-react'

interface EnterpriseSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  user: EnterpriseUser
}

const navigationItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Home,
    description: 'Dashboard and status',
    href: '/dashboard'
  },
  {
    id: 'configurations',
    label: 'Configurations',
    icon: Settings,
    description: 'Infrastructure configs',
    href: '/dashboard/configurations'
  },
  {
    id: 'deployments',
    label: 'Deployments',
    icon: Rocket,
    description: 'Manage deployments',
    href: '/dashboard/deployments'
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: Monitor,
    description: 'Health and metrics',
    href: '/dashboard/monitoring'
  },
  {
    id: 'api-keys',
    label: 'API Keys',
    icon: Key,
    description: 'Enterprise API keys',
    href: '/dashboard/api-keys'
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: Shield,
    description: 'Security and audit',
    href: '/dashboard/compliance'
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    description: 'Team management',
    href: '/dashboard/users',
    permission: 'manage_users'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: DollarSign,
    description: 'Usage and costs',
    href: '/dashboard/billing',
    permission: 'view_billing'
  }
]

const resourceItems = [
  {
    id: 'documentation',
    label: 'Documentation',
    icon: FileText,
    description: 'Setup guides and API docs',
    href: '/docs'
  },
  {
    id: 'support',
    label: 'Support',
    icon: HelpCircle,
    description: 'Get help',
    href: '/support'
  }
]

export function EnterpriseSidebar({ isCollapsed, onToggle, user }: EnterpriseSidebarProps) {
  const { logout, hasPermission } = useEnterpriseAuth()
  const [activeSection, setActiveSection] = React.useState('overview')

  const handleLogout = () => {
    logout()
  }

  const filteredNavigationItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  )

  return (
    <motion.div
      initial={{ width: isCollapsed ? 64 : 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-40 shadow-lg"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">VRIN</h1>
                <p className="text-xs text-gray-500">Enterprise</p>
              </div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Organization Info */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 border-b border-gray-100 bg-gray-50"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-900">
              {user.organizationId?.substring(0, 8)}...
            </p>
            <Badge variant="secondary" className="text-xs">
              {user.role}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-xs text-gray-600">All systems operational</p>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Main Navigation */}
        <div className="space-y-1 mb-8">
          {!isCollapsed && (
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            >
              Management
            </motion.h3>
          )}
          
          {filteredNavigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Resources Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            >
              Resources
            </motion.h3>
          )}
          
          {resourceItems.map((item, index) => {
            const Icon = item.icon
            
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + filteredNavigationItems.length) * 0.05 }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-gray-200">
                  <Icon className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {user.mfaEnabled && (
                  <Shield className="w-3 h-3 text-green-500" />
                )}
                <Bell className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="flex-1 text-xs hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}