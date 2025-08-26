# Enterprise Dashboard Implementation Guide for VRIN

## Executive Summary

This document provides comprehensive implementation guidance for creating VRIN's Enterprise Dashboard - a separate, dedicated interface for enterprise clients to configure, deploy, and manage their private VRIN infrastructure. This dashboard will be built alongside the existing general user dashboard at app.vrin.ai.

## Current Architecture Understanding

### Existing Dashboard Stack
- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with custom animations (Framer Motion, GSAP)
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: Custom auth service with JWT tokens stored locally
- **API Communication**: Proxy routes through Next.js API routes to AWS Lambda backends
- **Domain**: app.vrin.ai (general users)

### Current API Architecture
- **Auth API**: `https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod`
- **RAG API**: `https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev`
- **Authentication**: Bearer tokens with `vrin_` prefix for general users
- **SDK Version**: v0.3.2 (Python package on PyPI)

## Enterprise Dashboard Requirements

### Core Differentiators from General Dashboard
1. **Separate Subdomain**: enterprise.vrin.ai
2. **Enterprise Authentication**: Support for SSO (SAML/OIDC)
3. **Infrastructure Configuration**: Visual builders for cloud resources
4. **Deployment Automation**: One-click infrastructure provisioning
5. **Compliance Management**: HIPAA, SOX, GDPR configuration
6. **Multi-cloud Support**: AWS, Azure, GCP, on-premise

## Implementation Architecture

### 1. Project Structure

Create a new Next.js project parallel to the existing vrin dashboard:

```
vrin-enterprise/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Enterprise login with SSO
│   │   ├── sso/
│   │   │   └── callback/
│   │   │       └── page.tsx      # SSO callback handler
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── onboarding/
│   │   │   ├── page.tsx          # Step-by-step wizard
│   │   │   └── components/
│   │   │       ├── OrganizationStep.tsx
│   │   │       ├── DeploymentModelStep.tsx
│   │   │       ├── CloudProviderStep.tsx
│   │   │       ├── DatabaseConfigStep.tsx
│   │   │       ├── NetworkConfigStep.tsx
│   │   │       ├── ComplianceStep.tsx
│   │   │       └── ValidationStep.tsx
│   │   ├── configuration/
│   │   │   ├── page.tsx          # Main config center
│   │   │   └── [configId]/
│   │   │       └── page.tsx      # Edit specific config
│   │   ├── deployment/
│   │   │   ├── page.tsx          # Deployment manager
│   │   │   └── [deploymentId]/
│   │   │       └── page.tsx      # Monitor deployment
│   │   ├── api-keys/
│   │   │   └── page.tsx          # Enterprise API key management
│   │   ├── compliance/
│   │   │   └── page.tsx          # Compliance center
│   │   ├── monitoring/
│   │   │   └── page.tsx          # Infrastructure monitoring
│   │   ├── billing/
│   │   │   └── page.tsx          # Usage and billing
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── enterprise-login/
│   │   │   │   └── route.ts
│   │   │   ├── sso/
│   │   │   │   ├── saml/
│   │   │   │   │   └── route.ts
│   │   │   │   └── oidc/
│   │   │   │       └── route.ts
│   │   │   └── enterprise-keys/
│   │   │       └── route.ts
│   │   ├── config/
│   │   │   ├── validate/
│   │   │   │   └── route.ts
│   │   │   ├── save/
│   │   │   │   └── route.ts
│   │   │   └── templates/
│   │   │       └── route.ts
│   │   ├── deployment/
│   │   │   ├── generate-template/
│   │   │   │   └── route.ts
│   │   │   ├── deploy/
│   │   │   │   └── route.ts
│   │   │   └── status/
│   │   │       └── route.ts
│   │   └── monitoring/
│   │       └── health/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx                   # Enterprise landing page
├── components/
│   ├── enterprise/
│   │   ├── config-builder/
│   │   │   ├── AWSConfigBuilder.tsx
│   │   │   ├── AzureConfigBuilder.tsx
│   │   │   ├── GCPConfigBuilder.tsx
│   │   │   └── OnPremiseConfigBuilder.tsx
│   │   ├── deployment/
│   │   │   ├── DeploymentWizard.tsx
│   │   │   ├── DeploymentProgress.tsx
│   │   │   └── DeploymentValidation.tsx
│   │   ├── compliance/
│   │   │   ├── ComplianceSelector.tsx
│   │   │   ├── AuditTrail.tsx
│   │   │   └── ComplianceReports.tsx
│   │   └── monitoring/
│   │       ├── InfrastructureHealth.tsx
│   │       ├── UsageMetrics.tsx
│   │       └── CostAnalytics.tsx
│   ├── ui/                       # Reuse from main dashboard
│   └── providers/
│       └── EnterpriseProvider.tsx
├── lib/
│   ├── services/
│   │   ├── enterprise-auth.ts
│   │   ├── config-service.ts
│   │   ├── deployment-service.ts
│   │   └── monitoring-service.ts
│   ├── validators/
│   │   ├── aws-config.ts
│   │   ├── azure-config.ts
│   │   └── network-config.ts
│   └── utils/
│       ├── template-generator.ts
│       └── cost-calculator.ts
├── hooks/
│   ├── use-enterprise-auth.ts
│   ├── use-deployment.ts
│   └── use-config-builder.ts
├── types/
│   ├── enterprise.ts
│   ├── deployment.ts
│   └── compliance.ts
└── styles/
    └── enterprise.css
```

