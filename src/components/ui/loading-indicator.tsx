
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
    
    // Simulate progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 200);
    const timer3 = setTimeout(() => setProgress(80), 300);
    
    // Complete loading
    const timer4 = setTimeout(() => {
      setProgress(100);
      const timer5 = setTimeout(() => setIsLoading(false), 200);
      return () => clearTimeout(timer5);
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [location]);

  if (!isLoading) return null;

  return (
    <div className="nprogress-container">
      <div 
        className="nprogress-bar" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
