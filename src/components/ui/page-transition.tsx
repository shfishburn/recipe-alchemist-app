
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
  
  // Memoize the location change handler
  const handleLocationChange = useCallback(() => {
    // Don't transition if the page is the same (e.g. query param changes)
    if (location.pathname === displayLocation.pathname && 
        location.search === displayLocation.search) {
      return;
    }
    
    try {
      // Store scroll position before transition
      const currentPosition = window.scrollY;
      const currentPath = displayLocation.pathname;
      
      try {
        sessionStorage.setItem(`scroll_${currentPath}`, currentPosition.toString());
      } catch (e) {
        // Silent fail if sessionStorage is unavailable
      }
      
      // Check if there's an active loading overlay - don't interfere with it
      const hasLoadingOverlay = document.querySelector('.loading-overlay');
      const hasLoadingTrigger = document.querySelector('.loading-overlay-active');
      if (hasLoadingOverlay || hasLoadingTrigger) {
        console.log('Page transition detected active loading overlay - skipping cleanup and animation');
        // Just update location without animation when loading is active
        setDisplayLocation(location);
        return;
      }
      
      // Only clean up UI if there's no active loading overlay
      cleanupUIState();
      
      // Start exit animation
      setTransitionStage("fadeOut");
      
      // Use requestAnimationFrame for smoother transitions
      const transitionTimeout = setTimeout(() => {
        window.requestAnimationFrame(() => {
          // Update location
          setDisplayLocation(location);
          // Start entry animation in the next frame for better performance
          window.requestAnimationFrame(() => {
            setTransitionStage("fadeIn");
          });
        });
      }, 180); // Slightly shorter duration for better perceived performance
      
      return () => {
        clearTimeout(transitionTimeout);
      };
    } catch (err) {
      // Fallback in case of errors - just update immediately
      console.error("Transition error:", err);
      setDisplayLocation(location);
      setTransitionStage("fadeIn");
    }
  }, [location, displayLocation]);
  
  // Handle location changes
  useEffect(() => {
    handleLocationChange();
  }, [location, handleLocationChange]);
  
  // Restore scroll position when entering a page
  useEffect(() => {
    if (transitionStage === "fadeIn") {
      try {
        const savedPosition = sessionStorage.getItem(`scroll_${location.pathname}`);
        if (savedPosition) {
          window.setTimeout(() => {
            window.scrollTo(0, parseInt(savedPosition, 10));
          }, 0);
        } else {
          window.scrollTo(0, 0);
        }
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  }, [transitionStage, location.pathname]);

  // Add a console.log to track page transitions
  console.log(`Page transition: ${displayLocation.pathname} (stage: ${transitionStage})`);

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
