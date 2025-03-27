import axios from 'axios';
import cacheService from './cacheService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle errors and caching
api.interceptors.request.use(
  (config) => {
    // For GET requests, check if we have a cached response
    if (config.method.toLowerCase() === 'get' && config.cache !== false) {
      const cacheKey = generateCacheKey(config);
      const cachedResponse = cacheService.get(cacheKey);
      
      if (cachedResponse) {
        // Convert cached response to a promise
        const response = {
          data: cachedResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          cached: true
        };
        
        // Cancel the actual request and return the cached response
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        source.cancel('Request canceled due to cached response');
        
        return Promise.reject({
          message: 'Request canceled due to cached response',
          response,
          config
        });
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and caching
api.interceptors.response.use(
  (response) => {
    // Cache GET responses for future use
    if (response.config.method.toLowerCase() === 'get' && response.config.cache !== false) {
      const cacheKey = generateCacheKey(response.config);
      // Get custom TTL or use default
      const ttl = response.config.cacheTTL || undefined;
      cacheService.set(cacheKey, response.data, ttl);
    }
    
    return response;
  },
  (error) => {
    // If error was due to cancelled request because of cache hit, return cached response
    if (error.message === 'Request canceled due to cached response' && error.response) {
      return Promise.resolve(error.response);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // If not on login page, clear localStorage and redirect to login
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generate a cache key based on the request config
 * @param {Object} config - Axios request config
 * @returns {string} - Cache key
 */
function generateCacheKey(config) {
  const { url, params, data } = config;
  return `${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`;
}

/**
 * Enhanced API methods with caching
 */
const apiService = {
  /**
   * Make a GET request with caching
   * @param {string} url - Request URL
   * @param {Object} config - Axios request config
   * @returns {Promise} - Axios response promise
   */
  get: (url, config = {}) => {
    return api.get(url, config);
  },
  
  /**
   * Make a GET request without caching
   * @param {string} url - Request URL
   * @param {Object} config - Axios request config
   * @returns {Promise} - Axios response promise
   */
  getNoCache: (url, config = {}) => {
    return api.get(url, { ...config, cache: false });
  },
  
  /**
   * Make a POST request
   * @param {string} url - Request URL 
   * @param {Object} data - Request payload
   * @param {Object} config - Axios request config
   * @returns {Promise} - Axios response promise
   */
  post: (url, data, config = {}) => {
    // Invalidate cache for this endpoint on POST
    cacheService.clearByPrefix(url);
    return api.post(url, data, config);
  },
  
  /**
   * Make a PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request payload
   * @param {Object} config - Axios request config
   * @returns {Promise} - Axios response promise
   */
  put: (url, data, config = {}) => {
    // Invalidate cache for this endpoint on PUT
    cacheService.clearByPrefix(url);
    return api.put(url, data, config);
  },
  
  /**
   * Make a DELETE request
   * @param {string} url - Request URL
   * @param {Object} config - Axios request config
   * @returns {Promise} - Axios response promise
   */
  delete: (url, config = {}) => {
    // Invalidate cache for this endpoint on DELETE
    cacheService.clearByPrefix(url);
    return api.delete(url, config);
  },
  
  /**
   * Clear all cached responses
   */
  clearCache: () => {
    cacheService.clear();
  },
  
  /**
   * Clear cached responses for a specific endpoint
   * @param {string} endpoint - API endpoint path
   */
  clearEndpointCache: (endpoint) => {
    cacheService.clearByPrefix(endpoint);
  }
};

// Add original axios instance methods
apiService.axios = api;

export default apiService;