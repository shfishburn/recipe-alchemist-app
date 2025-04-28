
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollRestoration() {
  const { pathname } = useLocation();
  const lastPathRef = useRef(pathname);
  
  // Store scroll position for each route
  const saveScrollPosition = (url: string) => {
    const scrollY = window.scrollY;
    sessionStorage.setItem(`scroll_${url}`, scrollY.toString());
  };
  
  // Restore scroll position for the current route
  const restoreScrollPosition = (url: string) => {
    const scrollY = sessionStorage.getItem(`scroll_${url}`);
    
    // Use smoother scroll behavior
    if (scrollY) {
      // Small delay to ensure DOM is ready and transition is complete
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(scrollY),
          behavior: 'instant' // Use instant to prevent competing animations
        });
      }, 100);
    } else {
      // Scroll to top for new pages
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  };
  
  useEffect(() => {
    // When navigating to a new page
    if (lastPathRef.current !== pathname) {
      // Save position of the previous page
      saveScrollPosition(lastPathRef.current);
      
      // Update the last path reference
      lastPathRef.current = pathname;
      
      // Restore position of the new page
      restoreScrollPosition(pathname);
    }
    
    // Save position when leaving the page
    const handleBeforeUnload = () => {
      saveScrollPosition(pathname);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);
}
