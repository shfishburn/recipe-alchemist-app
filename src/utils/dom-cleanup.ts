
/**
 * Helper functions to safely clean up stale UI elements that might be left behind during navigation
 * This helps prevent DOM errors when trying to manipulate elements that no longer exist
 */

/**
 * Force cleanup of any loading UI elements that might be left in the DOM
 */
export function forceCleanupUI() {
  try {
    console.info('Forcing cleanup of UI elements');
    
    // Safe removal function that checks if element exists first
    const safeRemove = (selector: string) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(el => {
          try {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            }
          } catch (e) {
            console.warn(`Failed to remove ${selector}:`, e);
          }
        });
      }
    };
    
    // Clean up potential loading overlays
    safeRemove('.loading-overlay');
    safeRemove('.progress-indicator');
    safeRemove('.fullscreen-loader');
    
    // Reset body styles that might have been set
    document.body.style.overflow = '';
  } catch (err) {
    console.warn('Error during UI cleanup:', err);
  }
}

/**
 * Check for any orphaned loading UI and remove it
 * This helps clean up UI elements that might be left behind if 
 * a component unmounts unexpectedly
 */
export function checkAndCleanupLoadingUI() {
  try {
    const isInActiveLoadingState = document.body.classList.contains('loading-active') ||
                                   document.querySelector('.loading-active');
    
    // Only clean up if we're not actively loading
    if (!isInActiveLoadingState) {
      forceCleanupUI();
    }
  } catch (err) {
    console.warn('Error checking for loading UI:', err);
  }
}