### 2. Key Components Implementation

#### A. Enterprise Authentication Service

```typescript
// lib/services/enterprise-auth.ts
export class EnterpriseAuthService {
  private baseUrl = process.env.NEXT_PUBLIC_ENTERPRISE_API_URL;
  
  async loginWithSSO(provider: 'saml' | 'oidc', config: SSOConfig) {
    // Initiate SSO flow
    const response = await fetch(`${this.baseUrl}/auth/sso/${provider}`, {
      method: 'POST',
      body: JSON.stringify(config)
    });
    return response.json();
  }
  
  async generateEnterpriseApiKey(orgId: string, config: EnterpriseConfig) {
    // Generate enterprise API key with proper prefix
    const prefix = this.determineKeyPrefix(config.deploymentMode);
    // vrin_ent_airgap_ | vrin_ent_vpc_ | vrin_ent_hybrid_
    
    const response = await fetch(`${this.baseUrl}/auth/enterprise-keys`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        organization_id: orgId,
        deployment_mode: config.deploymentMode,
        infrastructure: config.infrastructure
      })
    });
    return response.json();
  }
  
  private determineKeyPrefix(mode: DeploymentMode): string {
    switch(mode) {
      case 'air_gapped': return 'vrin_ent_airgap_';
      case 'vpc_isolated': return 'vrin_ent_vpc_';
      case 'hybrid_explicit': return 'vrin_ent_hybrid_';
      default: throw new Error('Invalid deployment mode');
    }
  }
}
```

#### B. Configuration Builder Component

