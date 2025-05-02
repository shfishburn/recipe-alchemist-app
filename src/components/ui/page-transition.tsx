
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTimeRef = useRef<number | null>(null);
  
  // Use sessionStorage instead of an in-memory object for persistence
  const getScrollPosition = (path: string): number => {
    try {
      const saved = sessionStorage.getItem(`scroll_${path}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  };
  
  const saveScrollPosition = (path: string, position: number) => {
    try {
      sessionStorage.setItem(`scroll_${path}`, position.toString());
    } catch (e) {
      console.error("Error saving scroll position", e);
    }
  };
  
  useEffect(() => {
    if (location !== displayLocation) {
      // Store scroll position before transition
      saveScrollPosition(displayLocation.pathname, window.scrollY);
      
      // Start exit animation without changing container height
      setTransitionStage("fadeOut");
      
      // Wait for exit animation to complete
      if (transitionTimeRef.current) clearTimeout(transitionTimeRef.current);
      
      transitionTimeRef.current = window.setTimeout(() => {
        // Update location
        setDisplayLocation(location);
        // Start entry animation
        setTransitionStage("fadeIn");
        
        // Restore scroll position after a short delay to ensure DOM is updated
        transitionTimeRef.current = window.setTimeout(() => {
          const savedPosition = getScrollPosition(location.pathname);
          window.scrollTo({
            top: savedPosition,
            behavior: 'auto'
          });
          transitionTimeRef.current = null;
        }, 50);
      }, 280);
    }
    
    return () => {
      if (transitionTimeRef.current) {
        clearTimeout(transitionTimeRef.current);
      }
    };
  }, [location, displayLocation]);

  // Handle initial load
  useEffect(() => {
    // Only scroll to top on initial page load
    if (location.pathname === displayLocation.pathname && !getScrollPosition(location.pathname)) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`page-transition ${transitionStage} hw-accelerated`}
      aria-live="polite"
    >
      {children}
    </div>
  );
};
