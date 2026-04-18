'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Key, TestTube } from 'lucide-react'

/**
 * V2 key format:
 *   Standard:   vrin_<env>_<32 base62>        env ∈ {live, dev}
 *   Enterprise: vrin_ent_<env><deploy>_<32 base62>
 *                env:    l (live) | d (dev)
 *                deploy: a (air_gapped) | v (vpc_isolated) | h (hybrid_explicit)
 * Example:      vrin_ent_lv_dxLk2nT8qJFY9sPmW3vHxR7cB4eGaZ6y  (live + VPC)
 */

const V2_STANDARD_RE = /^vrin_(live|dev)_[0-9A-Za-z]{32}$/
const V2_ENTERPRISE_RE = /^vrin_ent_([ld])([avh])_[0-9A-Za-z]{32}$/

const ENV_LABEL: Record<string, string> = { l: 'Live', d: 'Dev' }
const DEPLOY_LABEL: Record<string, string> = {
  a: 'Air-Gapped Deployment',
  v: 'VPC Isolated Deployment',
  h: 'Hybrid Explicit Deployment',
}

const BASE62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function randomToken(): string {
  return Array.from({ length: 32 }, () => BASE62.charAt(Math.floor(Math.random() * 62))).join('')
}

export function ApiKeyValidator() {
  const [testKey, setTestKey] = useState('')
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    deploymentMode?: string
    environment?: string
    message: string
  } | null>(null)

  const validateApiKey = (apiKey: string) => {
    const entMatch = V2_ENTERPRISE_RE.exec(apiKey)
    if (entMatch) {
      const [, envCode, deployCode] = entMatch
      return {
        isValid: true,
        environment: ENV_LABEL[envCode],
        deploymentMode: DEPLOY_LABEL[deployCode],
        message: `Valid enterprise API key: ${ENV_LABEL[envCode]} + ${DEPLOY_LABEL[deployCode]}`,
      }
    }

    if (V2_STANDARD_RE.test(apiKey)) {
      return {
        isValid: false,
        message:
          'Standard VRIN API key detected — enterprise keys required for private infrastructure. ' +
          'Expected format: vrin_ent_<env><deploy>_<32 chars>',
      }
    }

    if (apiKey.startsWith('vrin_')) {
      return {
        isValid: false,
        message:
          'Invalid key format. Enterprise keys: vrin_ent_<env><deploy>_<32 chars> where env ∈ {l, d} and deploy ∈ {a, v, h}.',
      }
    }

    return {
      isValid: false,
      message: 'Invalid API key. Expected prefix vrin_ent_<env><deploy>_',
    }
  }

  const handleValidate = () => {
    setValidationResult(validateApiKey(testKey))
  }

  const generateTestKey = (env: 'l' | 'd', deploy: 'a' | 'v' | 'h') => {
    const key = `vrin_ent_${env}${deploy}_${randomToken()}`
    setTestKey(key)
    setValidationResult(validateApiKey(key))
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Enterprise API Key</label>
          <Input
            value={testKey}
            onChange={(e) => setTestKey(e.target.value)}
            placeholder="vrin_ent_lv_<32-character-key>"
            className="font-mono text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleValidate} disabled={!testKey.trim()}>
            <TestTube className="w-4 h-4 mr-2" />
            Validate Key
          </Button>
          <Button variant="outline" onClick={() => generateTestKey('l', 'v')}>
            Generate Live + VPC
          </Button>
          <Button variant="outline" onClick={() => generateTestKey('l', 'a')}>
            Generate Live + Air-Gap
          </Button>
          <Button variant="outline" onClick={() => generateTestKey('l', 'h')}>
            Generate Live + Hybrid
          </Button>
          <Button variant="outline" onClick={() => generateTestKey('d', 'v')}>
            Generate Dev + VPC
          </Button>
        </div>

        {validationResult && (
          <Alert
            className={
              validationResult.isValid
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }
          >
            <div className="flex items-start gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <AlertDescription>{validationResult.message}</AlertDescription>
                {(validationResult.deploymentMode || validationResult.environment) && (
                  <div className="mt-2 flex gap-1">
                    {validationResult.environment && (
                      <Badge variant="secondary" className="text-xs">
                        {validationResult.environment}
                      </Badge>
                    )}
                    {validationResult.deploymentMode && (
                      <Badge variant="secondary" className="text-xs">
                        {validationResult.deploymentMode}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Valid Enterprise API Key Formats (v2):</h4>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Live + VPC</Badge>
              <code className="text-gray-600">vrin_ent_lv_[32-chars]</code>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Live + Air-Gap</Badge>
              <code className="text-gray-600">vrin_ent_la_[32-chars]</code>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Live + Hybrid</Badge>
              <code className="text-gray-600">vrin_ent_lh_[32-chars]</code>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Dev + VPC</Badge>
              <code className="text-gray-600">vrin_ent_dv_[32-chars]</code>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Dev + Air-Gap</Badge>
              <code className="text-gray-600">vrin_ent_da_[32-chars]</code>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Dev + Hybrid</Badge>
              <code className="text-gray-600">vrin_ent_dh_[32-chars]</code>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-600">
            Standard (non-enterprise) keys: <code>vrin_live_&lt;32&gt;</code> or <code>vrin_dev_&lt;32&gt;</code>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
