
/**
 * Utility functions for cleaning up DOM elements that might be left behind
 * due to routing or component unmounting issues
 */

// Find all loading overlays in the document
const findLoadingOverlays = (): NodeListOf<Element> => {
  return document.querySelectorAll('.loading-overlay, #fullscreen-loading-overlay');
};

// Check if an overlay is stale (not attached to a mounted component)
const isStaleOverlay = (overlay: Element): boolean => {
  // If it has the active-loading class, it's not stale
  if (overlay.classList.contains('active-loading')) {
    return false;
  }
  
  // If it's in the React root and not marked as active, it might be stale
  return true;
};

// Force cleanup of all loading UI elements
export const forceCleanupUI = () => {
  console.log("Forcing cleanup of UI elements");
  
  // Find all overlays
  const overlays = findLoadingOverlays();
  
  if (overlays.length === 0) {
    return; // No overlays found
  }
  
  let removedCount = 0;
  
  // Remove all overlays except those marked as active
  overlays.forEach(overlay => {
    if (!overlay.classList.contains('active-loading')) {
      console.log("Removing stale loading overlay");
      overlay.remove();
      removedCount++;
    }
  });
  
  if (removedCount === 0) {
    console.log("No stale loading overlays found");
  } else {
    console.log(`Removed ${removedCount} stale loading overlays`);
  }
};

// Check for orphaned loading UI and clean up if needed
export const checkAndCleanupLoadingUI = () => {
  const overlays = findLoadingOverlays();
  
  if (overlays.length === 0) {
    return; // No overlays found
  }
  
  let staleCount = 0;
  
  // Check each overlay to see if it's stale
  overlays.forEach(overlay => {
    if (isStaleOverlay(overlay)) {
      staleCount++;
      console.log("Removing stale loading overlay");
      overlay.remove();
    }
  });
  
  if (staleCount > 0) {
    console.log(`Cleaned up ${staleCount} stale loading overlays`);
  }
};

// Mark an element as the active loading overlay
export const markActiveLoading = (element: HTMLElement | null) => {
  if (!element) return;
  element.classList.add('active-loading');
};

// Clear the active loading mark
export const clearActiveLoading = (element: HTMLElement | null) => {
  if (!element) return;
  element.classList.remove('active-loading');
};

// Added missing exports referenced in other components
export const cleanupUIState = () => {
  console.log("Cleaning up UI state");
  forceCleanupUI();
};

export const setupRouteChangeCleanup = () => {
  console.log("Setting up route change cleanup");
  // This function is called from AppLayout to set up cleanup on route changes
  // For now, it's a placeholder that does nothing, but it's exported for compatibility
};
