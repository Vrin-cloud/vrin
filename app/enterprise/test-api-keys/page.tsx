'use client'

import { ApiKeyValidator } from '@/components/enterprise/api-key-validator'

export default function TestApiKeysPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enterprise API Key Testing
          </h1>
          <p className="text-lg text-gray-600">
            Test and validate enterprise API key formats for private infrastructure deployments
          </p>
        </div>
        
        <div className="flex justify-center">
          <ApiKeyValidator />
        </div>

        <div className="mt-12 bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Enterprise API Key System Overview</h2>
          <div className="prose text-gray-600">
            <p className="mb-4">
              The VRIN enterprise API key system ensures that private infrastructure deployments 
              use properly formatted keys that identify the deployment mode and security requirements.
            </p>
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Key Features:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Mode-Specific Prefixes:</strong> Each deployment mode has a unique prefix</li>
              <li><strong>32-Character Suffix:</strong> Cryptographically secure random string</li>
              <li><strong>Format Validation:</strong> Prevents regular API keys from accessing enterprise infrastructure</li>
              <li><strong>Deployment Tracking:</strong> Keys are tied to specific infrastructure configurations</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Security Benefits:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Prevents accidental data leakage between regular and enterprise environments</li>
              <li>Enables audit trails and compliance reporting by deployment type</li>
              <li>Supports automated infrastructure provisioning and management</li>
              <li>Compatible with enterprise SSO and MFA requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}