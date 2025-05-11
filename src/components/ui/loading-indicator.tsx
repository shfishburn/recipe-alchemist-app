
import React, { useState, useEffect, useRef, memo } from 'react';
import { useLocation } from 'react-router-dom';

export const LoadingIndicator = memo(function LoadingIndicator() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true); // Start with loading active
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const isMounted = useRef(true);
  
  // Clean up any existing timers when component unmounts
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Start loading when location changes
    const startLoading = () => {
      // Clear any existing timers
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
      }
      
      setIsLoading(true);
      setProgress(0);
      
      // Initial progress jump to give feeling of responsiveness
      setTimeout(() => {
        if (!isMounted.current) return;
        setProgress(30);
      }, 50);
      
      // Progress timer with a more reliable implementation
      progressTimerRef.current = window.setInterval(() => {
        if (!isMounted.current) return;
        setProgress(prev => {
          if (prev >= 90) return prev;
          // More linear, predictable progress
          return Math.min(90, prev + 3);
        });
      }, 200);
      
      // Force completion after a reasonable timeout (3 seconds)
      completionTimerRef.current = window.setTimeout(() => {
        if (isMounted.current) {
          completeLoading();
        }
      }, 3000);
    };
    
    const completeLoading = () => {
      // Clean up interval
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      
      // Set to 100% and hide after animation completes
      setProgress(100);
      
      setTimeout(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }, 300);
    };

    // Start loading on location change
    startLoading();
    
    // Set up listener for page load completion
    const handleLoad = () => {
      if (document.readyState === 'complete') {
        completeLoading();
      }
    };
    
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('load', handleLoad);
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
      }
    };
  }, [location]);

  // Don't render anything when not loading
  if (!isLoading) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-1" 
      aria-hidden="true" 
      role="presentation"
    >
      <div 
        className="h-full bg-recipe-green hw-accelerated" 
        style={{ 
          transform: `translateX(${progress - 100}%)`,
          transition: 'transform 0.2s ease-out',
          minWidth: '5%',
          boxShadow: '0 0 8px rgba(76, 175, 80, 0.5)'
        }}
      />
    </div>
  );
});

// Legacy default export for compatibility
export default LoadingIndicator;
