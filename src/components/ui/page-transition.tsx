
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
  
  useEffect(() => {
    if (location !== displayLocation) {
      // Store current scroll position before transition
      if (window.history.state && typeof window.history.state.scroll === 'number') {
        sessionStorage.setItem(`scroll_${displayLocation.pathname}`, window.history.state.scroll.toString());
      } else {
        sessionStorage.setItem(`scroll_${displayLocation.pathname}`, window.scrollY.toString());
      }
      
      // If we have a container reference, store its height to prevent layout shifts
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        containerRef.current.style.minHeight = `${height}px`;
      }
      
      // Start exit animation
      setTransitionStage("fadeOut");
      
      // After exit animation completes, update location and start entry animation
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
        
        // After entry animation, restore scroll and reset min-height
        const scrollTimeout = setTimeout(() => {
          // Restore scroll position for new page
          const savedScrollY = sessionStorage.getItem(`scroll_${location.pathname}`);
          if (savedScrollY) {
            window.scrollTo({ top: parseInt(savedScrollY), behavior: 'instant' });
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
          
          // Reset min-height after scroll is restored
          if (containerRef.current) {
            containerRef.current.style.minHeight = '';
          }
        }, 350); // Wait slightly longer than animation duration
        
        return () => clearTimeout(scrollTimeout);
      }, 300); // Match the animation duration
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  // Scroll to top immediately when component mounts
  useEffect(() => {
    // Only scroll to top on initial page load, not for transitions
    if (location.pathname === displayLocation.pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`page-transition ${transitionStage}`}
    >
      {children}
    </div>
  );
};
