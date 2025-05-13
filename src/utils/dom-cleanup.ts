
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

/**
 * Setup a cleanup function that runs on route changes
 * This ensures that when users navigate between routes,
 * any lingering UI elements are removed properly
 * 
 * @param navigate - The navigate function from useNavigate() hook
 * @returns A cleanup function to be called when the component unmounts
 */
export function setupRouteChangeCleanup(navigate: any) {
  // Store the original navigate function
  const originalNavigate = navigate;
  
  // Wrap the navigate function to perform cleanup before navigation
  const wrappedNavigate = (...args: any[]) => {
    // Run cleanup before navigating
    cleanupUIState();
    
    // Call the original navigate function with all arguments
    return originalNavigate(...args);
  };
  
  // Replace the navigate function with our wrapped version
  Object.assign(navigate, wrappedNavigate);
  
  // Return a cleanup function
  return () => {
    // No need to restore the original navigate function
    // as the component will be remounted with a fresh copy
    cleanupUIState();
  };
}
