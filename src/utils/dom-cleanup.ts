
/**
 * Utility functions for cleaning up UI state during navigation
 */

// Cleanup any open tooltips, popovers, or other floating UI elements
export function cleanupUIState() {
  // Remove any open modals
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach(modal => {
    if (modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
  
  // Remove any open tooltips
  const tooltips = document.querySelectorAll('[data-state="open"]');
  tooltips.forEach(tooltip => {
    tooltip.setAttribute('data-state', 'closed');
  });
  
  // Remove any fixed positioning that may cause scrolling issues
  document.body.classList.remove('overflow-hidden');
  document.body.style.paddingRight = '';
  
  // Force blur on any focused elements to prevent keyboard issues
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

// Setup listener for route changes to clean up UI state
export function setupRouteChangeCleanup() {
  const cleanup = () => cleanupUIState();
  
  // Clean up when user navigates away from the page
  window.addEventListener('beforeunload', cleanup);
  
  // Return a function to remove the listener
  return () => {
    window.removeEventListener('beforeunload', cleanup);
  };
}