```typescript
// components/enterprise/config-builder/AWSConfigBuilder.tsx
import { useState } from 'react';
import { Card, Input, Select, Button } from '@/components/ui';

export function AWSConfigBuilder({ onComplete }: { onComplete: (config: AWSConfig) => void }) {
  const [config, setConfig] = useState<AWSConfig>({
    provider: 'aws',
    region: 'us-east-1',
    neptune: {
      endpoint: '',
      port: 8182,
      instanceType: 'db.r5.large'
    },
    opensearch: {
      endpoint: '',
      instanceType: 't3.medium.search'
    },
    vpc: {
      vpcId: '',
      subnetIds: [],
      securityGroups: []
    }
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const validateNeptuneEndpoint = (endpoint: string): boolean => {
    const pattern = /^[a-z0-9-]+\.cluster-[a-z0-9]+\.[a-z0-9-]+\.neptune\.amazonaws\.com$/;
    return pattern.test(endpoint);
  };
  
  const handleValidate = async () => {
    const errors: Record<string, string> = {};
    
    if (!validateNeptuneEndpoint(config.neptune.endpoint)) {
      errors.neptune = 'Invalid Neptune endpoint format';
    }
    
    if (!config.vpc.vpcId.startsWith('vpc-')) {
      errors.vpc = 'VPC ID must start with vpc-';
    }
    
    if (Object.keys(errors).length === 0) {
      // Test connectivity
      const response = await fetch('/api/config/validate', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      
      if (response.ok) {
        onComplete(config);
      } else {
        const data = await response.json();
        setValidationErrors(data.errors);
      }
    } else {
      setValidationErrors(errors);
    }
  };
  
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">AWS Infrastructure Configuration</h3>
        
        {/* Neptune Configuration */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Neptune Cluster Endpoint
            </label>
            <Input
              value={config.neptune.endpoint}
              onChange={(e) => setConfig({
                ...config,
                neptune: { ...config.neptune, endpoint: e.target.value }
              })}
              placeholder="your-neptune.cluster-xxx.us-east-1.neptune.amazonaws.com"
              className={validationErrors.neptune ? 'border-red-500' : ''}
            />
            {validationErrors.neptune && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.neptune}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Enter your private Neptune cluster endpoint
            </p>
          </div>
          
          {/* OpenSearch Configuration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              OpenSearch Domain Endpoint
            </label>
            <Input
              value={config.opensearch.endpoint}
              onChange={(e) => setConfig({
                ...config,
                opensearch: { ...config.opensearch, endpoint: e.target.value }
              })}
              placeholder="your-domain.us-east-1.es.amazonaws.com"
            />
          </div>
          
          {/* VPC Configuration */}
          <div>
            <label className="block text-sm font-medium mb-2">VPC ID</label>
            <Input
              value={config.vpc.vpcId}
              onChange={(e) => setConfig({
                ...config,
                vpc: { ...config.vpc, vpcId: e.target.value }
              })}
              placeholder="vpc-0123456789abcdef"
              className={validationErrors.vpc ? 'border-red-500' : ''}
            />
            {validationErrors.vpc && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.vpc}</p>
            )}
          </div>
          
          {/* Subnet Configuration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Private Subnet IDs (comma-separated)
            </label>
            <Input
              value={config.vpc.subnetIds.join(', ')}
              onChange={(e) => setConfig({
                ...config,
                vpc: {
                  ...config.vpc,
                  subnetIds: e.target.value.split(',').map(s => s.trim())
                }
              })}
              placeholder="subnet-abc123, subnet-def456"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button onClick={handleValidate} className="bg-gradient-to-r from-blue-500 to-purple-600">
          Validate & Continue
        </Button>
      </div>
    </Card>
  );
}
```

#### C. Deployment Wizard

