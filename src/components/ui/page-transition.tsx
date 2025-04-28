
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
      // Capture the current scroll position and container height
      const currentHeight = containerRef.current?.offsetHeight || 'auto';
      
      setTransitionStage("fadeOut");
      
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 150); // Match fadeOut duration
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div 
      ref={containerRef}
      className={`page-transition ${transitionStage}`}
      style={{ 
        position: "relative",
        minHeight: "auto" // Always use auto to prevent jumping
      }}
    >
      {children}
    </div>
  );
};
