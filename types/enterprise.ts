// Enterprise Dashboard Types

export type DeploymentMode = 'air_gapped' | 'vpc_isolated' | 'hybrid_explicit';
export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'on_premise';
export type DeploymentStatus = 'idle' | 'pending' | 'deploying' | 'completed' | 'failed' | 'validating';
export type ConfigurationStatus = 'draft' | 'validated' | 'active' | 'suspended';
export type ComplianceFramework = 'HIPAA' | 'SOX' | 'GDPR' | 'PCI_DSS';

export interface Organization {
  id: string;
  name: string;
  domain: string;
  contactEmail: string;
  industry: string;
  size: 'startup' | 'sme' | 'enterprise' | 'government';
  complianceRequirements: ComplianceFramework[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SSOConfig {
  type: 'saml' | 'oidc';
  entityId?: string;
  ssoUrl?: string;
  certificateFingerprint?: string;
  issuer?: string;
  clientId?: string;
  clientSecret?: string;
  discoveryUrl?: string;
}

export interface DatabaseConfig {
  type: 'neptune' | 'cosmos_db' | 'janusgraph';
  endpoint: string;
  port: number;
  auth: 'iam_role' | 'credentials' | 'certificate';
  credentials?: {
    username?: string;
    password?: string;
    certificatePath?: string;
  };
  ssl: boolean;
  backup: {
    enabled: boolean;
    schedule?: string;
    retention?: number;
  };
}

export interface VectorStoreConfig {
  type: 'opensearch' | 'elasticsearch' | 'pinecone';
  endpoint: string;
  auth: string;
  index: string;
  dimensions: number;
  settings?: {
    shards?: number;
    replicas?: number;
    refreshInterval?: string;
  };
}

export interface LLMConfig {
  provider: 'openai' | 'azure_openai' | 'bedrock' | 'vertex_ai';
  endpoint?: string;
  model: string;
  apiKeyLocation: 'secrets_manager' | 'key_vault' | 'env_var';
  maxTokens?: number;
  temperature?: number;
  backup?: {
    enabled: boolean;
    fallbackProvider?: string;
    fallbackModel?: string;
  };
}

export interface NetworkConfig {
  vpcId?: string;
  subnetIds?: string[];
  securityGroups?: string[];
  privateLink?: boolean;
  vpnConnection?: boolean;
  directConnect?: boolean;
  allowedIpRanges?: string[];
  dnsConfig?: {
    customDomain?: string;
    certificateArn?: string;
    route53ZoneId?: string;
  };
}

export interface ComplianceConfig {
  frameworks: ComplianceFramework[];
  dataResidency: string;
  encryption: {
    atRest: 'aws_kms' | 'azure_key_vault' | 'customer_managed';
    inTransit: 'tls_1_2' | 'tls_1_3';
    keyRotation: boolean;
    keyRotationSchedule?: string;
  };
  auditLogging: boolean;
  logRetention: number; // days
  accessControls: {
    mfa: boolean;
    ipWhitelist: string[];
    sessionTimeout: number; // minutes
  };
  dataClassification: {
    enabled: boolean;
    levels: string[];
    autoClassification: boolean;
  };
}

export interface MonitoringConfig {
  enabled: boolean;
  alerting: {
    email: string[];
    slack?: {
      webhook: string;
      channel: string;
    };
    pagerDuty?: {
      integrationKey: string;
    };
  };
  metrics: {
    retention: number; // days
    customMetrics: boolean;
  };
  healthChecks: {
    interval: number; // minutes
    timeout: number; // seconds
    endpoints: string[];
  };
}

export interface InfrastructureConfig {
  database: DatabaseConfig;
  vectorStore: VectorStoreConfig;
  llm: LLMConfig;
  monitoring?: MonitoringConfig;
}

export interface EnterpriseConfiguration {
  organizationId: string;
  configVersion: string;
  organizationName: string;
  deploymentMode: DeploymentMode;
  provider: CloudProvider;
  infrastructure: InfrastructureConfig;
  network: NetworkConfig;
  compliance: ComplianceConfig;
  apiKeys: string[];
  deployments: Deployment[];
  createdAt: Date;
  updatedAt: Date;
  status: ConfigurationStatus;
  estimatedCost?: {
    monthly: number;
    yearly: number;
    currency: string;
    breakdown: CostBreakdown[];
  };
}

export interface CostBreakdown {
  service: string;
  monthlyCost: number;
  unit: string;
  quantity: number;
  description: string;
}

export interface Deployment {
  id: string;
  organizationId: string;
  configVersion: string;
  status: DeploymentStatus;
  timestamp: Date;
  completedAt?: Date;
  template: string;
  templateType: 'cloudformation' | 'arm' | 'terraform';
  progress: {
    totalSteps: number;
    completedSteps: number;
    currentStep: string;
    stepDetails: DeploymentStep[];
  };
  resources: DeployedResource[];
  logs: DeploymentLog[];
  error?: string;
  estimatedDuration?: number; // minutes
  actualDuration?: number; // minutes
}

export interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number; // seconds
  description: string;
  dependencies?: string[];
  resources?: string[];
  logs?: string[];
}

export interface DeployedResource {
  id: string;
  type: string;
  name: string;
  status: 'creating' | 'active' | 'updating' | 'deleting' | 'failed';
  arn?: string;
  endpoint?: string;
  properties: Record<string, any>;
  cost?: {
    hourly: number;
    monthly: number;
  };
  healthStatus?: 'healthy' | 'unhealthy' | 'unknown';
  lastHealthCheck?: Date;
}

export interface DeploymentLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  step?: string;
  resource?: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code?: string;
  suggestions?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  estimatedDeploymentTime?: number; // minutes
  costImpact?: {
    change: 'increase' | 'decrease' | 'no_change';
    amount: number;
    percentage: number;
  };
}

