
import React, { useState, useEffect, useRef, memo } from 'react';
import { useLocation } from 'react-router-dom';

export const LoadingIndicator = memo(function LoadingIndicator() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  
  // Clear any existing timers when component unmounts
  useEffect(() => {
    return () => {
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
        setProgress(30);
      }, 50);
      
      // Progress timer with a more reliable implementation
      progressTimerRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          // More linear, predictable progress
          return Math.min(90, prev + 3);
        });
      }, 200);
      
      // Force completion after a reasonable timeout (3 seconds)
      completionTimerRef.current = window.setTimeout(completeLoading, 3000);
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
        setIsLoading(false);
        setProgress(0);
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
      className="nprogress-container" 
      aria-hidden="true" 
      role="presentation"
    >
      <div 
        className="nprogress-bar hw-accelerated" 
        style={{ 
          transform: `translateX(${progress - 100}%)`,
          transition: 'transform 0.2s ease-out'
        }}
      />
    </div>
  );
});

// Legacy default export for compatibility
export default LoadingIndicator;
