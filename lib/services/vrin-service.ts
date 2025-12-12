// VRIN Hybrid RAG Service - Connects to optimized v0.3.2 backend with AI Specialization
import { API_CONFIG } from '../../config/api';

export interface VRINInsertResult {
  success: boolean;
  facts_extracted: number;
  chunk_stored: boolean;
  chunk_storage_reason: string;
  storage_details: string;
  storage_optimization: string;
  processing_time: string;
  facts: Array<{
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    expert_validated?: boolean; // NEW: Expert validation flag
  }>;
  storage_result: {
    stored_facts: number;
    updated_facts: number;
    skipped_duplicates: number;
    storage_efficiency: string;
  };
}

export interface ThinkingStep {
  step: string;
  description: string;
  icon: string;
}

export interface ReasoningMetadata {
  model: string;
  reasoning_tokens: number;
  input_tokens: number;  // Renamed from prompt_tokens
  output_tokens: number;  // Renamed from completion_tokens
  total_tokens: number;
  processing_time?: string;  // Processing time in seconds (e.g., "72.4s")
  reasoning_summary?: string;  // GPT-5-mini's actual reasoning process (if available)
  thinking_steps: ThinkingStep[];
}

export interface Source {
  document_name: string;
  upload_id?: string;  // For graph/vector sources
  document_id?: string;  // For personal sources
  source_type: 'graph' | 'vector' | 'personal';
}

export interface VRINQueryResult {
  success: boolean;
  summary: string;
  search_time: string;
  entities_found: string[];
  total_facts: number;
  total_chunks: number;
  combined_results: number;
  query: string;
  // NEW: Expert analysis fields (v0.3.2)
  expert_analysis?: {
    specialization_applied: boolean;
    reasoning_chains_used: number;
    confidence_level: 'low' | 'medium' | 'high';
    analysis_depth: string;
  };
  multi_hop_insights?: Array<{
    insight: string;
    confidence: number;
    supporting_facts: string[];
  }>;
  reasoning_chains?: Array<{
    chain_id: number;
    description: string;
    final_conclusion: string;
    overall_confidence: number;
  }>;
  // NEW: GPT-5-mini Reasoning Model fields (v0.10.0)
  metadata?: ReasoningMetadata;  // Renamed from reasoning_metadata
  sources?: Source[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    user_id: string;
    email: string;
    name?: string;
    created_at: string;
  };
  api_key?: string;
  error?: string;
}

export interface ApiKey {
  api_key: string;
  user_id: string;
  created_at: string;
  last_used?: string;
}

// NEW: Specialization interfaces for v0.3.2
export interface VRINSpecializationRequest {
  custom_prompt: string;
  reasoning_focus?: string[];
  analysis_depth?: 'surface' | 'detailed' | 'expert';
  confidence_threshold?: number;
  max_reasoning_chains?: number;
}

export interface VRINSpecializationResponse {
  success: boolean;
  specialization_id?: string;
  message?: string;
  error?: string;
}

export interface VRINSpecializationInfo {
  success: boolean;
  custom_prompts?: {
    user_specialization: string;
  };
  reasoning_focus?: string[];
  analysis_depth?: string;
  confidence_threshold?: number;
  max_reasoning_chains?: number;
  error?: string;
}

