
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function LoadingIndicator() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start loading
    setIsLoading(true);
    setProgress(0);
    
    // Use requestAnimationFrame for smoother progress updates
    let frameId: number;
    
    const startProgress = () => {
      // Quick initial progress to 30%
      setTimeout(() => setProgress(30), 50);
      
      // More gradual progress to 80%
      setTimeout(() => {
        let currentProgress = 30;
        
        const incrementProgress = () => {
          if (currentProgress < 80) {
            currentProgress += 1;
            setProgress(currentProgress);
            frameId = requestAnimationFrame(incrementProgress);
          }
        };
        
        frameId = requestAnimationFrame(incrementProgress);
      }, 100);
    };
    
    startProgress();
    
    // Complete loading
    const completeTimeout = setTimeout(() => {
      cancelAnimationFrame(frameId);
      setProgress(100);
      
      const hideTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 200);
      
      return () => clearTimeout(hideTimeout);
    }, 400);

    return () => {
      clearTimeout(completeTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [location]);

  if (!isLoading) return null;

  return (
    <div className="nprogress-container">
      <div 
        className="nprogress-bar" 
        style={{ 
          width: `${progress}%`,
          transition: progress < 100 ? 'width 0.2s ease-out' : 'width 0.1s ease-out'
        }}
      />
    </div>
  );
}
