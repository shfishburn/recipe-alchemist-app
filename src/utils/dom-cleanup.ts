
/**
 * Utility functions for cleaning up DOM elements related to loading states
 */

/**
 * Force cleanup of any loading-related UI elements and classes
 */
export function forceCleanupUI() {
  console.log("Forcing cleanup of UI elements");
  
  try {
    // Remove any loading classes from body
    document.body.classList.remove('overflow-hidden');
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.style.left = '';
    
    // Show all hidden navbars
    const hiddenNavbars = document.querySelectorAll('[data-hidden-by-loading="true"]');
    hiddenNavbars.forEach(navbar => {
      if (navbar) {
        const navbarElement = navbar as HTMLElement;
        navbarElement.style.visibility = '';
        navbarElement.removeAttribute('aria-hidden');
        navbarElement.removeAttribute('data-hidden-by-loading');
      }
    });
    
    // Find and remove any loading overlay that might be stuck
    const loadingOverlays = document.querySelectorAll('.loading-overlay');
    loadingOverlays.forEach(overlay => {
      // Check if it's not currently in use
      if (!overlay.classList.contains('active-loading-current')) {
        console.log("Removing stale loading overlay", overlay);
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }
    });
    
    // Remove any loading triggers
    const loadingTriggers = document.querySelectorAll('.loading-trigger');
    loadingTriggers.forEach(el => {
      if (el.parentNode) {
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
  if (loadingOverlay) {
    // Add a class to mark this as the currently active loading overlay
    loadingOverlay.classList.add('active-loading-current');
  }
}

/**
 * Check if any loading UI is currently active
 */
export function isLoadingActive(): boolean {
  const hasLoadingClass = document.body.classList.contains('overflow-hidden');
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
  
  // Listen for browser navigation events
  window.addEventListener('popstate', handlePopState);
  
  // Return function to remove event listeners
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}
