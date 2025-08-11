// API Configuration for VRIN Hybrid RAG Dashboard
export const API_CONFIG = {
  // Authentication API (Production)
  AUTH_BASE_URL: 'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod',
  
  // RAG API (Production - Optimized Hybrid RAG v0.3.2 with AI Specialization)
  RAG_BASE_URL: 'https://thuiu23t0c.execute-api.us-east-1.amazonaws.com/dev',
  
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
  SDK_VERSION: '0.3.2',
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