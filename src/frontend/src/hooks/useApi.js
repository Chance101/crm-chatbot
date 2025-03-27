import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for handling API requests with loading and error states
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Configuration options
 * @param {boolean} options.loadOnMount - Whether to load data on component mount
 * @param {Object} options.dependencies - Dependencies for the useEffect hook
 * @param {number} options.cacheTTL - Cache time-to-live in milliseconds
 * @param {boolean} options.skipCache - Whether to skip cache for this request
 * @returns {Object} Object containing data, loading state, error state, and helper functions
 */
const useApi = (url, options = {}) => {
  const {
    loadOnMount = true,
    dependencies = [],
    cacheTTL,
    skipCache = false
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch data
  const fetchData = useCallback(async (fetchOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare request config
      const config = {
        ...(skipCache && { cache: false }),
        ...(cacheTTL && { cacheTTL }),
        ...(fetchOptions.params && { params: fetchOptions.params })
      };
      
      // Make the request
      const response = await api.get(url, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      // Don't set error if the request was cancelled due to using cached data
      if (err.message !== 'Request canceled due to cached response') {
        setError({
          message: err.response?.data?.message || 'An error occurred',
          status: err.response?.status,
          details: err.response?.data
        });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, cacheTTL, skipCache]);

  // Function to create a new resource
  const createResource = useCallback(async (resourceData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(url, resourceData);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError({
        message: err.response?.data?.message || 'Failed to create resource',
        status: err.response?.status,
        details: err.response?.data
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Function to update a resource
  const updateResource = useCallback(async (id, resourceData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construct the URL with the ID if provided
      const updateUrl = id ? `${url}/${id}` : url;
      
      const response = await api.put(updateUrl, resourceData);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError({
        message: err.response?.data?.message || 'Failed to update resource',
        status: err.response?.status,
        details: err.response?.data
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Function to delete a resource
  const deleteResource = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construct the URL with the ID
      const deleteUrl = `${url}/${id}`;
      
      const response = await api.delete(deleteUrl);
      return response.data;
    } catch (err) {
      setError({
        message: err.response?.data?.message || 'Failed to delete resource',
        status: err.response?.status,
        details: err.response?.data
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Function to refresh data
  const refresh = useCallback(() => {
    return fetchData({ cache: false });
  }, [fetchData]);

  // Function to clear error state
  const clearError = () => setError(null);

  // Load data on mount if specified
  useEffect(() => {
    if (loadOnMount) {
      fetchData();
    }
  }, [loadOnMount, fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    fetchData,
    createResource,
    updateResource,
    deleteResource,
    refresh,
    clearError
  };
};

export default useApi;