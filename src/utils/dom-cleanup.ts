
/**
 * DOM Cleanup Utility Functions
 * 
 * These functions help manage and clean up UI elements that might get stuck
 * between route changes or when components unmount improperly.
 */

/**
 * Cleans up any UI state elements that might be stuck in the DOM
 */
export function cleanupUIState(): void {
  // Clean up any modal backdrops
  const backdrops = document.querySelectorAll('.modal-backdrop, [data-backdrop], [data-overlay]');
  backdrops.forEach(el => el.remove());

  // Remove any loading overlays if they're not actively being used
  const loadingOverlays = document.querySelectorAll('.loading-overlay:not(.active-loading)');
  loadingOverlays.forEach(el => el.remove());

  // Remove any fixed positioning that might affect scrolling
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('position');
  document.body.style.removeProperty('width');
  document.body.style.removeProperty('height');
  document.body.style.removeProperty('top');
  document.body.style.removeProperty('padding-right');

  // Reset any z-index changes to body
  document.body.style.removeProperty('z-index');

  // Remove any classes that might have been added to body
  document.body.classList.remove('modal-open');
  document.body.classList.remove('overflow-hidden');
}

/**
 * Sets up event listeners to clean up UI state on route changes
 */
export function setupRouteChangeCleanup(): () => void {
  // Create a function to handle cleanup on route changes
  const handleCleanup = () => {
    cleanupUIState();
  };

  // Listen for navigation events
  window.addEventListener('popstate', handleCleanup);
  
  // Return a cleanup function to remove listeners
  return () => {
    window.removeEventListener('popstate', handleCleanup);
  };
}

export default {
  cleanupUIState,
  setupRouteChangeCleanup
};