// Enterprise API Types
export interface EnterpriseApiKey {
  id: string;
  organizationId: string;
  keyPrefix: string;
  name: string;
  environment: 'development' | 'staging' | 'production';
  permissions: string[];
  deploymentId?: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  usage: {
    requestsThisMonth: number;
    lastUsed?: Date;
    topEndpoints: Array<{
      endpoint: string;
      count: number;
    }>;
  };
  createdAt: Date;
  expiresAt?: Date;
  lastRotated?: Date;
  status: 'active' | 'suspended' | 'expired';
}

export interface EnterpriseUser {
  id: string;
  organizationId: string;
  organizationName?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'developer' | 'viewer';
  permissions: string[];
  ssoEnabled: boolean;
  lastLogin?: Date;
  mfaEnabled: boolean;
  status: 'active' | 'suspended' | 'invited';
  createdAt: Date;
  updatedAt: Date;
}

// Template Generation Types
export interface TemplateGenerationRequest {
  config: EnterpriseConfiguration;
  options: {
    includeMonitoring: boolean;
    includeBackup: boolean;
    includeCDN: boolean;
    environment: 'development' | 'staging' | 'production';
    optimizeForCost: boolean;
    optimizeForPerformance: boolean;
  };
}

export interface GeneratedTemplate {
  type: 'cloudformation' | 'arm' | 'terraform';
  content: string;
  parameters: TemplateParameter[];
  outputs: TemplateOutput[];
  estimatedCost: number;
  deploymentTime: number; // minutes
  validation: {
    syntax: boolean;
    bestPractices: boolean;
    security: boolean;
    warnings: string[];
  };
}

export interface TemplateParameter {
  name: string;
  type: string;
  description: string;
  defaultValue?: any;
  required: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    allowedValues?: any[];
  };
}

export interface TemplateOutput {
  name: string;
  description: string;
  value: string;
  export?: {
    name: string;
    description: string;
  };
}

// Monitoring and Analytics Types
export interface UsageMetrics {
  organizationId: string;
  period: {
    start: Date;
    end: Date;
  };
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageLatency: number;
    p95Latency: number;
    p99Latency: number;
  };
  storage: {
    totalFacts: number;
    totalNodes: number;
    totalEdges: number;
    storageUsed: number; // GB
  };
  costs: {
    total: number;
    breakdown: CostBreakdown[];
    projectedMonthly: number;
  };
  performance: {
    queryLatency: number[];
    insertLatency: number[];
    errorRate: number;
    uptime: number; // percentage
  };
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  threshold: {
    value: number;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    duration: number; // minutes
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: Array<{
    type: 'email' | 'slack' | 'pagerduty' | 'webhook';
    target: string;
  }>;
  enabled: boolean;
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceReport {
  organizationId: string;
  framework: ComplianceFramework;
  reportDate: Date;
  period: {
    start: Date;
    end: Date;
  };
  status: 'compliant' | 'non_compliant' | 'partially_compliant';
  score: number; // 0-100
  requirements: Array<{
    id: string;
    name: string;
    description: string;
    status: 'met' | 'not_met' | 'partially_met' | 'not_applicable';
    evidence: string[];
    lastAudited: Date;
    nextAuditDue?: Date;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    requirement: string;
    description: string;
    actionItems: string[];
    estimatedEffort: string;
  }>;
  auditTrail: Array<{
    timestamp: Date;
    action: string;
    user: string;
    details: string;
  }>;
}