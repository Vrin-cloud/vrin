'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Database,
  Cloud,
  Shield,
  Monitor,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  TrendingUp,
  Zap,
  Globe,
  Key,
  Settings,
  RefreshCw,
  AlertCircle,
  Info,
  ExternalLink,
  Copy,
  Download
} from 'lucide-react'
import { ConfigurationStatus, DeploymentStatus } from '@/types/enterprise'

// Mock data - in real implementation, this would come from API
const mockInfrastructureStatus = {
  organizationId: '855b6582-3066-4737-b602-e4872dbfb835',
  organizationName: 'TechCorp Enterprise',
  status: 'active' as ConfigurationStatus,
  lastValidated: '2025-01-05T14:30:00Z',
  lastUpdated: '2025-01-05T12:00:00Z',
  
  services: {
    database: {
      name: 'Neptune Graph Database',
      type: 'neptune',
      endpoint: 'techcorp-neptune.cluster-xyz.us-east-1.neptune.amazonaws.com',
      status: 'healthy',
      lastChecked: '2025-01-05T14:28:00Z',
      responseTime: 45,
      uptime: 99.97,
      version: '1.3.2.1',
      connections: {
        active: 12,
        max: 100
      }
    },
    vectorStore: {
      name: 'OpenSearch Vector Store',
      type: 'opensearch',
      endpoint: 'techcorp-opensearch.us-east-1.es.amazonaws.com',
      status: 'healthy',
      lastChecked: '2025-01-05T14:29:00Z',
      responseTime: 23,
      uptime: 99.95,
      version: '2.11.0',
      indexHealth: 'green',
      documents: 1250000,
      storageUsed: '4.2 GB'
    },
    llm: {
      name: 'OpenAI GPT-4',
      provider: 'openai',
      model: 'gpt-4-turbo',
      status: 'healthy',
      lastChecked: '2025-01-05T14:30:00Z',
      responseTime: 1200,
      uptime: 99.99,
      tokensUsedToday: 45000,
      tokenLimit: 1000000
    }
  },
  
  security: {
    encryptionAtRest: 'enabled',
    encryptionInTransit: 'enabled',
    auditLogging: 'enabled',
    mfaRequired: true,
    lastSecurityScan: '2025-01-04T10:00:00Z',
    complianceScore: 98,
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 3
    }
  },
  
  monitoring: {
    enabled: true,
    alerts: {
      active: 0,
      resolved24h: 2,
      total30d: 12
    },
    metrics: {
      queryLatencyP95: 850,
      errorRate: 0.02,
      throughput: 145
    }
  },
  
  costs: {
    currentMonth: 2847.50,
    projected: 3200.00,
    budget: 4000.00,
    trend: 'stable',
    breakdown: [
      { service: 'Neptune Database', cost: 1200.00 },
      { service: 'OpenSearch', cost: 800.50 },
      { service: 'Lambda Functions', cost: 347.00 },
      { service: 'Data Transfer', cost: 500.00 }
    ]
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'active':
      return 'text-green-600 bg-green-100'
    case 'warning':
      return 'text-yellow-600 bg-yellow-100'
    case 'critical':
    case 'failed':
      return 'text-red-600 bg-red-100'
    case 'validating':
    case 'deploying':
      return 'text-blue-600 bg-blue-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
    case 'active':
      return <CheckCircle className="w-4 h-4" />
    case 'warning':
      return <AlertTriangle className="w-4 h-4" />
    case 'critical':
    case 'failed':
      return <XCircle className="w-4 h-4" />
    case 'validating':
    case 'deploying':
      return <Clock className="w-4 h-4" />
    default:
      return <AlertCircle className="w-4 h-4" />
  }
}

