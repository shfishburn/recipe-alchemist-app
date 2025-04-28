
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollRestoration() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Save position when navigating away using history
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
    };
    
    // Save scroll on window events
    window.addEventListener('beforeunload', handleBeforeUnload, { passive: true });
    
    // Save current scroll position periodically
    const scrollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(scrollInterval);
    };
  }, [pathname]);
}
