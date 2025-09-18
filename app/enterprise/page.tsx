'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Cloud,
  Database,
  Lock,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Building,
  Globe,
  Zap,
  Award
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, secure data handling, and comprehensive audit trails for enterprise peace of mind.',
    color: 'text-blue-600'
  },
  {
    icon: Cloud,
    title: 'Multi-Cloud Deployment',
    description: 'Deploy on AWS, Azure, GCP, or on-premise with identical functionality and performance.',
    color: 'text-purple-600'
  },
  {
    icon: Database,
    title: 'Private Infrastructure',
    description: 'Your data never leaves your infrastructure. Complete control over knowledge graphs and AI processing.',
    color: 'text-green-600'
  },
  {
    icon: Lock,
    title: 'Air-Gapped Options',
    description: 'Completely isolated deployments for maximum security and data sovereignty requirements.',
    color: 'text-red-600'
  },
  {
    icon: Users,
    title: 'SSO Integration',
    description: 'Seamless integration with your existing identity providers (SAML, OIDC, Active Directory).',
    color: 'text-indigo-600'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive monitoring, usage analytics, and cost optimization recommendations.',
    color: 'text-orange-600'
  }
]

const deploymentOptions = [
  {
    name: 'VPC Isolated',
    description: 'Deploy within your private VPC with network-level isolation',
    features: ['Private subnets only', 'VPN/DirectConnect', 'Security groups', 'Network monitoring'],
    recommended: 'Most Popular',
    estimatedTime: '30 minutes'
  },
  {
    name: 'Air-Gapped',
    description: 'Completely isolated deployment with no internet connectivity',
    features: ['Zero internet access', 'Offline operation', 'Custom registries', 'Physical isolation'],
    recommended: 'Maximum Security',
    estimatedTime: '45 minutes'
  },
  {
    name: 'Hybrid Explicit',
    description: 'Smart data routing based on sensitivity classification',
    features: ['Automatic classification', 'Policy-based routing', 'Cost optimization', 'Flexible deployment'],
    recommended: 'Most Flexible',
    estimatedTime: '25 minutes'
  }
]


export default function EnterpriseLandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">VRIN</h1>
                  <p className="text-xs text-gray-500">Enterprise</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/enterprise/contact">
                <Button variant="outline">Contact Sales</Button>
              </Link>
              <Link href="/enterprise/auth/login">
                <Button variant="default">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-6">
              <Award className="w-4 h-4 mr-2" />
              Enterprise-Grade AI Infrastructure
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Deploy VRIN in Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Private Infrastructure
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Enterprise-grade Hybrid RAG system with complete data sovereignty, 
              compliance frameworks, and user-defined AI specialization. 
              Deploy in minutes, control everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/enterprise/auth/login">
                <Button size="lg" variant="default" className="min-w-[200px]">
                  Start Deployment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/enterprise/demo">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  View Demo
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                30-minute setup
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                99.9% uptime SLA
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                24/7 support
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Ready from Day One
            </h2>
            <p className="text-lg text-gray-600">
              Built for organizations that need complete control over their AI infrastructure
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="py-20 bg-slate-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Deployment Model
            </h2>
            <p className="text-lg text-gray-600">
              Select the deployment option that best fits your security and compliance requirements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {deploymentOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow relative">
                  {option.recommended && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                    >
                      {option.recommended}
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center justify-between">
                      {option.name}
                      <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {option.estimatedTime}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {option.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Deploy Your Private VRIN Infrastructure?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start with our guided setup wizard and have your enterprise AI infrastructure 
              running in under 30 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/enterprise/auth/login">
                <Button size="lg" variant="secondary" className="min-w-[200px]">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/enterprise/contact">
                <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white hover:text-blue-600">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">VRIN Enterprise</h1>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Enterprise-grade AI infrastructure with complete data sovereignty and compliance.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/enterprise/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/enterprise/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/enterprise/security" className="hover:text-white">Security</Link></li>
                <li><Link href="/enterprise/compliance" className="hover:text-white">Compliance</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/enterprise/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/enterprise/support" className="hover:text-white">Support</Link></li>
                <li><Link href="/enterprise/status" className="hover:text-white">Status</Link></li>
                <li><Link href="/enterprise/changelog" className="hover:text-white">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VRIN Enterprise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}