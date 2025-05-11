
/**
 * Performance utilities for better user experience
 */

/**
 * Prefetch assets for better performance
 * 
 * @param paths Array of paths to prefetch
 */
export const prefetchAssets = (paths: string[]) => {
  // Only run prefetching in production to avoid unnecessary requests during development
  if (process.env.NODE_ENV !== 'production') return;

  // Use requestIdleCallback to prefetch assets during browser idle time
  const prefetchWhenIdle = () => {
    paths.forEach(path => {
      // Create link element
      const link = document.createElement('link');
      link.rel = 'prefetch';
      
      // Handle different asset types
      if (path.endsWith('.css')) {
        link.as = 'style';
      } else if (path.endsWith('.js') || path.endsWith('.ts') || path.endsWith('.tsx')) {
        link.as = 'script';
      } else if (path.endsWith('.svg') || path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg')) {
        link.as = 'image';
      }
      
      // Set path
      link.href = path;
      
      // Append to head
      document.head.appendChild(link);
    });
  };
  
  // Use requestIdleCallback if available, otherwise use setTimeout
  if ('requestIdleCallback' in window) {
    // @ts-ignore - requestIdleCallback is not in TypeScript's lib.dom.d.ts
    window.requestIdleCallback(prefetchWhenIdle);
  } else {
    setTimeout(prefetchWhenIdle, 1000);
  }
};

/**
 * Measures and logs performance metrics
 * 
 * @param label Label for the performance metric
 */
export const measurePerformance = (label: string) => {
  // Only run in development or if performance is explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !window.localStorage.getItem('enable-performance-metrics')) {
    return;
  }
  
  // Create performance marks
  const startMark = `${label}-start`;
  const endMark = `${label}-end`;
  
  // Create measure function
  const measure = () => {
    performance.mark(endMark);
    performance.measure(label, startMark, endMark);
    
    // Get the measurement
    const entries = performance.getEntriesByName(label);
    const duration = entries[0]?.duration || 0;
    
    console.log(`⚡️ ${label}: ${duration.toFixed(2)}ms`);
    
    // Clean up marks and measures
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(label);
  };
  
  // Start measurement
  performance.mark(startMark);
  
  // Return function to end measurement
  return measure;
};

/**
 * Detect slow network conditions
 */
export const detectSlowNetwork = (): boolean => {
  // Check if the Network Information API is available
  if ('connection' in navigator) {
    // @ts-ignore - The Navigator.connection property is experimental
    const connection = navigator.connection;
    
    // Check for slow network conditions
    if (connection) {
      // 4G is about 4 Mbps minimum, so anything less is considered slow
      const isEffectiveTypeSlow = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
      const isDownlinkSlow = connection.downlink < 1.0; // Less than 1 Mbps
      const isHighLatency = connection.rtt > 500; // More than 500ms round-trip time
      
      // Return true if any of the conditions indicate a slow network
      return isEffectiveTypeSlow || isDownlinkSlow || isHighLatency || connection.saveData;
    }
  }
  
  // If we can't detect, default to false to avoid unnecessary optimizations
  return false;
};

/**
 * Enable low data mode for slow connections
 * Replaces high-quality images with lower quality versions, disables animations, etc.
 */
export const enableLowDataMode = () => {
  if (detectSlowNetwork()) {
    document.documentElement.classList.add('low-data-mode');
    
    // Store the preference
    localStorage.setItem('low-data-mode', 'enabled');
    
    return true;
  }
  
  // Check if user has explicitly enabled low data mode
  if (localStorage.getItem('low-data-mode') === 'enabled') {
    document.documentElement.classList.add('low-data-mode');
    return true;
  }
  
  return false;
};
