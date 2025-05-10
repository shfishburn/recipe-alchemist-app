
import React, { useRef, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

interface TopLoadingBarProps {
  color?: string;
  height?: number;
  showFinalAnimation?: boolean;
}

export function TopLoadingBar({ 
  color = "#4CAF50", 
  height = 3,
  showFinalAnimation = false
}: TopLoadingBarProps) {
  const loadingRef = useRef<any>(null);
  const { loadingState, completedLoading } = useQuickRecipeStore();
  const hasMountedRef = useRef(false);
  const progressSetRef = useRef(false);
  
  // Start loading bar on component mount
  useEffect(() => {
    if (!hasMountedRef.current && loadingRef.current) {
      try {
        // Start with a fixed value for immediate feedback
        loadingRef.current.staticStart(30);
        hasMountedRef.current = true;
        
        // More reliable continuous loading - use setTimeout to ensure the ref is available
        const timerId = setTimeout(() => {
          if (loadingRef.current) {
            try {
              loadingRef.current.continuousStart(0, 1000);
            } catch (err) {
              console.error("Error starting continuous loading:", err);
            }
          }
        }, 300);
        
        return () => clearTimeout(timerId);
      } catch (err) {
        console.error("Error initializing loading bar:", err);
      }
    }
    
    // Complete the loading bar when recipe generation is done
    if ((completedLoading || showFinalAnimation) && loadingRef.current) {
      try {
        loadingRef.current.complete();
      } catch (err) {
        console.error("Error completing loading bar:", err);
      }
    }
    
    return () => {
      // Ensure loading bar is completed when component unmounts
      if (loadingRef.current) {
        try {
          loadingRef.current.complete();
        } catch (err) {
          console.error("Error cleaning up loading bar:", err);
        }
      }
    };
  }, [completedLoading, showFinalAnimation]);
  
  // Update progress based on percentComplete when available
  useEffect(() => {
    if (loadingState?.percentComplete > 0 && loadingRef.current && !completedLoading && !showFinalAnimation && hasMountedRef.current) {
      try {
        // Ensure progress is always moving forward
        // Add +10 to make progress seem faster and more responsive
        const targetProgress = Math.max(30, Math.min(95, loadingState.percentComplete + 10));
        
        // Safely set progress only if the method exists
        if (typeof loadingRef.current.setProgress === 'function') {
          loadingRef.current.setProgress(targetProgress);
          progressSetRef.current = true;
        } else if (!progressSetRef.current) {
          console.warn("LoadingBar setProgress method not available yet");
        }
      } catch (err) {
        console.error("Error updating loading progress:", err);
      }
    }
  }, [loadingState.percentComplete, completedLoading, showFinalAnimation]);

  return (
    <LoadingBar 
      color={color} 
      height={height} 
      ref={loadingRef} 
      shadow={true}
      className="z-50"
    />
  );
}
