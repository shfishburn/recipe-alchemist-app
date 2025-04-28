
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollRestoration() {
  const { pathname } = useLocation();
  
  // Store scroll position for each route
  const saveScrollPosition = (url: string) => {
    const scrollY = window.scrollY;
    sessionStorage.setItem(`scroll_${url}`, scrollY.toString());
  };
  
  // Restore scroll position for the current route
  const restoreScrollPosition = (url: string) => {
    const scrollY = sessionStorage.getItem(`scroll_${url}`);
    if (scrollY) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollY));
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };
  
  useEffect(() => {
    // When navigating to a new page
    restoreScrollPosition(pathname);
    
    // Save position when leaving the page
    const handleBeforeUnload = () => {
      saveScrollPosition(pathname);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      saveScrollPosition(pathname);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);
}
