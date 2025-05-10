
/**
 * Utility function to clean up UI state that might be stuck
 * This helps prevent issues with loading states, modals, etc.
 */
export const cleanupUIState = () => {
  console.log('Running UI state cleanup');
  
  // Remove any stuck classes with safety checks
  if (document.body) {
    document.body.classList.remove('overflow-hidden');
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.classList.remove('loading');
  }
  
  // Restore navbar visibility if it was hidden
  const navbar = document.querySelector('nav');
  if (navbar && navbar.style.display === 'none') {
    console.log('Restoring navbar visibility during cleanup');
    navbar.style.display = '';
  }
  
  // Remove any loading triggers that aren't active
  try {
    const inactiveLoadingTriggers = document.querySelectorAll('.loading-trigger:not(.loading-overlay-active)');
    console.log(`Found ${inactiveLoadingTriggers.length} inactive loading triggers to clean up`);
    inactiveLoadingTriggers.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  } catch (e) {
    console.error('Error cleaning up loading triggers:', e);
  }

  // Remove any stuck overlay elements that might be blocking the UI
  // But SKIP active loading overlays that are intentionally showing
  try {
    const possibleOverlays = document.querySelectorAll('.loading-overlay:not(.active-loading)');
    console.log(`Found ${possibleOverlays.length} inactive loading overlays to check`);
    possibleOverlays.forEach(overlay => {
      // Double-check that the overlay isn't active before removing it
      if (overlay.parentNode && !overlay.classList.contains('active-loading')) {
        const computedStyle = window.getComputedStyle(overlay);
        if (computedStyle.display !== 'none') {
          console.log('Removing potentially stuck overlay');
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
    
    let hasActiveLoading = false;
    
    // First check if there's any active loading overlay
    try {
      hasActiveLoading = !!document.querySelector('.active-loading');
    } catch (e) {
      console.error('Error checking for active loading:', e);
    }
    
    // If there's active loading, don't process further
    if (hasActiveLoading) {
      console.log('Route change detected but active loading found - skipping cleanup');
      return;
    }
    
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
  
  // Restore navbar visibility
  const navbar = document.querySelector('nav');
  if (navbar && navbar.style.display === 'none') {
    console.log('Restoring navbar visibility during force cleanup');
    navbar.style.display = '';
  }
  
  // Only clean up inactive loading overlays
  const overlays = document.querySelectorAll('.loading-overlay:not(.active-loading)');
  if (overlays.length > 0) {
    console.log(`Found ${overlays.length} inactive overlays during force cleanup`);
    
    // Check if any overlay isn't in the process of being removed already
    overlays.forEach(overlay => {
      if (overlay.parentNode && !overlay.classList.contains('being-removed')) {
        overlay.classList.add('being-removed');
        console.log('Marking overlay for removal');
        
        // Use timeout to ensure any transitions can complete
        setTimeout(() => {
          if (overlay.parentNode) {
            console.log('Removing marked overlay');
            overlay.parentNode.removeChild(overlay);
          }
        }, 300);
      }
    });
  }
  
  // Run standard cleanup
  cleanupUIState();
};

// Add a specific method to handle recipe loading cleanup
export const ensureRecipeLoadingActive = () => {
  // Find any recipe loading overlay
  const recipeLoading = document.querySelector('.loading-overlay#fullscreen-loading-overlay');
  
  // If found, make sure it's marked as active
  if (recipeLoading && !recipeLoading.classList.contains('active-loading')) {
    console.log('Found recipe loading overlay but not marked as active - fixing');
    recipeLoading.classList.add('active-loading');
  }
  
  // Ensure navbar is hidden during loading
  const activeLoadingElements = document.querySelectorAll('.loading-overlay.active-loading');
  if (activeLoadingElements.length > 0) {
    const navbar = document.querySelector('nav');
    if (navbar && navbar.style.display !== 'none') {
      console.log('Active loading detected but navbar is visible - hiding navbar');
      navbar.style.display = 'none';
    }
  }
};

// Declare global variable for TypeScript 
declare global {
  interface Window {
    lastKnownHash: string;
  }
}
