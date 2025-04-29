
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function LoadingIndicator() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset and start loading on location change
    setIsLoading(true);
    setProgress(0);
    
    // Track actual loading progress using document readiness
    const documentStates = {
      loading: 20,
      interactive: 60,
      complete: 100
    };
    
    // Initial progress based on current document state
    setProgress(documentStates[document.readyState] || 0);
    
    // Listen for document state changes
    const updateProgress = () => {
      setProgress(documentStates[document.readyState] || 100);
      
      // Hide the indicator after a short delay when complete
      if (document.readyState === 'complete') {
        setTimeout(() => setIsLoading(false), 300);
      }
    };
    
    document.addEventListener('readystatechange', updateProgress);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('readystatechange', updateProgress);
    };
  }, [location]);

  // Don't render anything when not loading
  if (!isLoading) return null;

  return (
    <div className="nprogress-container">
      <div 
        className="nprogress-bar" 
        style={{ 
          width: `${progress}%`,
          transition: progress < 100 ? 'width 0.3s ease-out' : 'width 0.1s ease-out, opacity 0.3s ease-out'
        }}
      />
    </div>
  );
}