export default function InfrastructureStatusPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')

  const refreshStatus = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Infrastructure Status</h1>
              <p className="text-gray-600 mt-1">
                Monitor your VRIN enterprise deployment health and performance
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={refreshStatus}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button asChild>
                <a href="/enterprise/infrastructure">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <Badge className={`px-3 py-1 ${getStatusColor(mockInfrastructureStatus.status)}`}>
                      {getStatusIcon(mockInfrastructureStatus.status)}
                      <span className="ml-2">{mockInfrastructureStatus.status.toUpperCase()}</span>
                    </Badge>
                    {mockInfrastructureStatus.organizationName}
                  </CardTitle>
                  <CardDescription>
                    Last validated: {new Date(mockInfrastructureStatus.lastValidated).toLocaleString()}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Organization ID</div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {mockInfrastructureStatus.organizationId.slice(0, 8)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(mockInfrastructureStatus.organizationId)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="costs" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Costs
            </TabsTrigger>
          </TabsList>

          {/* Services Status */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Database Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    {mockInfrastructureStatus.services.database.name}
                  </CardTitle>
                  <CardDescription>
                    Graph database for knowledge storage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className={`px-2 py-1 ${getStatusColor(mockInfrastructureStatus.services.database.status)}`}>
                      {getStatusIcon(mockInfrastructureStatus.services.database.status)}
                      <span className="ml-1">{mockInfrastructureStatus.services.database.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span>{mockInfrastructureStatus.services.database.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span>{mockInfrastructureStatus.services.database.uptime}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Version</span>
                      <span>{mockInfrastructureStatus.services.database.version}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Connections</span>
                      <span>
                        {mockInfrastructureStatus.services.database.connections.active}/
                        {mockInfrastructureStatus.services.database.connections.max}
                      </span>
                    </div>
                    <Progress 
                      value={(mockInfrastructureStatus.services.database.connections.active / mockInfrastructureStatus.services.database.connections.max) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500 mb-2">Endpoint</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {mockInfrastructureStatus.services.database.endpoint}
                      </code>
                      <button
                        onClick={() => copyToClipboard(mockInfrastructureStatus.services.database.endpoint)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vector Store Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {mockInfrastructureStatus.services.vectorStore.name}
                  </CardTitle>
                  <CardDescription>
                    Vector embeddings for semantic search
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className={`px-2 py-1 ${getStatusColor(mockInfrastructureStatus.services.vectorStore.status)}`}>
                      {getStatusIcon(mockInfrastructureStatus.services.vectorStore.status)}
                      <span className="ml-1">{mockInfrastructureStatus.services.vectorStore.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span>{mockInfrastructureStatus.services.vectorStore.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Index Health</span>
                      <Badge className={`px-2 py-1 text-xs ${getStatusColor(mockInfrastructureStatus.services.vectorStore.indexHealth)}`}>
                        {mockInfrastructureStatus.services.vectorStore.indexHealth}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Documents</span>
                      <span>{mockInfrastructureStatus.services.vectorStore.documents.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Storage Used</span>
                      <span>{mockInfrastructureStatus.services.vectorStore.storageUsed}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500 mb-2">Endpoint</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {mockInfrastructureStatus.services.vectorStore.endpoint}
                      </code>
                      <button
                        onClick={() => copyToClipboard(mockInfrastructureStatus.services.vectorStore.endpoint)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* LLM Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    {mockInfrastructureStatus.services.llm.name}
                  </CardTitle>
                  <CardDescription>
                    AI model for reasoning and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className={`px-2 py-1 ${getStatusColor(mockInfrastructureStatus.services.llm.status)}`}>
                      {getStatusIcon(mockInfrastructureStatus.services.llm.status)}
                      <span className="ml-1">{mockInfrastructureStatus.services.llm.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span>{mockInfrastructureStatus.services.llm.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Model</span>
                      <span>{mockInfrastructureStatus.services.llm.model}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span>{mockInfrastructureStatus.services.llm.uptime}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tokens Today</span>
                      <span>
                        {mockInfrastructureStatus.services.llm.tokensUsedToday.toLocaleString()}/
                        {(mockInfrastructureStatus.services.llm.tokenLimit / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <Progress 
                      value={(mockInfrastructureStatus.services.llm.tokensUsedToday / mockInfrastructureStatus.services.llm.tokenLimit) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500 mb-1">Provider</div>
                    <div className="text-sm font-medium capitalize">
                      {mockInfrastructureStatus.services.llm.provider}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Status */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Overview
                  </CardTitle>
                  <CardDescription>
                    Compliance and security configuration status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compliance Score</span>
                      <div className="flex items-center gap-2">
                        <Progress value={mockInfrastructureStatus.security.complianceScore} className="w-20 h-2" />
                        <span className="text-sm font-medium">{mockInfrastructureStatus.security.complianceScore}%</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Encryption at Rest</span>
                        <Badge className={`px-2 py-1 ${getStatusColor('healthy')}`}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Encryption in Transit</span>
                        <Badge className={`px-2 py-1 ${getStatusColor('healthy')}`}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Audit Logging</span>
                        <Badge className={`px-2 py-1 ${getStatusColor('healthy')}`}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">MFA Required</span>
                        <Badge className={`px-2 py-1 ${getStatusColor('healthy')}`}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium mb-3">Last Security Scan</div>
                      <div className="text-xs text-gray-500">
                        {new Date(mockInfrastructureStatus.security.lastSecurityScan).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Security Findings
                  </CardTitle>
                  <CardDescription>
                    Vulnerability assessment results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {mockInfrastructureStatus.security.vulnerabilities.critical}
                        </div>
                        <div className="text-sm text-red-600">Critical</div>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {mockInfrastructureStatus.security.vulnerabilities.high}
                        </div>
                        <div className="text-sm text-orange-600">High</div>
                      </div>
                      
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {mockInfrastructureStatus.security.vulnerabilities.medium}
                        </div>
                        <div className="text-sm text-yellow-600">Medium</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {mockInfrastructureStatus.security.vulnerabilities.low}
                        </div>
                        <div className="text-sm text-blue-600">Low</div>
                      </div>
                    </div>

                    {mockInfrastructureStatus.security.vulnerabilities.medium > 0 && (
                      <Alert>
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          {mockInfrastructureStatus.security.vulnerabilities.medium} medium severity findings detected. 
                          Review security recommendations for mitigation steps.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    System performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {mockInfrastructureStatus.monitoring.metrics.queryLatencyP95}ms
                      </div>
                      <div className="text-sm text-gray-500">Query Latency (P95)</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {mockInfrastructureStatus.monitoring.metrics.errorRate}%
                      </div>
                      <div className="text-sm text-gray-500">Error Rate</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {mockInfrastructureStatus.monitoring.metrics.throughput}
                      </div>
                      <div className="text-sm text-gray-500">Queries/min</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Alert Summary
                  </CardTitle>
                  <CardDescription>
                    Alert activity and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {mockInfrastructureStatus.monitoring.alerts.active}
                      </div>
                      <div className="text-sm text-gray-500">Active Alerts</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {mockInfrastructureStatus.monitoring.alerts.resolved24h}
                      </div>
                      <div className="text-sm text-gray-500">Resolved (24h)</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-gray-600">
                        {mockInfrastructureStatus.monitoring.alerts.total30d}
                      </div>
                      <div className="text-sm text-gray-500">Total (30d)</div>
                    </div>
                  </div>

                  {mockInfrastructureStatus.monitoring.alerts.active === 0 && (
                    <Alert>
                      <CheckCircle className="w-4 h-4" />
                      <AlertDescription>
                        All systems operating normally. No active alerts.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cost Monitoring */}
          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Cost Overview
                  </CardTitle>
                  <CardDescription>
                    Current month spending and projections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Month</span>
                      <span className="text-2xl font-bold">${mockInfrastructureStatus.costs.currentMonth.toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Projected</span>
                        <span>${mockInfrastructureStatus.costs.projected.toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={(mockInfrastructureStatus.costs.projected / mockInfrastructureStatus.costs.budget) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Budget</span>
                        <span>${mockInfrastructureStatus.costs.budget.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Badge className={`px-2 py-1 ${getStatusColor('healthy')}`}>
                          {mockInfrastructureStatus.costs.trend}
                        </Badge>
                        <span className="text-sm text-gray-500">spending trend</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>
                    Spending by service category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockInfrastructureStatus.costs.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{item.service}</span>
                        <span className="font-medium">${item.cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}