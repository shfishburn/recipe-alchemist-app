
import React, { useState, useEffect, useRef, memo } from 'react';
import { useLocation } from 'react-router-dom';

export const LoadingIndicator = memo(function LoadingIndicator() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
      if (completionTimerRef.current) {
        window.clearTimeout(completionTimerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Start loading when location changes
    const startLoading = () => {
      // Clear any existing timers
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
      if (completionTimerRef.current) {
        window.clearTimeout(completionTimerRef.current);
      }
      
      setIsLoading(true);
      setProgress(0);
      
      // Initial progress jump using requestAnimationFrame
      window.requestAnimationFrame(() => {
        setProgress(30);
      });
      
      // Use less frequent updates (200ms instead of 150ms)
      progressTimerRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          // More efficient progress calculation
          return Math.min(90, prev + Math.max(1, (90 - prev) / 15));
        });
      }, 200);
      
      // Fallback completion after 3 seconds
      completionTimerRef.current = window.setTimeout(completeLoading, 3000);
    };
    
    const completeLoading = () => {
      // Clean up interval
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      
      // Set to 100% with requestAnimationFrame
      window.requestAnimationFrame(() => {
        setProgress(100);
        
        // Hide after animation completes
        const hideTimer = window.setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 300);
        
        return () => window.clearTimeout(hideTimer);
      });
    };

    // Start loading on location change
    startLoading();
    
    // Use passive event listeners to improve performance
    const handleLoad = () => {
      if (document.readyState === 'complete') {
        completeLoading();
      }
    };
    
    window.addEventListener('load', handleLoad, { passive: true });
    document.addEventListener('readystatechange', handleLoad, { passive: true });
    
    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('readystatechange', handleLoad);
      
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
      if (completionTimerRef.current) {
        window.clearTimeout(completionTimerRef.current);
      }
    };
  }, [location]);

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
            ? 'transform 0.2s ease-out' 
            : 'transform 0.1s ease-out, opacity 0.3s ease-out',
          willChange: 'transform, opacity'
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
});

export default LoadingIndicator;
