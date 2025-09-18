import { useState, useEffect } from 'react';
import { EnterpriseAPIService } from '@/lib/enterprise-api';
import { EnterpriseConfiguration, ValidationResult } from '@/types/enterprise';

export const useOrganization = (organizationId?: string) => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrganization = async (orgData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await EnterpriseAPIService.createOrganization(orgData);
      setOrganization(result.organization);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      setLoading(true);
      EnterpriseAPIService.getOrganization(organizationId)
        .then(result => {
          setOrganization(result.organization);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [organizationId]);

  return { organization, loading, error, createOrganization };
};

export const useConfiguration = (organizationId?: string) => {
  const [configuration, setConfiguration] = useState<EnterpriseConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const saveConfiguration = async (configData: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await EnterpriseAPIService.saveConfiguration({
        organization_id: organizationId!,
        ...configData
      } as EnterpriseConfiguration);
      setConfiguration(result.configuration);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateConfiguration = async (configData: any) => {
    setLoading(true);
    
    // Check if user is authenticated first
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('enterprise_token') : null;
    if (!authToken) {
      const error = new Error('Not authenticated. Please log in to your enterprise account.');
      setError(error.message);
      setLoading(false);
      throw error;
    }
    
    try {
      const result = await EnterpriseAPIService.validateConfiguration(configData);
      setValidationResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Validation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      EnterpriseAPIService.getConfiguration(organizationId)
        .then(result => {
          setConfiguration(result.configuration);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
        });
    }
  }, [organizationId]);

  return { 
    configuration, 
    loading, 
    error, 
    validationResult,
    saveConfiguration, 
    validateConfiguration 
  };
};

export const useApiKeys = (organizationId?: string) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateApiKey = async (keyData: any) => {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('🔑 Generating API key with organization:', organizationId);
      console.log('🔑 Key data:', keyData);
      
      const result = await EnterpriseAPIService.generateApiKey({
        organization_id: organizationId,
        ...keyData
      });
      console.log('📡 API key generation result:', result);
      
      // Refresh the list
      await loadApiKeys();
      return result;
    } catch (err) {
      console.error('❌ Error generating API key:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate API key');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (keyData: any) => {
    return generateApiKey(keyData);
  };

  const revokeApiKey = async (keyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await EnterpriseAPIService.revokeApiKey(keyId);
      // Refresh the list
      await loadApiKeys();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke API key');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadApiKeys = async () => {
    if (!organizationId) {
      console.log('🚨 No organizationId provided to loadApiKeys');
      return;
    }
    
    console.log('📋 Loading API keys for organization:', organizationId);
    setLoading(true);
    try {
      const result = await EnterpriseAPIService.listApiKeys(organizationId);
      console.log('📡 API keys result from service:', result);
      setApiKeys(result.api_keys || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error loading API keys:', err);
      setError(err instanceof Error ? err.message : 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, [organizationId]);

  return { apiKeys, loading, error, generateApiKey, createApiKey, revokeApiKey, loadApiKeys };
};