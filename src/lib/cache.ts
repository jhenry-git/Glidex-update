/**
 * Cache Utility — Simple in-memory caching with TTL support
 * 
 * Provides basic caching functionality for API responses and computed values
 * to reduce unnecessary requests and improve performance.
 */

interface CacheItem<T> {
  value: T;
  expiresAt: number; // Timestamp in milliseconds
}

class Cache<T> {
  private store: Map<string, CacheItem<T>> = new Map();

  /**
   * Get a value from cache if it exists and hasn't expired
   */
  get(key: string): T | null {
    const item = this.store.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiresAt) {
      // Expired, remove it
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Set a value in cache with TTL (time to live)
   */
  set(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Delete a value from cache
   */
  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

// Create a singleton instance for use throughout the application
export const cache = new Cache<unknown>();

// Helper function to cache API responses
export function cacheApiResponse(
  ttlSeconds: number = 300 // Default 5 minutes
) {
  return function (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: unknown[]) {
      // Create a cache key based on method name and arguments
      const key = `${_propertyKey}:${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cachedValue = cache.get(key);
      if (cachedValue !== null) {
        return cachedValue;
      }
      
      // If not in cache, execute method
      const result = await originalMethod.apply(this, args);
      
      // Store result in cache
      cache.set(key, result, ttlSeconds);
      
      return result;
    };
    
    return descriptor;
  };
}