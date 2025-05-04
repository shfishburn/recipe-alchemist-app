
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
    // Don't trigger transition on first render
    if (location.pathname === displayLocation.pathname && 
        location.search === displayLocation.search) {
      return;
    }
    
    if (location !== displayLocation) {
      // Store scroll position before transition
      const currentPosition = window.scrollY;
      const currentPath = displayLocation.pathname;
      try {
        sessionStorage.setItem(`scroll_${currentPath}`, currentPosition.toString());
      } catch (e) {
        console.error("Failed to store scroll position:", e);
      }
      
      // Clean up any UI elements before transition
      cleanupUIState();
      
      // Start exit animation
      setTransitionStage("fadeOut");
      
      const updateLocation = () => {
        // Update location
        setDisplayLocation(location);
        // Start entry animation
        setTransitionStage("fadeIn");
      };
      
      // Use requestAnimationFrame for smoother transitions
      const transitionTimeout = setTimeout(() => {
        window.requestAnimationFrame(updateLocation);
      }, 200); // Slightly shorter duration for better perceived performance
      
      return () => {
        clearTimeout(transitionTimeout);
        window.cancelAnimationFrame = window.cancelAnimationFrame || function(id) {
          clearTimeout(id);
        };
      };
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
