
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      setTransitionStage("fadeOut");
      
      // Shorter fadeOut for a more responsive feel
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
        
        // Reset transitioning state after fadeIn completes
        const fadeInTimeout = setTimeout(() => {
          setIsTransitioning(false);
        }, 300); // Match the fadeIn duration in CSS
        
        return () => clearTimeout(fadeInTimeout);
      }, 150); // Duration should match the CSS fadeOut transition
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div 
      className={`page-transition ${transitionStage}`}
      style={{ 
        minHeight: isTransitioning ? "100vh" : "auto",
        position: "relative"
      }}
    >
      {children}
    </div>
  );
};
