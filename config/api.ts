// API Configuration for VRIN Hybrid RAG Dashboard
export const API_CONFIG = {
  // Authentication API (Production)
  AUTH_BASE_URL: 'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod',
  
  // RAG API (Lambda Function URL - TRUE Streaming with FastAPI + Lambda Web Adapter)
  RAG_BASE_URL: 'https://43tybsfy52ehi3fctubc7jwlpi0fgkcz.lambda-url.us-east-1.on.aws',

  // Chat API (Conversation Management with File Upload)
  CHAT_BASE_URL: 'https://cg7yind3j5.execute-api.us-east-1.amazonaws.com/dev',

  // Conversation History API (Note: Uses /Stage not /dev)
  CONVERSATION_BASE_URL: 'https://rthl3rcg2b.execute-api.us-east-1.amazonaws.com/Stage',

  // Enterprise API (New Backend Infrastructure) - Use the same auth API for now
  ENTERPRISE_BASE_URL: process.env.NEXT_PUBLIC_ENTERPRISE_API_URL || 'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod',
  
  // Legacy support for existing code
  BASE_URL: 'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod',
  API_KEY: '',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH_HEALTH: '/health',
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    CREATE_API_KEY: '/api/auth/create-api-key',
    LIST_API_KEYS: '/api/auth/api-keys',
    DELETE_API_KEY: '/api/auth/delete-api-key',
    DELETE_ACCOUNT: '/api/auth/delete-account',
    
    // RAG endpoints (Optimized Backend v0.3.2)
    RAG_HEALTH: '/health',
    INSERT: '/insert',
    QUERY: '/query', 
    GRAPH: '/graph',
    SPECIALIZE: '/specialize', // NEW: User-defined AI specialization
    
    // Enterprise Portal endpoints (Following FRONTEND_DEVELOPMENT_GUIDE.md)
    ENTERPRISE_ORGANIZATION: '/enterprise/organization',
    ENTERPRISE_USERS: '/enterprise/users',
    ENTERPRISE_API_KEYS: '/enterprise/api-keys',
    ENTERPRISE_CONFIGURATION: '/enterprise/configuration',
    ENTERPRISE_SPECIALIZATION: '/enterprise/specialization',
    ENTERPRISE_VALIDATE_CONFIG: '/enterprise/validate-config',
    
    // Enterprise Infrastructure endpoints (Legacy)
    ENTERPRISE_INFRASTRUCTURE: '/enterprise/infrastructure',
    ENTERPRISE_INFRASTRUCTURE_VALIDATE: '/enterprise/infrastructure/validate',
    ENTERPRISE_INFRASTRUCTURE_TEST_DATABASE: '/enterprise/infrastructure/test/database',
    ENTERPRISE_INFRASTRUCTURE_TEST_VECTOR: '/enterprise/infrastructure/test/vector-store',
    ENTERPRISE_INFRASTRUCTURE_TEST_LLM: '/enterprise/infrastructure/test/llm',
    ENTERPRISE_INFRASTRUCTURE_TEMPLATES: '/enterprise/infrastructure/templates',
    ENTERPRISE_INFRASTRUCTURE_COST_ESTIMATE: '/enterprise/infrastructure/estimate-cost',
    
    // Legacy endpoints for backward compatibility
    HEALTH: '/health',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    KNOWLEDGE_GRAPH: '/graph', // Updated to new endpoint
    INSERT_KNOWLEDGE: '/insert', // Updated to new endpoint
    QUERY_KNOWLEDGE: '/query', // Updated to new endpoint
    QUERY_BASIC: '/query', // Updated to new endpoint
    GET_API_KEYS: '/api/auth/api-keys'
  },
  
  // SDK Configuration (Updated to latest)
  SDK_VERSION: '0.8.0',
  IMPORT_STATEMENT: 'from vrin import VRINClient'
} as const;

// Helper function to get headers with authentication
export const getAuthHeaders = (apiKey?: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey || API_CONFIG.API_KEY}`
});

// Helper function to make authenticated API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}, apiKey?: string) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: getAuthHeaders(apiKey),
    ...options
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
};

// Enterprise API Configuration (Following FRONTEND_DEVELOPMENT_GUIDE.md)
export const ENTERPRISE_API = {
  BASE_URL: process.env.NEXT_PUBLIC_ENTERPRISE_API_URL || 'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod',
  ENDPOINTS: {
    ORGANIZATION: '/enterprise/organization',
    USERS: '/enterprise/users', 
    API_KEYS: '/api/enterprise/api-keys',  // Use local proxy to avoid CORS
    CONFIGURATION: '/api/enterprise/configuration',  // Use local proxy to avoid CORS
    SPECIALIZATION: '/enterprise/specialization',
    VALIDATE_CONFIG: '/api/enterprise/validate-config'  // Use local proxy to avoid CORS
  }
};

export const apiClient = {
  async post(endpoint: string, data: any, headers: any = {}) {
    // Use local API routes for endpoints that start with /api/
    const baseUrl = endpoint.startsWith('/api/') ? '' : ENTERPRISE_API.BASE_URL;
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  async get(endpoint: string, params: any = {}, headers: any = {}) {
    const url = new URL(`${ENTERPRISE_API.BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  async delete(endpoint: string, headers: any = {}) {
    const response = await fetch(`${ENTERPRISE_API.BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
}; 