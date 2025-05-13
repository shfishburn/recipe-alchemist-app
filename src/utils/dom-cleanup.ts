
/**
 * Cleans up any UI state that might be lingering from previous actions.
 * This includes removing loading overlays, modals, etc.
 */
export function cleanupUIState() {
  // Remove any loading overlay classes that might be lingering
  const loadingOverlays = document.querySelectorAll('.loading-overlay');
  loadingOverlays.forEach(overlay => {
    if (overlay.classList.contains('active-loading')) {
      overlay.classList.remove('active-loading');
    }
  });

  // Force body to be scrollable in case it was disabled by a modal
  document.body.style.overflow = '';
  
  // Remove any backdrop elements that might have been left behind
  const backdrops = document.querySelectorAll('.modal-backdrop, .drawer-backdrop');
  backdrops.forEach(backdrop => {
    backdrop.remove();
  });
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
