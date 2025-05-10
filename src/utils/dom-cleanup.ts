
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
  
  // Remove any loading triggers
  try {
    const loadingTriggers = document.querySelectorAll('.loading-trigger');
    loadingTriggers.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  } catch (e) {
    console.error('Error cleaning up loading triggers:', e);
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
  }
  
  const observer = new MutationObserver((mutations) => {
    // Don't process if document or location is undefined (SSR)
    if (typeof document === 'undefined' || typeof document.location === 'undefined') return;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // Only run cleanup if we detect a route change
        const currentHash = document.location.hash || '';
        if (window.lastKnownHash !== currentHash) {
          window.lastKnownHash = currentHash;
          cleanupUIState();
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
  }
}