```typescript
// components/enterprise/deployment/DeploymentWizard.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DeploymentWizard({ config }: { config: EnterpriseConfig }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<DeploymentStatus>('idle');
  
  const steps = [
    { id: 'validate', label: 'Validate Configuration' },
    { id: 'generate', label: 'Generate Templates' },
    { id: 'review', label: 'Review & Approve' },
    { id: 'deploy', label: 'Deploy Infrastructure' },
    { id: 'verify', label: 'Verify Deployment' }
  ];
  
  const startDeployment = async () => {
    setStatus('deploying');
    
    try {
      // 1. Generate CloudFormation/ARM template
      const templateResponse = await fetch('/api/deployment/generate-template', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      const { template, deploymentId } = await templateResponse.json();
      setDeploymentId(deploymentId);
      
      // 2. Deploy to customer's account
      const deployResponse = await fetch('/api/deployment/deploy', {
        method: 'POST',
        body: JSON.stringify({
          deploymentId,
          template,
          credentials: config.cloudCredentials
        })
      });
      
      // 3. Monitor deployment
      const pollStatus = setInterval(async () => {
        const statusResponse = await fetch(`/api/deployment/status/${deploymentId}`);
        const { status, progress } = await statusResponse.json();
        
        if (status === 'completed') {
          clearInterval(pollStatus);
          setStatus('completed');
          setCurrentStep(4);
        } else if (status === 'failed') {
          clearInterval(pollStatus);
          setStatus('failed');
        }
      }, 5000);
      
    } catch (error) {
      setStatus('failed');
      console.error('Deployment failed:', error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'}
              `}>
                {index + 1}
              </div>
              <span className="ml-2 hidden md:inline">{step.label}</span>
              {index < steps.length - 1 && (
                <div className={`
                  w-full h-1 mx-4
                  ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {currentStep === 0 && <ValidationStep config={config} onNext={() => setCurrentStep(1)} />}
          {currentStep === 1 && <TemplateGenerationStep config={config} onNext={() => setCurrentStep(2)} />}
          {currentStep === 2 && <ReviewStep config={config} onDeploy={startDeployment} />}
          {currentStep === 3 && <DeploymentProgress deploymentId={deploymentId} status={status} />}
          {currentStep === 4 && <VerificationStep deploymentId={deploymentId} config={config} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

### 3. Backend Lambda Functions

Create new Lambda functions for enterprise operations:

```python
# lambda/enterprise_config_validator.py
import json
import boto3
from typing import Dict, Any, List

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Validate enterprise configuration before deployment"""
    
    body = json.loads(event['body'])
    config = body['config']
    
    validation_results = {
        'valid': True,
        'errors': [],
        'warnings': []
    }
    
    # Validate Neptune endpoint
    if config['provider'] == 'aws':
        if not validate_neptune_endpoint(config['neptune']['endpoint']):
            validation_results['errors'].append({
                'field': 'neptune.endpoint',
                'message': 'Invalid Neptune endpoint format'
            })
            validation_results['valid'] = False
        
        # Test Neptune connectivity
        if not test_neptune_connection(config['neptune']):
            validation_results['warnings'].append({
                'field': 'neptune',
                'message': 'Unable to connect to Neptune cluster'
            })
    
    # Validate network configuration
    if config.get('vpc'):
        vpc_validation = validate_vpc_config(config['vpc'])
        if not vpc_validation['valid']:
            validation_results['errors'].extend(vpc_validation['errors'])
            validation_results['valid'] = False
    
    return {
        'statusCode': 200 if validation_results['valid'] else 400,
        'body': json.dumps(validation_results)
    }

def validate_neptune_endpoint(endpoint: str) -> bool:
    """Validate Neptune endpoint format"""
    import re
    pattern = r'^[a-z0-9-]+\.cluster-[a-z0-9]+\.[a-z0-9-]+\.neptune\.amazonaws\.com$'
    return bool(re.match(pattern, endpoint))

def test_neptune_connection(neptune_config: Dict[str, Any]) -> bool:
    """Test connection to Neptune cluster"""
    try:
        from gremlin_python.driver import client
        g = client.Client(
            f"wss://{neptune_config['endpoint']}:{neptune_config['port']}/gremlin",
            'g'
        )
        g.submit("g.V().limit(1)").all().result()
        return True
    except Exception:
        return False

def validate_vpc_config(vpc_config: Dict[str, Any]) -> Dict[str, Any]:
    """Validate VPC configuration"""
    ec2 = boto3.client('ec2')
    results = {'valid': True, 'errors': []}
    
    # Validate VPC exists
    try:
        ec2.describe_vpcs(VpcIds=[vpc_config['vpcId']])
    except Exception:
        results['errors'].append({
            'field': 'vpc.vpcId',
            'message': f"VPC {vpc_config['vpcId']} not found"
        })
        results['valid'] = False
    
    # Validate subnets
    if vpc_config.get('subnetIds'):
        try:
            ec2.describe_subnets(SubnetIds=vpc_config['subnetIds'])
        except Exception as e:
            results['errors'].append({
                'field': 'vpc.subnetIds',
                'message': 'One or more subnets not found'
            })
            results['valid'] = False
    
    return results
```

### 4. Database Schema for Enterprise Configuration

```typescript
// DynamoDB schema for enterprise configurations
interface EnterpriseConfiguration {
  organizationId: string;           // Partition key
  configVersion: string;            // Sort key (v1.0.0, v1.0.1, etc.)
  organizationName: string;
  deploymentMode: 'air_gapped' | 'vpc_isolated' | 'hybrid_explicit';
  provider: 'aws' | 'azure' | 'gcp' | 'on_premise';
  infrastructure: {
    database: {
      type: 'neptune' | 'cosmos_db' | 'janusgraph';
      endpoint: string;
      port: number;
      auth: 'iam_role' | 'credentials' | 'certificate';
    };
    vectorStore: {
      type: 'opensearch' | 'elasticsearch' | 'pinecone';
      endpoint: string;
      auth: string;
    };
    llm: {
      provider: 'openai' | 'azure_openai' | 'bedrock' | 'vertex_ai';
      endpoint?: string;
      model: string;
      apiKeyLocation: 'secrets_manager' | 'key_vault' | 'env_var';
    };
  };
  network: {
    vpcId?: string;
    subnetIds?: string[];
    securityGroups?: string[];
    privateLink?: boolean;
    vpnConnection?: boolean;
    directConnect?: boolean;
  };
  compliance: {
    frameworks: ('HIPAA' | 'SOX' | 'GDPR' | 'PCI_DSS')[];
    dataResidency: string;
    encryption: {
      atRest: 'aws_kms' | 'azure_key_vault' | 'customer_managed';
      inTransit: 'tls_1_2' | 'tls_1_3';
    };
    auditLogging: boolean;
  };
  apiKeys: string[];                // Enterprise API keys
  deployments: {
    deploymentId: string;
    status: 'pending' | 'deploying' | 'completed' | 'failed';
    timestamp: string;
    template: string;                // CloudFormation/ARM template used
  }[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'validated' | 'active' | 'suspended';
}
```

### 5. API Routes Implementation

```typescript
// app/api/deployment/generate-template/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateCloudFormationTemplate } from '@/lib/utils/template-generator';

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    
    let template: string;
    
    switch (config.provider) {
      case 'aws':
        template = generateCloudFormationTemplate(config);
        break;
      case 'azure':
        template = generateARMTemplate(config);
        break;
      case 'gcp':
        template = generateTerraformTemplate(config);
        break;
      default:
        throw new Error('Unsupported provider');
    }
    
    // Save deployment record
    const deploymentId = crypto.randomUUID();
    await saveDeploymentRecord({
      deploymentId,
      organizationId: config.organizationId,
      template,
      status: 'pending'
    });
    
    return NextResponse.json({
      success: true,
      deploymentId,
      template
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 6. Environment Variables

```env
# .env.local for enterprise dashboard
NEXT_PUBLIC_ENTERPRISE_API_URL=https://enterprise-api.vrin.ai
NEXT_PUBLIC_ENTERPRISE_DOMAIN=enterprise.vrin.ai

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Enterprise API Gateway
ENTERPRISE_API_GATEWAY_ID=xyz123abc
ENTERPRISE_API_STAGE=prod

# DynamoDB Tables
ENTERPRISE_CONFIG_TABLE=vrin-enterprise-configurations
ENTERPRISE_DEPLOYMENTS_TABLE=vrin-enterprise-deployments

# Cognito for Enterprise SSO
COGNITO_USER_POOL_ID=us-east-1_ABC123
COGNITO_CLIENT_ID=1234567890abcdef
COGNITO_DOMAIN=vrin-enterprise

# Secrets Manager
ENTERPRISE_SECRETS_PREFIX=vrin/enterprise/

# CloudFormation/Deployment
CLOUDFORMATION_ROLE_ARN=arn:aws:iam::123456789012:role/VRINEnterpriseDeployment
DEPLOYMENT_BUCKET=vrin-enterprise-templates

# Monitoring
CLOUDWATCH_NAMESPACE=VRIN/Enterprise
```

### 7. Deployment Strategy

#### A. Infrastructure Setup

```yaml
# infrastructure/enterprise-dashboard-stack.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  EnterpriseDashboard:
    Type: AWS::Amplify::App
    Properties:
      Name: vrin-enterprise-dashboard
      Repository: https://github.com/vrin/enterprise-dashboard
      OauthToken: !Ref GithubToken
      CustomDomain:
        - DomainName: enterprise.vrin.ai
          SubDomainSettings:
            - Prefix: ''
              BranchName: main
      
  EnterpriseAPI:
    Type: AWS::ApiGateway::RestApi
    Properties:
      Name: vrin-enterprise-api
      EndpointConfiguration:
        Types:
          - REGIONAL
      
  EnterpriseConfigTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: vrin-enterprise-configurations
      AttributeDefinitions:
        - AttributeName: organizationId
          AttributeType: S
        - AttributeName: configVersion
          AttributeType: S
      KeySchema:
        - AttributeName: organizationId
          KeyType: HASH
        - AttributeName: configVersion
          KeyType: RANGE
      BillingMode: PAY_PER_REQUEST
      
  EnterpriseCognito:
    Type: AWS::Cognito::UserPool
    Properties:
      UserPoolName: vrin-enterprise-users
      Schema:
        - Name: email
          AttributeDataType: String
          Required: true
        - Name: organization
          AttributeDataType: String
      MfaConfiguration: OPTIONAL
```

#### B. CI/CD Pipeline

```yaml
# .github/workflows/enterprise-deploy.yml
name: Deploy Enterprise Dashboard

on:
  push:
    branches: [main]
    paths:
      - 'vrin-enterprise/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd vrin-enterprise
          npm ci
          
      - name: Run tests
        run: |
          cd vrin-enterprise
          npm test
          
      - name: Build application
        run: |
          cd vrin-enterprise
          npm run build
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./vrin-enterprise
          
      - name: Deploy Lambda functions
        run: |
          cd vrin-enterprise/lambda
          sam build
          sam deploy --no-confirm-changeset
```

### 8. Testing Strategy

```typescript
// __tests__/enterprise/config-validator.test.ts
import { validateAWSConfig } from '@/lib/validators/aws-config';

describe('AWS Configuration Validator', () => {
  it('should validate Neptune endpoint format', () => {
    const validEndpoint = 'my-cluster.cluster-abc123.us-east-1.neptune.amazonaws.com';
    const invalidEndpoint = 'not-a-valid-endpoint';
    
    expect(validateAWSConfig({ neptune: { endpoint: validEndpoint }})).toBe(true);
    expect(validateAWSConfig({ neptune: { endpoint: invalidEndpoint }})).toBe(false);
  });
  
  it('should validate VPC configuration', () => {
    const validVPC = {
      vpcId: 'vpc-0123456789abcdef',
      subnetIds: ['subnet-abc123', 'subnet-def456'],
      securityGroups: ['sg-123456']
    };
    
    expect(validateAWSConfig({ vpc: validVPC })).toBe(true);
  });
});
```

### 9. Monitoring & Analytics

```typescript
// lib/monitoring/enterprise-metrics.ts
export class EnterpriseMetrics {
  async trackDeployment(organizationId: string, deploymentId: string, status: string) {
    await cloudwatch.putMetricData({
      Namespace: 'VRIN/Enterprise',
      MetricData: [{
        MetricName: 'DeploymentStatus',
        Value: status === 'completed' ? 1 : 0,
        Unit: 'Count',
        Dimensions: [
          { Name: 'OrganizationId', Value: organizationId },
          { Name: 'DeploymentId', Value: deploymentId }
        ]
      }]
    }).promise();
  }
  
  async trackApiKeyGeneration(organizationId: string, keyType: string) {
    // Track API key generation for billing
  }
}
```

### 10. Security Considerations

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verify enterprise authentication
  const token = request.cookies.get('enterprise-token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000');
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
};
```

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)
- Set up new Next.js project structure
- Implement enterprise authentication with SSO
- Create basic dashboard layout and navigation
- Set up DynamoDB tables and Lambda functions

### Phase 2: Configuration Builder (Week 3-4)
- Build visual configuration builders for each cloud provider
- Implement configuration validation logic
- Create template generation system
- Add configuration persistence

### Phase 3: Deployment Automation (Week 5-6)
- Implement one-click deployment wizard
- Create deployment monitoring system
- Add rollback capabilities
- Build health check monitoring

### Phase 4: Advanced Features (Week 7-8)
- Add compliance management center
- Implement cost calculator
- Create usage analytics dashboard
- Add audit trail and reporting

### Phase 5: Testing & Launch (Week 9-10)
- Comprehensive testing with mock deployments
- Security audit and penetration testing
- Documentation and tutorials
- Soft launch with select enterprise clients

## Success Metrics

1. **Time to First Deployment**: < 30 minutes from signup
2. **Configuration Success Rate**: > 95% valid on first attempt
3. **Deployment Success Rate**: > 90% successful deployments
4. **User Satisfaction**: > 4.5/5 enterprise client rating
5. **Support Ticket Reduction**: 50% fewer configuration-related tickets

## Conclusion

This enterprise dashboard will provide a professional, streamlined experience for enterprise clients to configure and deploy their private VRIN infrastructure. By separating it from the general user dashboard, we can optimize each interface for its specific audience while maintaining code reusability where appropriate.

The key differentiators are:
- Visual configuration builders with real-time validation
- One-click deployment automation
- Enterprise-grade authentication with SSO
- Compliance-focused features
- Multi-cloud support with provider-specific optimizations

This implementation guide provides the complete blueprint for building VRIN's enterprise dashboard, ensuring enterprise clients can easily adopt VRIN while maintaining their strict security and compliance requirements.