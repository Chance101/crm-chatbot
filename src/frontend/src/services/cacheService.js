/**
 * Cache service for optimizing API requests
 * Implements a simple caching mechanism with time-based expiration
 */
class CacheService {
  constructor() {
    this.cache = new Map();
    this.DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  /**
   * Set an item in the cache with a time-to-live (TTL)
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = this.DEFAULT_TTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expiresAt
    });
    
    // Set cleanup timeout to automatically remove expired items
    setTimeout(() => {
      if (this.has(key)) {
        const item = this.cache.get(key);
        if (item.expiresAt <= Date.now()) {
          this.cache.delete(key);
        }
      }
    }, ttl);
  }

  /**
   * Get an item from the cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found/expired
   */
  get(key) {
    if (!this.has(key)) {
      return null;
    }

    const item = this.cache.get(key);
    
    // Check if item has expired
    if (item.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Check if an item exists in the cache and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} - Whether the item exists and is valid
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Remove an item from the cache
   * @param {string} key - Cache key
   */
  remove(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Clear all items that match a prefix
   * @param {string} prefix - Prefix to match
   */
  clearByPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

export default new CacheService();