
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
  const scrollPositionsRef = useRef<Record<string, number>>({});
  
  useEffect(() => {
    if (location !== displayLocation) {
      // Store scroll position before transition
      scrollPositionsRef.current[displayLocation.pathname] = window.scrollY;
      
      // Optimize performance by using will-change
      if (containerRef.current) {
        // Preserve container height to prevent layout shifts
        const height = containerRef.current.offsetHeight;
        containerRef.current.style.minHeight = `${height}px`;
        containerRef.current.style.willChange = 'opacity, transform';
      }
      
      // Start exit animation
      setTransitionStage("fadeOut");
      
      // After exit animation completes, update location and start entry animation
      if (transitionTimeRef.current) clearTimeout(transitionTimeRef.current);
      
      transitionTimeRef.current = window.setTimeout(() => {
        // Batch state updates for better performance
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
        
        // Synchronized restoration
        transitionTimeRef.current = window.setTimeout(() => {
          // Restore scroll position
          const savedScrollY = scrollPositionsRef.current[location.pathname] || 0;
          
          requestAnimationFrame(() => {
            window.scrollTo({
              top: savedScrollY,
              behavior: 'auto' // Use auto for performance
            });
            
            // Reset min-height and will-change after scroll is restored
            if (containerRef.current) {
              containerRef.current.style.minHeight = '';
              // Remove will-change to free up resources
              requestAnimationFrame(() => {
                if (containerRef.current) {
                  containerRef.current.style.willChange = 'auto';
                }
              });
            }
          });
          
          transitionTimeRef.current = null;
        }, 300); // Match animation duration
      }, 280); // Slightly shorter for smoother transitions
    }
    
    // Clean up timeouts
    return () => {
      if (transitionTimeRef.current) {
        clearTimeout(transitionTimeRef.current);
      }
    };
  }, [location, displayLocation]);

  // Scroll to top on initial component mount
  useEffect(() => {
    if (location.pathname === displayLocation.pathname) {
      window.scrollTo(0, 0);
    }
    
    // Handle back/forward navigation to restore scroll position
    const handlePopState = () => {
      const savedPosition = scrollPositionsRef.current[location.pathname];
      if (savedPosition !== undefined) {
        requestAnimationFrame(() => {
          window.scrollTo(0, savedPosition);
        });
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
