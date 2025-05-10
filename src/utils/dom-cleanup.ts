
/**
 * Utility function to clean up UI state that might be stuck
 * This helps prevent issues with loading states, modals, etc.
 */
export const cleanupUIState = () => {
  // Remove any stuck classes with safety checks
  if (document.body) {
    document.body.classList.remove('overflow-hidden');
    document.body.classList.remove('loading');
  }
  
  // Remove any loading triggers with more robust error handling
  try {
    const loadingTriggers = document.querySelectorAll('.loading-trigger');
    loadingTriggers.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    
    // Clear any stuck loading overlays that might persist
    const loadingOverlays = document.querySelectorAll('.loading-overlay');
    loadingOverlays.forEach(overlay => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    });
    
    // Remove any progress bars that might be stuck
    const progressBars = document.querySelectorAll('.nprogress-container');
    progressBars.forEach(bar => {
      if (bar instanceof HTMLElement) {
        bar.style.opacity = '0';
        setTimeout(() => {
          if (bar.parentNode) {
            bar.parentNode.removeChild(bar);
          }
        }, 300);
      }
    });
  } catch (e) {
    console.error('Error cleaning up loading elements:', e);
  }
};

/**
 * Set up an observer to clean up UI state on route changes
 * Returns a cleanup function to disconnect the observer
 */
export const setupRouteChangeCleanup = () => {
  // Store initial hash for comparison
  if (typeof window !== 'undefined') {
    window.lastKnownHash = document.location.hash || '';
    
    // Immediate cleanup on mount
    cleanupUIState();
  }
  
  const observer = new MutationObserver((mutations) => {
    // Don't process if document or location is undefined (SSR)
    if (typeof document === 'undefined' || typeof document.location === 'undefined') return;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // Only run cleanup if we detect a route change
        const currentHash = document.location.hash || '';
        const currentPath = document.location.pathname || '';
        
        if (window.lastKnownHash !== currentHash || 
            window.lastKnownPath !== currentPath) {
          window.lastKnownHash = currentHash;
          window.lastKnownPath = currentPath;
          
          // Add a small delay to ensure new components are mounted before cleanup
          setTimeout(() => {
            cleanupUIState();
          }, 100);
        }
      }
    }
  });
  
  // Only observe if document is available
  if (typeof document !== 'undefined' && document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  return () => observer.disconnect();
};

// Declare global variable for TypeScript 
declare global {
  interface Window {
    lastKnownHash: string;
    lastKnownPath: string;
  }
}
