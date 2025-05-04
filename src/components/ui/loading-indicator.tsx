
import React, { useState, useEffect, useRef, memo } from 'react';
import { useLocation } from 'react-router-dom';

export const LoadingIndicator = memo(function LoadingIndicator() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  
  // Clear timers on mount/unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
      if (completionTimerRef.current) window.clearTimeout(completionTimerRef.current);
    };
  }, []);
  
  // Handle location changes to trigger loading indicator
  useEffect(() => {
    const startLoading = () => {
      // Clean up existing timers
      if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
      if (completionTimerRef.current) window.clearTimeout(completionTimerRef.current);
      
      // Start new loading sequence
      setIsLoading(true);
      setProgress(30); // Initial jump for perceived responsiveness
      
      // Use RAF for smoother animation with optimized intervals
      progressTimerRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          // Gradually slow progress as it approaches 90%
          const increment = Math.max(1, Math.min(5, (90 - prev) / 10));
          return Math.min(90, prev + increment);
        });
      }, 180);
      
      // Fallback completion timer
      completionTimerRef.current = window.setTimeout(completeLoading, 2000);
    };
    
    const completeLoading = () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      
      setProgress(100);
      
      // Hide after animation completes
      window.setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    };

    // Start loading on location change
    startLoading();
    
    // Complete loading when document is ready
    const handleReadyState = () => {
      if (document.readyState === 'complete') {
        completeLoading();
      }
    };
    
    document.addEventListener('readystatechange', handleReadyState);
    window.addEventListener('load', completeLoading);
    
    return () => {
      document.removeEventListener('readystatechange', handleReadyState);
      window.removeEventListener('load', completeLoading);
      
      if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
      if (completionTimerRef.current) window.clearTimeout(completionTimerRef.current);
    };
  }, [location]);

  // Don't render anything when not loading
  if (!isLoading) return null;

  return (
    <div 
      className="nprogress-container" 
      aria-hidden="true"
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

// Default export for compatibility
export default LoadingIndicator;
