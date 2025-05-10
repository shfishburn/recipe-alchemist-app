
/**
 * Utility function to clean up UI state that might be stuck
 * This helps prevent issues with loading states, modals, etc.
 */
export const cleanupUIState = () => {
  console.log('Running UI state cleanup');
  
  // Remove any stuck classes with safety checks
  if (document.body) {
    document.body.classList.remove('overflow-hidden');
    document.body.classList.remove('loading');
    document.body.style.position = '';
    document.body.style.width = '';
  }
  
  // Remove any loading triggers
  try {
    const loadingTriggers = document.querySelectorAll('.loading-trigger');
    console.log(`Found ${loadingTriggers.length} loading triggers to clean up`);
    loadingTriggers.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  } catch (e) {
    console.error('Error cleaning up loading triggers:', e);
  }

  // Remove any stuck overlay elements that might be blocking the UI
  try {
    const possibleOverlays = document.querySelectorAll('.loading-overlay');
    console.log(`Found ${possibleOverlays.length} loading overlays to check`);
    possibleOverlays.forEach(overlay => {
      // Check if the overlay exists and might be "stuck"
      const computedStyle = window.getComputedStyle(overlay);
      if (computedStyle.display !== 'none') {
        console.log('Removing potentially stuck overlay');
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }
    });
  } catch (e) {
    console.error('Error cleaning up overlay elements:', e);
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

// Add a manual cleanup method to be called from components
export const forceCleanupUI = () => {
  console.log('Force cleanup UI called');
  cleanupUIState();
};

// Declare global variable for TypeScript 
declare global {
  interface Window {
    lastKnownHash: string;
  }
}
