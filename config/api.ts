// API Configuration for VRIN Memory Orchestration Dashboard
export const API_CONFIG = {
  // Base URL for the VRIN Memory Orchestration API
  BASE_URL: 'https://8gj3mzt6cg.execute-api.us-west-1.amazonaws.com/prod',
  
  // API Key for authentication (will be set after user signup)
  API_KEY: '',
  
  // API Endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    KNOWLEDGE_GRAPH: '/api/knowledge-graph',
    INSERT_KNOWLEDGE: '/api/knowledge/insert',
    QUERY_KNOWLEDGE: '/api/knowledge/query',
    QUERY_BASIC: '/api/knowledge/query-basic',
    GET_API_KEYS: '/api/auth/api-keys',
    CREATE_API_KEY: '/api/auth/create-api-key',
    DELETE_API_KEY: '/api/auth/delete-api-key',
    DELETE_ACCOUNT: '/api/auth/delete-account'
  }
};

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