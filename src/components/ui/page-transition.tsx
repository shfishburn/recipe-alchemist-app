
import React, { useState, useEffect, useCallback, memo } from "react";
import { useLocation } from "react-router-dom";
import { cleanupUIState } from "@/utils/dom-cleanup";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = memo(function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  
  // Memoize the location change handler for better performance
  const handleLocationChange = useCallback(() => {
    // Skip if path is the same
    if (location.pathname === displayLocation.pathname && 
        location.search === displayLocation.search) {
      return;
    }
    
    // Store scroll position before transition
    const currentPosition = window.scrollY;
    const currentPath = displayLocation.pathname;
    
    try {
      sessionStorage.setItem(`scroll_${currentPath}`, currentPosition.toString());
    } catch (e) {
      // Silent fail for private browsing
    }
    
    // Clean up UI elements before transition
    cleanupUIState();
    
    // Start exit animation
    setTransitionStage("fadeOut");
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      setTimeout(() => {
        // Update location
        setDisplayLocation(location);
        
        // Start entry animation in next frame
        requestAnimationFrame(() => {
          setTransitionStage("fadeIn");
        });
      }, 150); // Shorter duration for better perceived performance
    });
  }, [location, displayLocation]);
  
  // Handle location changes
  useEffect(() => {
    handleLocationChange();
  }, [location, handleLocationChange]);
  
  // Restore scroll position when entering page
  useEffect(() => {
    if (transitionStage === "fadeIn") {
      try {
        const savedPosition = sessionStorage.getItem(`scroll_${location.pathname}`);
        if (savedPosition) {
          // Use microtask for smoother scroll restoration
          queueMicrotask(() => {
            window.scrollTo({
              top: parseInt(savedPosition, 10),
              behavior: 'auto' // Use 'auto' for better performance
            });
          });
        } else {
          window.scrollTo(0, 0);
        }
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  }, [transitionStage, location.pathname]);

  return (
    <div 
      className={`page-transition ${transitionStage} hw-accelerated`}
      aria-live="polite"
      key={displayLocation.pathname}
    >
      {children}
    </div>
  );
});

export default PageTransition;
