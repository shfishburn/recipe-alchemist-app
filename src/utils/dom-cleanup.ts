
/**
 * Utility function to clean up UI state that might be stuck
 * This helps prevent issues with loading states, modals, etc.
 */
export const cleanupUIState = () => {
  // Remove any stuck classes
  document.body.classList.remove('overflow-hidden');
  document.documentElement.classList.remove('overflow-hidden');
  document.body.classList.remove('loading');
  
  // Remove any loading triggers
  const loadingTriggers = document.querySelectorAll('.loading-trigger');
  loadingTriggers.forEach(el => {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
};

/**
 * Set up an observer to clean up UI state on route changes
 * Returns a cleanup function to disconnect the observer
 */
export const setupRouteChangeCleanup = () => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // Only run cleanup if we detect a route change
        if (document.location.hash !== window.lastKnownHash) {
          window.lastKnownHash = document.location.hash;
          cleanupUIState();
        }
      }
    }
  });
  
  // Store initial hash
  window.lastKnownHash = document.location.hash;
  
  // Observe body element for changes
  observer.observe(document.body, { childList: true, subtree: true });
  
  return () => observer.disconnect();
};

// Detect touch devices and add a class
export const detectTouchDevice = () => {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
  }
};

// Clean up any stuck transitions, animations, or effects
export const cleanupAnimationEffects = () => {
  // Find elements with infinite animations and disable them temporarily
  const animatedElements = document.querySelectorAll('.animate-pulse, .animate-spin, .animate-ping');
  animatedElements.forEach(el => {
    el.classList.add('animation-paused');
    
    // Re-enable after a short delay
    setTimeout(() => {
      el.classList.remove('animation-paused');
    }, 10);
  });
};

// Declare global variable for TypeScript 
declare global {
  interface Window {
    lastKnownHash: string;
  }
}
