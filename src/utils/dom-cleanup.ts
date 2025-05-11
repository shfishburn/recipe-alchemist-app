
/**
 * Helper functions to safely clean up stale UI elements that might be left behind during navigation
 * This helps prevent DOM errors when trying to manipulate elements that no longer exist
 */

/**
 * Force cleanup of any loading UI elements that might be left in the DOM
 */
export function forceCleanupUI() {
  try {
    console.info('Forcing cleanup of UI elements');
    
    // Safe removal function that checks if element exists first
    const safeRemove = (selector: string) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(el => {
          try {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            }
          } catch (e) {
            console.warn(`Failed to remove ${selector}:`, e);
          }
        });
      }
    };
    
    // Clean up potential loading overlays
    safeRemove('.loading-overlay');
    safeRemove('.progress-indicator');
    safeRemove('.fullscreen-loader');
    
    // Reset body styles that might have been set
    document.body.style.overflow = '';
  } catch (err) {
    console.warn('Error during UI cleanup:', err);
  }
}

/**
 * Check for any orphaned loading UI and remove it
 * This helps clean up UI elements that might be left behind if 
 * a component unmounts unexpectedly
 */
export function checkAndCleanupLoadingUI() {
  try {
    const isInActiveLoadingState = document.body.classList.contains('loading-active') ||
                                   document.querySelector('.loading-active');
    
    // Only clean up if we're not actively loading
    if (!isInActiveLoadingState) {
      forceCleanupUI();
    }
  } catch (err) {
    console.warn('Error checking for loading UI:', err);
  }
}

/**
 * More comprehensive UI state cleanup beyond just loading elements
 * Use this for general app state cleanup when navigating between routes
 */
export function cleanupUIState() {
  try {
    console.info('Cleaning up UI state');
    
    // Clean up any loading UI elements
    forceCleanupUI();
    
    // Remove any modal backdrops that might be left behind
    const safeRemove = (selector: string) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(el => {
          try {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            }
          } catch (e) {
            console.warn(`Failed to remove ${selector}:`, e);
          }
        });
      }
    };
    
    // Clean up common UI elements that might be left behind
    safeRemove('.modal-backdrop');
    safeRemove('.drawer-backdrop');
    safeRemove('.dialog-backdrop');
    
    // Reset body classes that might affect scrolling or interaction
    document.body.classList.remove('modal-open');
    document.body.classList.remove('overflow-hidden');
    document.body.classList.remove('drawer-open');
    
    // Reset any inline overflow styles
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // Check and remove any unexpected fixed positioning
    document.querySelectorAll('.fixed').forEach(el => {
      if (
        el.classList.contains('orphaned') || 
        (el.children.length === 0 && !el.textContent?.trim())
      ) {
        try {
          el.parentNode?.removeChild(el);
        } catch (e) {
          console.warn('Failed to remove orphaned fixed element:', e);
        }
      }
    });
    
  } catch (err) {
    console.warn('Error during UI state cleanup:', err);
  }
}

/**
 * Mark a DOM element as having active loading state
 * This prevents it from being cleaned up by the automatic cleanup routines
 */
export function markActiveLoading(element: HTMLElement) {
  try {
    console.log('Marking element as active loading');
    element.classList.add('active-loading');
    document.body.classList.add('loading-active');
  } catch (err) {
    console.warn('Error marking active loading state:', err);
  }
}

/**
 * Clear the active loading state from a DOM element
 * This allows it to be cleaned up by automatic cleanup routines
 */
export function clearActiveLoading(element: HTMLElement) {
  try {
    console.log('Clearing active loading state');
    element.classList.remove('active-loading');
    
    // Only remove body class if there are no other active loading elements
    if (!document.querySelector('.active-loading')) {
      document.body.classList.remove('loading-active');
    }
  } catch (err) {
    console.warn('Error clearing active loading state:', err);
  }
}

/**
 * Set up listeners for route changes to clean up UI state
 * Returns a cleanup function to remove the listeners
 */
export function setupRouteChangeCleanup() {
  try {
    console.log('Setting up route change cleanup');
    
    // Save initial path to detect actual route changes
    let lastPath = window.location.pathname;
    
    // Create MutationObserver to detect route changes by watching the DOM
    const observer = new MutationObserver((mutations) => {
      // Check if the URL has changed
      if (window.location.pathname !== lastPath) {
        console.log('Route change detected, cleaning up UI state');
        lastPath = window.location.pathname;
        
        // Don't clean up if there's an active loading state
        const hasActiveLoadingOverlay = document.querySelector('.loading-overlay.active-loading');
        if (!hasActiveLoadingOverlay) {
          cleanupUIState();
        }
      }
    });
    
    // Start observing relevant parts of the DOM for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Return cleanup function
    return () => {
      console.log('Cleaning up route change observer');
      observer.disconnect();
    };
  } catch (err) {
    console.warn('Error setting up route change cleanup:', err);
    // Return empty cleanup function to avoid errors
    return () => {};
  }
}
