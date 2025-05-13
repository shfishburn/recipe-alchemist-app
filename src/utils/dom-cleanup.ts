
/**
 * Cleans up any UI state that might be lingering from previous actions.
 * This includes removing loading overlays, modals, etc.
 * 
 * @param options Configuration options for cleanup
 */
export function cleanupUIState(options: {
  forceCleanLoadingOverlays?: boolean,
  restoreBodyScroll?: boolean
} = {}) {
  const { 
    forceCleanLoadingOverlays = false,
    restoreBodyScroll = true
  } = options;

  try {
    // Only remove loading overlays if forced or they don't have the active-loading class
    const loadingOverlays = document.querySelectorAll('.loading-overlay');
    loadingOverlays.forEach(overlay => {
      if (forceCleanLoadingOverlays || !overlay.classList.contains('active-loading')) {
        overlay.classList.remove('active-loading');
        console.log('Cleaned up loading overlay');
      }
    });

    // Force body to be scrollable in case it was disabled by a modal
    if (restoreBodyScroll) {
      document.body.style.overflow = '';
    }
    
    // Remove any backdrop elements that might have been left behind
    const backdrops = document.querySelectorAll('.modal-backdrop, .drawer-backdrop');
    backdrops.forEach(backdrop => {
      backdrop.remove();
      console.log('Removed backdrop element');
    });
    
    // Remove any open modal or dialog elements
    const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
    openModals.forEach(modal => {
      // We can't directly remove these as they may be controlled by React
      // But we can set aria-hidden to true to hide them
      modal.setAttribute('aria-hidden', 'true');
      console.log('Set aria-hidden on dialog element');
    });
    
    console.log('UI state cleanup complete');
  } catch (error) {
    console.error('Error during UI state cleanup:', error);
  }
}

/**
 * Sets up a listener for route changes to automatically clean up UI state
 * Returns a cleanup function that removes the listener
 */
export function setupRouteChangeCleanup() {
  // Function to handle route changes and clean up UI
  const handleRouteChange = () => {
    cleanupUIState();
  };

  // Add event listener for history state changes (route changes)
  window.addEventListener('popstate', handleRouteChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handleRouteChange);
  };
}
