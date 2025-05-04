
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cleanupUIState } from "@/utils/dom-cleanup";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  
  useEffect(() => {
    if (location !== displayLocation) {
      // Store scroll position before transition
      const currentPosition = window.scrollY;
      const currentPath = displayLocation.pathname;
      sessionStorage.setItem(`scroll_${currentPath}`, currentPosition.toString());
      
      // Clean up any UI elements before transition
      cleanupUIState();
      
      // Start exit animation
      setTransitionStage("fadeOut");
      
      // Use single timeout for better performance
      const transitionTimeout = setTimeout(() => {
        // Update location
        setDisplayLocation(location);
        // Start entry animation
        setTransitionStage("fadeIn");
      }, 250);
      
      return () => clearTimeout(transitionTimeout);
    }
  }, [location, displayLocation]);

  return (
    <div 
      className={`page-transition ${transitionStage} hw-accelerated`}
      aria-live="polite"
    >
      {children}
    </div>
  );
};
