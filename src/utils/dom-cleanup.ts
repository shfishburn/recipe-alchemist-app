
/**
 * Utility to clean up UI state, remove orphaned overlays and reset body classes
 * after authentication transitions and route changes
 */

/**
 * Cleans up any lingering modal overlays and resets body classes
 * to prevent ghost overlays that block interactions
 */
export function cleanupUIState(): void {
  // Reset body classes that might have been left behind
  document.body.classList.remove('overflow-hidden');
  
  // Remove any orphaned overlays (dialog, drawer, sheet)
  const overlays = document.querySelectorAll(
    '[data-state="open"].bg-black\\/80, ' + 
    '[role="dialog"], ' +
    '[role="presentation"].fixed'
  );
  
  // Clean up each overlay element
  overlays.forEach(overlay => {
    // Check if it's an orphaned element (no longer connected to active components)
    if (overlay.parentElement) {
      overlay.parentElement.removeChild(overlay);
    }
  });
  
  // Clear any inline styles that might have been added by radix components
  document.body.style.paddingRight = '';
  document.body.style.pointerEvents = '';
}

/**
 * Sets up a global listener to clean UI state on route changes
 */
export function setupRouteChangeCleanup(): () => void {
  // Called when popstate event happens (browser navigation)
  const handleRouteChange = () => {
    cleanupUIState();
  };
  
  // Listen for browser history navigation
  window.addEventListener('popstate', handleRouteChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handleRouteChange);
  };
}