export class VRINService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Insert knowledge with smart deduplication
   */
  async insertKnowledge(
    content: string,
    title?: string,
    tags?: string[]
  ): Promise<VRINInsertResult> {
    try {
      const response = await fetch('/api/rag/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          content,
          title: title || 'Untitled',
          tags: tags || []
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Insert failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Insert knowledge error:', error);
      throw new Error(`Failed to insert knowledge: ${error instanceof Error ? error instanceof Error ? error.message : 'Unknown error' : 'Unknown error'}`);
    }
  }

  /**
   * Query knowledge with hybrid search
   */
  async queryKnowledge(
    query: string,
    includeSummary: boolean = true
  ): Promise<VRINQueryResult> {
    try {
      // Get user_id from localStorage
      const user = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('vrin_user') || '{}')
        : {};
      const user_id = user.user_id;

      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          include_summary: includeSummary,
          user_id  // Required for data isolation
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Query failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Query knowledge error:', error);
      throw new Error(`Failed to query knowledge: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get knowledge graph visualization data
   */
  async getKnowledgeGraph(limit?: number): Promise<any> {
    try {
      // Use optimal backend parameters based on backend team's recommendations
      const params = new URLSearchParams();
      params.append('user_only', 'true'); // Get user-specific data only
      
      if (limit && limit > 0) {
        // For performance optimization - limit nodes/edges returned
        params.append('limit', limit.toString());
      } else {
        // Get complete user graph
        params.append('show_all', 'true');
      }
      
      const queryString = params.toString();
      console.log('🔍 Fetching knowledge graph with params:', queryString);
      
      // Use the local API route which proxies to the RAG backend (handles CORS)
      const response = await fetch(`/api/rag/graph?${queryString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Graph request failed: ${response.status} - ${errorText}`);
      }

      const rawData = await response.json();
      console.log('🔍 Raw graph response:', rawData);
      console.log('📊 Response success:', rawData.success);
      console.log('📊 Response metadata:', rawData.metadata);
      console.log('📊 Raw nodes sample:', rawData.data?.nodes?.slice(0, 2));
      console.log('📊 Raw edges sample:', rawData.data?.edges?.slice(0, 2));
      
      // Check for Neptune connection issues
      if (rawData.metadata?.warning) {
        console.warn('⚠️ Backend warning:', rawData.metadata.warning);
      }

      // Transform backend response to match frontend expectations
      if (rawData.success && rawData.data) {
        // Transform nodes - handle Neptune graph database format
        const transformedNodes = (rawData.data.nodes || []).map((node: any) => {
          const nodeName = node.name || `Entity-${node.id}`;
          return {
            id: node.id,
            name: nodeName,
            label: nodeName,
            type: node.type || 'entity',
            confidence: node.confidence || node.properties?.confidence || 0.8,
            connections: node.connections || 0,
            description: node.properties?.description || node.properties?.content,
            metadata: {
              ...node.properties,
              neptune_label: node.label,
              source: 'neptune_graph',
              timestamp: node.properties?.timestamp || new Date().toISOString(),
              user_id: node.properties?.user_id
            }
          };
        });

        // Transform edges - handle updated Neptune graph database format
        const transformedEdges = (rawData.data.edges || []).map((edge: any) => ({
          id: edge.id,
          from: edge.from, // Backend now consistently uses 'from' 
          to: edge.to,     // Backend now consistently uses 'to'
          label: edge.label || edge.predicate || 'related_to',
          type: edge.type || 'fact',
          confidence: edge.confidence || edge.properties?.confidence || 0.8,
          weight: edge.weight || 1.0,
          metadata: {
            ...edge.properties,
            fact_id: edge.id,
            predicate: edge.label || edge.predicate,
            source: 'neptune_graph',
            timestamp: edge.properties?.timestamp || new Date().toISOString(),
            user_id: edge.properties?.user_id
          }
        }));

        console.log(`✅ Neptune edges processed: ${transformedEdges.length} real relationships`);

        const transformedData = {
          success: true,
          data: {
            nodes: transformedNodes,
            edges: transformedEdges,
            triples: rawData.data.triples || [],
            statistics: {
              nodeCount: transformedNodes.length,
              edgeCount: transformedEdges.length,
              tripleCount: rawData.data.triples?.length || 0,
              density: transformedNodes.length > 1 ? transformedEdges.length / (transformedNodes.length * (transformedNodes.length - 1)) : 0,
              averageConnections: transformedNodes.length > 0 ? transformedEdges.length * 2 / transformedNodes.length : 0,
              clusters: 1, // Default single cluster
              confidence: {
                average: transformedNodes.reduce((acc: number, n: any) => acc + (n.confidence || 0), 0) / Math.max(1, transformedNodes.length),
                min: Math.min(...transformedNodes.map((n: any) => n.confidence || 0), 1),
                max: Math.max(...transformedNodes.map((n: any) => n.confidence || 0), 0),
                distribution: {}
              },
              temporal: {
                recentUpdates: 0,
                conflictedFacts: 0,
                averageFactAge: 0
              },
              domains: {},
              // Include backend metadata
              ...rawData.metadata
            }
          },
          timestamp: new Date(),
          version: '0.3.2'
        };

        console.log('🎯 NEPTUNE GRAPH DATA TRANSFORMED:');
        console.log(`📊 Nodes: ${transformedData.data.nodes.length} entities`);
        console.log(`🔗 Edges: ${transformedData.data.edges.length} relationships`);
        console.log('📝 Sample node:', transformedData.data.nodes[0]);
        console.log('🔗 Sample edge:', transformedData.data.edges[0]);
        console.log('📈 Statistics:', transformedData.data.statistics);
        
        return transformedData;
      }

      // Handle case where backend is successful but no data (Neptune connection issue)
      if (rawData.success && (!rawData.data || (rawData.data.nodes?.length === 0 && rawData.data.edges?.length === 0))) {
        console.warn('📊 Empty knowledge graph data received. This might indicate:');
        console.warn('1. No knowledge has been inserted yet');
        console.warn('2. Neptune connection issues (check backend logs)');
        console.warn('3. User isolation filtering out all data');
        
        // Return empty but properly structured response
        return {
          success: true,
          data: {
            nodes: [],
            edges: [],
            triples: [],
            statistics: {
              nodeCount: 0,
              edgeCount: 0,
              tripleCount: 0,
              density: 0,
              averageConnections: 0,
              clusters: 0,
              confidence: { average: 0, min: 0, max: 0, distribution: {} },
              temporal: { recentUpdates: 0, conflictedFacts: 0, averageFactAge: 0 },
              domains: {}
            }
          },
          error: rawData.metadata?.warning || 'No knowledge graph data available',
          timestamp: new Date(),
          version: '0.3.2'
        };
      }

      return rawData;
    } catch (error) {
      console.error('Get knowledge graph error:', error);
      throw new Error(`Failed to get knowledge graph: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Configure user-defined AI specialization (NEW in v0.3.2)
   */
  async configureSpecialization(
    customPrompt: string,
    reasoningFocus: string[] = ['general_analysis'],
    analysisDepth: 'surface' | 'detailed' | 'expert' = 'expert',
    confidenceThreshold: number = 0.7,
    maxReasoningChains: number = 10
  ): Promise<VRINSpecializationResponse> {
    try {
      const response = await fetch('/api/rag/specialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          custom_prompt: customPrompt,
          reasoning_focus: reasoningFocus,
          analysis_depth: analysisDepth,
          confidence_threshold: confidenceThreshold,
          max_reasoning_chains: maxReasoningChains
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Specialization failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Configure specialization error:', error);
      throw new Error(`Failed to configure specialization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get current user specialization settings
   */
  async getSpecializationInfo(): Promise<VRINSpecializationInfo> {
    try {
      const response = await fetch('/api/rag/specialize', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          return { success: false, error: 'No specialization configured' };
        }
        throw new Error(`Get specialization failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get specialization error:', error);
      throw new Error(`Failed to get specialization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Query with enhanced expert capabilities
   */
  async queryWithRawResults(
    query: string,
    includeSummary: boolean = true,
    includeRawResults: boolean = false
  ): Promise<VRINQueryResult> {
    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          include_summary: includeSummary,
          include_raw_results: includeRawResults
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Expert query failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Expert query error:', error);
      throw new Error(`Failed to query with expert analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export class AuthService {
  private baseUrl = ''; // Use relative URLs for Next.js API routes

  /**
   * User signup with automatic API key generation
   */
  async signup(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      console.log('Making signup request to:', `${this.baseUrl}${API_CONFIG.ENDPOINTS.SIGNUP}`);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      console.log('Signup response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = `HTTP ${response.status}: ${response.statusText}`;
        }
        console.error('Signup failed:', errorText);
        return { success: false, error: errorText };
      }

      const result = await response.json();
      console.log('Signup successful:', result);
      
      // Convert backend response to expected format
      if (result.success && result.api_key) {
        const authResponse: AuthResponse = {
          success: true,
          user: {
            user_id: result.user_id,
            email: result.email,
            name: name || result.name,
            created_at: new Date().toISOString()
          },
          api_key: result.api_key,
          message: result.message
        };
        
        // Store API key in localStorage for frontend use
        localStorage.setItem('vrin_api_key', result.api_key);
        localStorage.setItem('vrin_user', JSON.stringify(authResponse.user));
        
        return authResponse;
      }
      
      return result;
    } catch (error) {
      console.error('Signup network error:', error);
      return { success: false, error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  /**
   * User login with API key retrieval
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Making login request to:', `${this.baseUrl}${API_CONFIG.ENDPOINTS.LOGIN}`);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = `HTTP ${response.status}: ${response.statusText}`;
        }
        console.error('Login failed:', errorText);
        return { success: false, error: errorText };
      }

      const result = await response.json();
      console.log('Login successful:', result);

      // Convert backend response to expected format
      // Backend returns user_id/email either at top level or nested in 'user' object
      if (result.success && result.api_key) {
        const userId = result.user_id || result.user?.user_id;
        const userEmail = result.email || result.user?.email;
        const userName = result.name || result.user?.name;

        const authResponse: AuthResponse = {
          success: true,
          user: {
            user_id: userId,
            email: userEmail,
            name: userName || userEmail?.split('@')[0],
            created_at: new Date().toISOString()
          },
          api_key: result.api_key,
          message: result.message
        };

        // Store API key in localStorage
        localStorage.setItem('vrin_api_key', result.api_key);
        localStorage.setItem('vrin_user', JSON.stringify(authResponse.user));

        return authResponse;
      }

      return result;
    } catch (error) {
      console.error('Login network error:', error);
      return { success: false, error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  /**
   * Get stored API key
   */
  getStoredApiKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('vrin_api_key');
  }

  /**
   * Get stored user data
   */
  getStoredUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('vrin_user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Logout user
   */
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('vrin_api_key');
    localStorage.removeItem('vrin_user');
  }

  /**
   * Create additional API key
   */
  async createApiKey(): Promise<{ success: boolean; api_key?: string; error?: string }> {
    const currentApiKey = this.getStoredApiKey();
    if (!currentApiKey) {
      return { success: false, error: 'No authentication token found' };
    }

    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CREATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentApiKey}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Create API key error:', error);
      return { success: false, error: 'Failed to create API key' };
    }
  }

  /**
   * List all API keys for user
   */
  async listApiKeys(): Promise<{ success: boolean; api_keys?: ApiKey[]; error?: string }> {
    const currentApiKey = this.getStoredApiKey();
    if (!currentApiKey) {
      return { success: false, error: 'No authentication token found' };
    }

    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.LIST_API_KEYS}`, {
        headers: {
          'Authorization': `Bearer ${currentApiKey}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('List API keys error:', error);
      return { success: false, error: 'Failed to list API keys' };
    }
  }
}