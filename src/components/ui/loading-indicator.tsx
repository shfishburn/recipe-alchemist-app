
import React, { useState, useEffect, useRef, memo } from 'react';
import { useLocation } from 'react-router-dom';

export const LoadingIndicator = memo(function LoadingIndicator() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Clear any existing timers when component mounts or unmounts
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
      requestAnimationFrame(() => {
        setProgress(30);
      });
      
      // Use requestAnimationFrame for smoother animation
      progressTimerRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          // Gradually slow down progress as it approaches 90%
          const increment = Math.max(1, Math.min(5, (90 - prev) / 10));
          return Math.min(90, prev + increment);
        });
      }, 150);
      
      // Fallback completion after 2.5 seconds if page load doesn't complete
      completionTimerRef.current = window.setTimeout(completeLoading, 2500);
    };
    
    const completeLoading = () => {
      // Clean up interval
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      
      // Set to 100%
      setProgress(100);
      
      // Hide after animation completes
      const hideTimer = window.setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
      
      return () => clearTimeout(hideTimer);
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
    
    // Also listen for readystatechange to handle different loading scenarios
    document.addEventListener('readystatechange', handleLoad);
    
    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('readystatechange', handleLoad);
      
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
          transition: progress < 100 
            ? 'transform 0.2s ease-in-out' 
            : 'transform 0.1s ease-out, opacity 0.3s ease-out'
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
});

// Legacy default export for compatibility
export default LoadingIndicator;
