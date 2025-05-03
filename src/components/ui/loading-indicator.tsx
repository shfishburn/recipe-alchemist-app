
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function LoadingIndicator() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset and start loading on location change
    setIsLoading(true);
    setProgress(0);
    
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }
    
    // Start initial animation
    const initialTimer = setTimeout(() => {
      setProgress(30);
    }, 50);
    
    // Track actual loading progress using document readiness and timing
    const documentStates = {
      loading: 30,
      interactive: 75,
      complete: 100
    };
    
    // Initial progress based on current document state
    setProgress(documentStates[document.readyState as keyof typeof documentStates] || 0);
    
    // Listen for document state changes
    const updateProgress = () => {
      const newProgress = documentStates[document.readyState as keyof typeof documentStates] || 100;
      
      // Use requestAnimationFrame for smoother progress updates
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        setProgress(newProgress);
        
        // Hide the indicator after a short delay when complete
        if (document.readyState === 'complete') {
          setTimeout(() => {
            setIsLoading(false);
            startTimeRef.current = null;
          }, 300);
        }
      });
    };
    
    document.addEventListener('readystatechange', updateProgress);
    
    // Fallback to ensure the progress bar completes eventually
    // Use timing-based approach for smoother animation
    let progressInterval: number | null = null;
    
    if (typeof window !== 'undefined') {
      progressInterval = window.setInterval(() => {
        if (progress < 90) {
          // Calculate natural progression based on time elapsed
          const elapsed = startTimeRef.current ? (performance.now() - startTimeRef.current) / 1000 : 0;
          const naturalProgress = Math.min(90, Math.log(elapsed + 1) * 30);
          
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          
          animationFrameRef.current = requestAnimationFrame(() => {
            setProgress(prev => Math.max(prev, naturalProgress));
          });
        }
      }, 100);
    }
    
    const fallbackTimer = setTimeout(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          startTimeRef.current = null;
        }, 300);
      });
    }, 5000); // Longer timeout for slower connections
    
    // Clean up
    return () => {
      document.removeEventListener('readystatechange', updateProgress);
      clearTimeout(initialTimer);
      clearTimeout(fallbackTimer);
      if (progressInterval) clearInterval(progressInterval);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [location]);

  // Force visibility of loading indicator for debugging
  console.log("LoadingIndicator state:", { isLoading, progress });

  // Don't render anything when not loading
  if (!isLoading) return null;

  return (
    <div className="nprogress-container" aria-hidden="true">
      <div 
        className="nprogress-bar hw-accelerated" 
        style={{ 
          width: `${progress}%`,
          transition: progress < 100 
            ? 'width 0.3s cubic-bezier(0.65, 0, 0.35, 1)' 
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
