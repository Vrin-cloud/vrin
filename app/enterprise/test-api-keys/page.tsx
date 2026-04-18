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
            
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Key Features (v2 format):</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Compact discriminators:</strong> <code>vrin_ent_&lt;env&gt;&lt;deploy&gt;_&lt;32 chars&gt;</code> — env ∈ {`{l, d}`}, deploy ∈ {`{a, v, h}`}</li>
              <li><strong>192-bit entropy:</strong> 32-char base62 suffix from cryptographically-secure random</li>
              <li><strong>SHA-256 stored:</strong> Raw key shown once at creation; only the hash is persisted</li>
              <li><strong>Format validation:</strong> Prevents standard VRIN keys from authenticating against enterprise infrastructure</li>
              <li><strong>Deployment tracking:</strong> Keys are tied to specific infrastructure configurations</li>
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