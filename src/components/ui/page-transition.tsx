
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
      const currentPosition = window.scrollY;
      const currentPath = displayLocation.pathname;
      sessionStorage.setItem(`scroll_${currentPath}`, currentPosition.toString());
      
      // Start exit animation without changing container height
      setTransitionStage("fadeOut");
      
      // Wait for exit animation to complete
      if (transitionTimeRef.current) clearTimeout(transitionTimeRef.current);
      
      transitionTimeRef.current = window.setTimeout(() => {
        // Update location
        setDisplayLocation(location);
        // Start entry animation
        setTransitionStage("fadeIn");
        
        transitionTimeRef.current = null;
      }, 280);
    }
    
    return () => {
      if (transitionTimeRef.current) {
        clearTimeout(transitionTimeRef.current);
      }
    };
  }, [location, displayLocation]);

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
