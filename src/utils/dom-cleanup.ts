
/**
 * Clean up any lingering UI elements like modals, overlays, etc.
 * This is particularly useful when navigating between pages or after authentication
 */
export function cleanupUIState() {
  try {
    // Clean up any debug/test UI elements
    const debugElements = document.querySelectorAll(
      '.debug-overlay, .test-output, .sandbox-debug, .loading-overlay:not(.active-loading)'
    );
    
    debugElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
        console.log("Removed UI element:", el.className);
      }
    });
    
    // Remove any stray backdrop elements
    const backdropElements = document.querySelectorAll(
      '[data-state="open"].backdrop, .dialog-backdrop, .modal-backdrop'
    );
    
    backdropElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
        console.log("Removed backdrop element:", el.className);
      }
    });
    
    // Remove any authentication related overlays
    const authOverlays = document.querySelectorAll('.auth-overlay');
    
    authOverlays.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
        console.log("Removed auth overlay element:", el.className);
      }
    });
    
    // Check document for scrollability
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
      console.log("Restored body scrolling");
    }
    
    return true;
  } catch (error) {
    console.error("Error cleaning up UI state:", error);
    return false;
  }
}
