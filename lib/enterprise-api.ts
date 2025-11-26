import { apiClient, ENTERPRISE_API } from '@/config/api';
import { 
  Organization, 
  EnterpriseUser, 
  EnterpriseApiKey, 
  EnterpriseConfiguration,
  ValidationResult 
} from '@/types/enterprise';

export class EnterpriseAPIService {
  
  // Helper method to get authentication headers
  private static getAuthHeaders(): any {
    let authToken = null
    if (typeof window !== 'undefined') {
      authToken = localStorage.getItem('enterprise_token')

      // Validate token format - enterprise session tokens should be base64 (typically start with 'eyJ')
      // NOT API keys (which start with 'vrin_')
      if (authToken && authToken.startsWith('vrin_')) {
        console.warn('[Enterprise API] Invalid token format detected - clearing stale API key from enterprise_token')
        console.warn('[Enterprise API] Please log in again to get a fresh session token')
        localStorage.removeItem('enterprise_token')
        authToken = null
      }
    }

    if (!authToken) {
      console.warn('[Enterprise API] No enterprise_token found - user may need to log in')
    }

    return authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
  }
  
  // Organization Management
  static async createOrganization(orgData: {
    name: string;
    domain: string;
    contact_email: string;
    industry: string;
    size: string;
    compliance_requirements?: string[];
  }) {
    const authHeaders = this.getAuthHeaders();
    return apiClient.post(ENTERPRISE_API.ENDPOINTS.ORGANIZATION, orgData, authHeaders);
  }

  static async getOrganization(organizationId: string) {
    const authHeaders = this.getAuthHeaders();
    return apiClient.get(ENTERPRISE_API.ENDPOINTS.ORGANIZATION, { 
      organization_id: organizationId 
    }, authHeaders);
  }

  // User Management
  static async createUser(userData: {
    organization_id: string;
    email: string;
    first_name: string;
    last_name: string;
    role?: string;
    permissions?: string[];
  }) {
    return apiClient.post(ENTERPRISE_API.ENDPOINTS.USERS, userData);
  }

  static async listUsers(organizationId: string) {
    return apiClient.get(ENTERPRISE_API.ENDPOINTS.USERS, {
      organization_id: organizationId
    });
  }

  // API Key Management  
  static async generateApiKey(keyData: {
    organization_id: string;
    user_id?: string;
    name: string;
    environment?: string;
    permissions?: string[];
    rate_limits?: any;
    deployment_mode?: string;
    description?: string;
    expires_in_days?: number;
  }) {
    const authHeaders = this.getAuthHeaders();
    console.log('🔑 EnterpriseAPIService.generateApiKey called with:', keyData);
    console.log('🔑 Auth headers:', authHeaders);
    
    // Use the local proxy endpoint instead of direct API call
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch('/api/enterprise/api-keys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify(keyData)
        });
        
        const data = await response.json();
        console.log('📡 API key generation response from proxy:', data);
        return data;
      } catch (error) {
        console.error('❌ Error calling API key generation proxy:', error);
        throw error;
      }
    }
    
    // Fallback to original method for server-side calls
    return apiClient.post(ENTERPRISE_API.ENDPOINTS.API_KEYS, keyData, authHeaders);
  }

  static async listApiKeys(organizationId: string) {
    const authHeaders = this.getAuthHeaders();
    console.log('📋 EnterpriseAPIService.listApiKeys called with org:', organizationId);
    console.log('🔑 Auth headers:', authHeaders);
    
    // Use the local proxy endpoint instead of direct API call
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch(`/api/enterprise/api-keys?organization_id=${organizationId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          }
        });
        
        const data = await response.json();
        console.log('📡 API keys response from proxy:', data);
        return data;
      } catch (error) {
        console.error('❌ Error calling API keys proxy:', error);
        throw error;
      }
    }
    
    // Fallback to original method for server-side calls
    return apiClient.get(ENTERPRISE_API.ENDPOINTS.API_KEYS, {
      organization_id: organizationId
    }, authHeaders);
  }

  static async revokeApiKey(keyId: string) {
    const authHeaders = this.getAuthHeaders();
    console.log('🗑️ EnterpriseAPIService.revokeApiKey called with keyId:', keyId);
    console.log('🔑 Auth headers:', authHeaders);
    
    // Use the local proxy endpoint instead of direct API call
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch(`/api/enterprise/api-keys?api_key_id=${keyId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          }
        });
        
        const data = await response.json();
        console.log('📡 API key deletion response from proxy:', data);
        return data;
      } catch (error) {
        console.error('❌ Error calling API key deletion proxy:', error);
        throw error;
      }
    }
    
    // Fallback to original method for server-side calls
    return apiClient.delete(`${ENTERPRISE_API.ENDPOINTS.API_KEYS}/${keyId}`);
  }

  // Configuration Management
  static async saveConfiguration(configData: EnterpriseConfiguration) {
    const authHeaders = this.getAuthHeaders();
    return apiClient.post(ENTERPRISE_API.ENDPOINTS.CONFIGURATION, configData, authHeaders);
  }

  static async getConfiguration(organizationId: string) {
    const authHeaders = this.getAuthHeaders();
    return apiClient.get(ENTERPRISE_API.ENDPOINTS.CONFIGURATION, {
      organization_id: organizationId
    }, authHeaders);
  }

  // Specialization Management
  static async saveSpecialization(specializationData: {
    organization_id: string;
    user_id: string;
    custom_prompts?: any;
    reasoning_focus?: string[];
    analysis_depth?: string;
    confidence_threshold?: number;
    max_reasoning_chains?: number;
    domain_keywords?: string[];
  }) {
    return apiClient.post(ENTERPRISE_API.ENDPOINTS.SPECIALIZATION, specializationData);
  }

  // Configuration Validation
  static async validateConfiguration(configData: any): Promise<ValidationResult> {
    const authHeaders = this.getAuthHeaders();
    return apiClient.post(ENTERPRISE_API.ENDPOINTS.VALIDATE_CONFIG, configData, authHeaders);
  }
}