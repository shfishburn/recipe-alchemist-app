
import { useRef, useCallback } from 'react';

/**
 * Cache entry with value and timestamp
 */
interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

/**
 * Options for cache configuration
 */
interface CacheOptions {
  /** 
   * Time to live in milliseconds
   * @default 60000 (1 minute)
   */
  ttl?: number;
  
  /**
   * Maximum cache size
   * @default 100
   */
  maxSize?: number;
}

/**
 * Hook providing a simple in-memory cache with TTL
 */
export function useCache<T = any>(options: CacheOptions = {}) {
  const { ttl = 60000, maxSize = 100 } = options;
  
  // Cache storage
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  
  /**
   * Get an item from cache
   * @returns The cached value or undefined if not found or expired
   */
  const get = useCallback((key: string): T | undefined => {
    const cache = cacheRef.current;
    const entry = cache.get(key);
    
    if (!entry) return undefined;
    
    // Check if entry has expired
    if (ttl > 0 && Date.now() - entry.timestamp > ttl) {
      cache.delete(key);
      return undefined;
    }
    
    return entry.value;
  }, [ttl]);
  
  /**
   * Set an item in cache
   */
  const set = useCallback((key: string, value: T): void => {
    const cache = cacheRef.current;
    
    // Check if we need to remove oldest entries
    if (cache.size >= maxSize) {
      // Get oldest entry (first key in Map)
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    
    // Add new entry
    cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }, [maxSize]);
  
  /**
   * Remove an item from cache
   */
  const remove = useCallback((key: string): void => {
    cacheRef.current.delete(key);
  }, []);
  
  /**
   * Clear all cache entries
   */
  const clear = useCallback((): void => {
    cacheRef.current.clear();
  }, []);
  
  /**
   * Get cache size
   */
  const size = useCallback((): number => {
    return cacheRef.current.size;
  }, []);
  
  /**
   * Check if cache has a non-expired key
   */
  const has = useCallback((key: string): boolean => {
    return get(key) !== undefined;
  }, [get]);
  
  return { get, set, remove, clear, size, has };
}

export default useCache;
