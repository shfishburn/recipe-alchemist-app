
/**
 * Utility functions for cleaning up DOM elements related to loading states
 */

/**
 * Force cleanup of any loading-related UI elements and classes
 */
export function forceCleanupUI() {
  console.log("Forcing cleanup of UI elements");
  
  try {
    // Create a safety wrapper for DOM operations
    const safelyRemoveClass = (element: HTMLElement, className: string) => {
      if (element && element.classList && element.classList.contains(className)) {
        element.classList.remove(className);
      }
    };

    // Remove any loading classes from body with safety checks
    if (document.body) {
      safelyRemoveClass(document.body, 'overflow-hidden');
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.left = '';
    }
    
    // Show all hidden navbars with safety checks
    const hiddenNavbars = document.querySelectorAll('[data-hidden-by-loading="true"]');
    hiddenNavbars.forEach(navbar => {
      if (navbar && navbar instanceof HTMLElement) {
        navbar.style.visibility = '';
        navbar.removeAttribute('aria-hidden');
        navbar.removeAttribute('data-hidden-by-loading');
      }
    });
    
    // Find and remove any loading overlay that might be stuck
    const loadingOverlays = document.querySelectorAll('.loading-overlay');
    loadingOverlays.forEach(overlay => {
      // Check if it's not currently in use
      if (overlay && 
          overlay instanceof HTMLElement && 
          !overlay.classList.contains('active-loading-current')) {
        console.log("Removing stale loading overlay");
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }
    });
    
    // Remove any loading triggers
    const loadingTriggers = document.querySelectorAll('.loading-trigger');
    loadingTriggers.forEach(el => {
      if (el && el instanceof HTMLElement && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  } catch (e) {
    console.error("Error during UI cleanup", e);
  }
}

/**
 * Alias for forceCleanupUI - for consistent naming across the app
 */
export const cleanupUIState = forceCleanupUI;

/**
 * Ensure the recipe loading animation stays active
 */
export function ensureRecipeLoadingActive() {
  const loadingOverlay = document.getElementById('fullscreen-loading-overlay');
  if (loadingOverlay && loadingOverlay instanceof HTMLElement) {
    // Add a class to mark this as the currently active loading overlay
    loadingOverlay.classList.add('active-loading-current');
  }
}

/**
 * Check if any loading UI is currently active
 */
export function isLoadingActive(): boolean {
  // Use optional chaining for safer DOM access
  const hasLoadingClass = document.body?.classList.contains('overflow-hidden') || false;
  const hasLoadingOverlay = !!document.querySelector('.loading-overlay.active-loading');
  const hasLoadingTrigger = !!document.querySelector('.loading-trigger.loading-overlay-active');
  
  return hasLoadingClass || hasLoadingOverlay || hasLoadingTrigger;
}

/**
 * Check and clean up any orphaned loading UI elements
 * Call this periodically to prevent stuck loading states
 */
export function checkAndCleanupLoadingUI() {
  const loadingActive = isLoadingActive();
  const pageIsLoading = document.querySelector('[aria-busy="true"]');
  
  // If the page is no longer loading but loading UI is still active
  if (!pageIsLoading && loadingActive) {
    console.log("Detected orphaned loading UI, cleaning up");
    forceCleanupUI();
    return true; // Cleanup was performed
  }
  
  return false; // No cleanup needed
}

/**
 * Set up cleanup handlers for route changes
 * Returns a cleanup function
 */
export function setupRouteChangeCleanup(): () => void {
  // Create handler for popstate events (browser back/forward)
  const handlePopState = () => {
    console.log("Route change detected (popstate), cleaning up UI");
    setTimeout(checkAndCleanupLoadingUI, 100);
  };
  
  // Listen for browser navigation events with safety check
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', handlePopState);
    
    // Return function to remove event listeners
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }
  
  return () => {}; // Empty cleanup function if window is not available
}
