
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
  
  useEffect(() => {
    if (location !== displayLocation) {
      // Store scroll position before transition
      sessionStorage.setItem(`scroll_${displayLocation.pathname}`, window.scrollY.toString());
      
      // Preserve container height to prevent layout shifts
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        containerRef.current.style.minHeight = `${height}px`;
      }
      
      // Start exit animation
      setTransitionStage("fadeOut");
      
      // After exit animation completes, update location and start entry animation
      if (transitionTimeRef.current) clearTimeout(transitionTimeRef.current);
      
      transitionTimeRef.current = window.setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
        
        // Restoration happens in one synchronized step
        transitionTimeRef.current = window.setTimeout(() => {
          // Restore scroll position
          const savedScrollY = sessionStorage.getItem(`scroll_${location.pathname}`);
          
          if (savedScrollY) {
            window.scrollTo(0, parseInt(savedScrollY));
          } else {
            window.scrollTo(0, 0);
          }
          
          // Reset min-height after scroll is restored and animation completes
          if (containerRef.current) {
            containerRef.current.style.minHeight = '';
          }
          
          transitionTimeRef.current = null;
        }, 320); // Slightly longer than the animation to ensure animation completes
      }, 300); // Exactly match animation duration
    }
    
    // Clean up timeouts
    return () => {
      if (transitionTimeRef.current) {
        clearTimeout(transitionTimeRef.current);
      }
    };
  }, [location, displayLocation]);

  // Scroll to top on initial component mount only
  useEffect(() => {
    if (location.pathname === displayLocation.pathname) {
      window.scrollTo(0, 0);
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
