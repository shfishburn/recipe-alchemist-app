
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function LoadingIndicator() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Simpler loading approach that's more reliable
    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
      
      // Quick initial progress to show responsiveness
      setTimeout(() => setProgress(30), 50);
      
      // Gradual increases
      progressTimerRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          const increment = Math.max(1, (90 - prev) / 10);
          return Math.min(90, prev + increment);
        });
      }, 200);
    };
    
    const completeLoading = () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      
      setProgress(100);
      
      // Hide after animation completes
      setTimeout(() => setIsLoading(false), 300);
    };

    // Start loading when location changes
    startLoading();
    
    // Set up listener for page load completion
    const handleLoad = () => completeLoading();
    
    // Listen for load event
    window.addEventListener('load', handleLoad);
    
    // Set fallback timer in case load event doesn't fire
    const fallbackTimer = setTimeout(completeLoading, 3000);
    
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      clearTimeout(fallbackTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, [location]);

  // Don't render anything when not loading
  if (!isLoading) return null;

  return (
    <div className="nprogress-container" aria-hidden="true">
      <div 
        className="nprogress-bar hw-accelerated" 
        style={{ 
          width: `${progress}%`,
          transition: progress < 100 
            ? 'width 0.2s ease' 
            : 'width 0.1s ease-out, opacity 0.3s ease-out'
        }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
