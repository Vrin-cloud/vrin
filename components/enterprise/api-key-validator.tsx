'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Key, TestTube } from 'lucide-react'
import { EnterpriseAuthService } from '@/lib/services/enterprise-auth'

export function ApiKeyValidator() {
  const [testKey, setTestKey] = useState('')
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    deploymentMode?: string
    message: string
  } | null>(null)
  
  const authService = new EnterpriseAuthService()

  const validateApiKey = (apiKey: string) => {
    // Enterprise API key patterns
    const patterns = {
      'vrin_ent_airgap_': 'Air-Gapped Deployment',
      'vrin_ent_vpc_': 'VPC Isolated Deployment', 
      'vrin_ent_hybrid_': 'Hybrid Explicit Deployment'
    }

    // Check if key matches enterprise format
    for (const [prefix, mode] of Object.entries(patterns)) {
      if (apiKey.startsWith(prefix)) {
        const suffix = apiKey.substring(prefix.length)
        if (/^[a-zA-Z0-9]{32}$/.test(suffix)) {
          return {
            isValid: true,
            deploymentMode: mode,
            message: `Valid enterprise API key for ${mode}`
          }
        }
      }
    }

    // Check if it's a regular VRIN key (should fail for enterprise)
    if (apiKey.startsWith('vrin_') && !apiKey.includes('_ent_')) {
      return {
        isValid: false,
        message: 'Regular VRIN API key detected - Enterprise keys required for private infrastructure'
      }
    }

    return {
      isValid: false,
      message: 'Invalid enterprise API key format. Expected: vrin_ent_[mode]_[32chars]'
    }
  }

  const handleValidate = () => {
    const result = validateApiKey(testKey)
    setValidationResult(result)
  }

  const generateTestKey = (mode: 'airgap' | 'vpc' | 'hybrid') => {
    const prefix = `vrin_ent_${mode}_`
    const suffix = Array.from({length: 32}, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        .charAt(Math.floor(Math.random() * 62))
    ).join('')
    
    const testKey = prefix + suffix
    setTestKey(testKey)
    setValidationResult(validateApiKey(testKey))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Enterprise API Key Validator
        </CardTitle>
        <CardDescription>
          Test enterprise API key format validation for private infrastructure deployments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Enterprise API Key</label>
          <Input
            value={testKey}
            onChange={(e) => setTestKey(e.target.value)}
            placeholder="vrin_ent_vpc_[32-character-key]"
            className="font-mono text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleValidate} disabled={!testKey.trim()}>
            <TestTube className="w-4 h-4 mr-2" />
            Validate Key
          </Button>
          <Button 
            variant="outline" 
            onClick={() => generateTestKey('vpc')}
          >
            Generate VPC Key
          </Button>
          <Button 
            variant="outline" 
            onClick={() => generateTestKey('airgap')}
          >
            Generate Air-Gap Key
          </Button>
          <Button 
            variant="outline" 
            onClick={() => generateTestKey('hybrid')}
          >
            Generate Hybrid Key
          </Button>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <Alert className={validationResult.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <div className="flex items-start gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription>
                  {validationResult.message}
                </AlertDescription>
                {validationResult.deploymentMode && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {validationResult.deploymentMode}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

        {/* Format Examples */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Valid Enterprise API Key Formats:</h4>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">VPC</Badge>
              <code className="text-gray-600">vrin_ent_vpc_[32-chars]</code>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Air-Gap</Badge>
              <code className="text-gray-600">vrin_ent_airgap_[32-chars]</code>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Hybrid</Badge>
              <code className="text-gray-600">vrin_ent_hybrid_[32-chars]</code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}