'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Users,
  UserPlus,
  Mail,
  Key,
  Settings,
  Database,
  Activity,
  BarChart3,
  Menu,
  Shield,
  MessageSquare
} from 'lucide-react'
import { useEnterpriseAuth } from '@/hooks/use-enterprise-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Import section components
import OverviewSection from './sections/overview-section'
import TeamMembersSection from './sections/team-members-section'
import ApiKeysPage from './sections/api-keys-section'
import InfrastructureConfigurationPage from './sections/infrastructure-section'
import ConfigurationsPage from './sections/configurations-section'

// Sidebar navigation items
const navigationItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'chat', label: 'Chat', icon: MessageSquare, highlight: true, isLink: true, href: '/enterprise/chat' },
  { id: 'team-members', label: 'Team Members', icon: Users },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'infrastructure', label: 'Infrastructure', icon: Database },
  { id: 'configurations', label: 'Configurations', icon: Settings },
]

function DashboardContent() {
  const { user, isAuthenticated, loading } = useEnterpriseAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')

  // Initialize from URL on mount
  useEffect(() => {
    const section = searchParams.get('section')
    if (section && navigationItems.find(item => item.id === section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  // Handle section navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId)
    // Update URL without page reload
    router.push(`/enterprise/dashboard?section=${sectionId}`, { scroll: false })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/enterprise/auth/login'
    }
    return null
  }

  // Render the active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection user={user} />
      case 'team-members':
        return <TeamMembersSection user={user} />
      case 'api-keys':
        return <ApiKeysPage />
      case 'infrastructure':
        return <InfrastructureConfigurationPage />
      case 'configurations':
        return <ConfigurationsPage />
      default:
        return <OverviewSection user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Fixed Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {isSidebarOpen ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-1 flex-1"
                >
                  <Image
                    src="/og-image.png"
                    alt="VRiN"
                    width={80}
                    height={28}
                    className="object-contain object-left"
                    priority
                  />
                  <p className="text-xs text-gray-500">Enterprise v0.8.0</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center w-full"
                >
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="relative group p-2 rounded-lg transition-colors w-12 h-12 flex items-center justify-center"
                  >
                    <Image
                      src="/icon.svg"
                      alt="VRiN"
                      width={40}
                      height={40}
                      className="object-contain group-hover:opacity-0 transition-opacity"
                      priority
                    />
                    <Menu className="w-6 h-6 text-gray-600 absolute opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </motion.div>
              )}
              {isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              // Handle external links (like Chat)
              if (item.isLink && item.href) {
                return (
                  <Link key={item.id} href={item.href}>
                    <motion.div
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-gray-100`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0 text-gray-600" />
                      {isSidebarOpen && (
                        <span className="font-medium flex-1 text-left truncate">{item.label}</span>
                      )}
                      {item.highlight && isSidebarOpen && (
                        <Badge className="bg-purple-500 text-white text-xs flex-shrink-0">NEW</Badge>
                      )}
                    </motion.div>
                  </Link>
                )
              }

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  {isSidebarOpen && (
                    <span className="font-medium flex-1 text-left truncate">{item.label}</span>
                  )}
                  {item.highlight && isSidebarOpen && (
                    <Badge className="bg-green-500 text-white text-xs flex-shrink-0">NEW</Badge>
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user.firstName?.charAt(0) || 'A'}
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <Button
                variant="ghost"
                className="w-full mt-3 text-sm"
                onClick={() => {
                  localStorage.removeItem('enterprise_token')
                  window.location.href = '/enterprise/auth/login'
                }}
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - Only this changes */}
      <motion.div
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? 256 : 80 }}
        className="flex-1 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto p-8">
          {/* Render active section with animation */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveSection()}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function EnterpriseDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
