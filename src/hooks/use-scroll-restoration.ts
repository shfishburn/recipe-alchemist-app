
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollRestoration() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // On route change, try to restore scroll position if available
    const savedPosition = sessionStorage.getItem(`scroll_${pathname}`);
    
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedPosition, 10),
          behavior: 'auto'
        });
      }, 10);
    } else {
      // If no saved position, scroll to top (but not on first load)
      if (performance.navigation.type !== 0) { 
        window.scrollTo(0, 0);
      }
    }
    
    // Save position when navigating away
    const savePosition = () => {
      if (document.visibilityState === 'visible') {
        sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
      }
    };
    
    // Save scroll position periodically and on page visibility changes
    const scrollInterval = setInterval(savePosition, 1000);
    document.addEventListener('visibilitychange', savePosition);
    window.addEventListener('beforeunload', savePosition);
    
    return () => {
      clearInterval(scrollInterval);
      document.removeEventListener('visibilitychange', savePosition);
      window.removeEventListener('beforeunload', savePosition);
      
      // Save the position when leaving this route
      savePosition();
    };
  }, [pathname]);
}
