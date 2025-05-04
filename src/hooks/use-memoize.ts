
import { useRef, useMemo, useCallback } from 'react';

/**
 * Type for cache entry with value and timestamp
 */
type CacheEntry<T> = {
  value: T;
  timestamp: number;
};

/**
 * Type for memoization options
 */
interface MemoizeOptions {
  /**
   * Time to live for cache entries in milliseconds
   * Default: 0 (no expiration)
   */
  ttl?: number;
  
  /**
   * Max number of entries to keep in cache
   * Default: 100
   */
  maxSize?: number;
  
  /**
   * Custom key generation function
   */
  keyGenerator?: (...args: any[]) => string;
}

/**
 * Hook to memoize expensive function calls with caching and TTL support
 */
export function useMemoize<T, Args extends any[] = any[]>(
  fn: (...args: Args) => T,
  options: MemoizeOptions = {}
) {
  // Set default options
  const {
    ttl = 0,
    maxSize = 100,
    keyGenerator = (...args) => JSON.stringify(args)
  } = options;
  
  // Create cache ref that persists between renders
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  
  // Clear expired cache entries
  const cleanCache = useCallback(() => {
    if (ttl > 0) {
      const now = Date.now();
      const expiredKeys: string[] = [];
      
      cacheRef.current.forEach((entry, key) => {
        if (now - entry.timestamp > ttl) {
          expiredKeys.push(key);
        }
      });
      
      expiredKeys.forEach(key => cacheRef.current.delete(key));
    }
  }, [ttl]);
  
  // Memoized function with caching
  const memoizedFn = useCallback(
    (...args: Args): T => {
      cleanCache();
      
      // Generate cache key
      const key = keyGenerator(...args);
      
      // Check if cached value exists and is not expired
      if (cacheRef.current.has(key)) {
        const entry = cacheRef.current.get(key)!;
        
        // Check if entry has expired (if ttl is set)
        if (ttl === 0 || Date.now() - entry.timestamp <= ttl) {
          return entry.value;
        }
      }
      
      // Calculate new value
      const value = fn(...args);
      
      // Manage cache size limit
      if (cacheRef.current.size >= maxSize) {
        // Remove oldest entry
        const firstKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(firstKey);
      }
      
      // Store in cache
      cacheRef.current.set(key, {
        value,
        timestamp: Date.now()
      });
      
      return value;
    },
    [fn, ttl, maxSize, keyGenerator, cleanCache]
  );
  
  return memoizedFn;
}

/**
 * Hook to memoize a value with custom dependency array
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList,
  options: Omit<MemoizeOptions, 'keyGenerator'> = {}
): T {
  const memoizedFactory = useMemoize(factory, {
    ...options,
    keyGenerator: () => deps.join(',')
  });
  
  return useMemo(() => memoizedFactory(), deps);
}

export default useMemoize;
