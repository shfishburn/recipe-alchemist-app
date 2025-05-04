
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollRestoration() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // On route change, try to restore scroll position if available
    const savedPosition = sessionStorage.getItem(`scroll_${pathname}`);
    
    if (savedPosition) {
      // Use RAF for smoother scroll restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          top: parseInt(savedPosition, 10),
          behavior: 'auto'
        });
      });
    } else {
      // If no saved position, scroll to top (but not on first load)
      if (performance.navigation.type !== 0) { 
        window.scrollTo(0, 0);
      }
    }
    
    // Save position when navigating away (more efficient with fewer events)
    const savePosition = () => {
      sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
    };
    
    // Use fewer event listeners for better performance
    window.addEventListener('beforeunload', savePosition);
    document.addEventListener('visibilitychange', savePosition);
    
    // Use a more efficient interval (less frequent)
    const scrollInterval = setInterval(savePosition, 3000);
    
    return () => {
      clearInterval(scrollInterval);
      document.removeEventListener('visibilitychange', savePosition);
      window.removeEventListener('beforeunload', savePosition);
      
      // Save the position when leaving this route
      savePosition();
    };
  }, [pathname]);
}
