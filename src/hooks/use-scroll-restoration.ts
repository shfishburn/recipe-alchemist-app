
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollRestoration() {
  const { pathname } = useLocation();
  
  // This hook now focuses only on storing scroll positions during navigation events
  // The actual restoration is handled in the PageTransition component
  useEffect(() => {
    // Save position when page is unloaded/navigated away from
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);
}
