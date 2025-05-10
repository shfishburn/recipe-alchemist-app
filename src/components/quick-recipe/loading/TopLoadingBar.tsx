
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
  
  // Start loading bar on component mount with better reliability
  useEffect(() => {
    if (!hasMountedRef.current && loadingRef.current) {
      // Start with a fixed value for immediate feedback
      loadingRef.current.staticStart(30);
      
      // More reliable continuous loading with a slight delay
      const timerId = setTimeout(() => {
        if (loadingRef.current) {
          loadingRef.current.continuousStart(0, 500); // Lower interval for better mobile performance
        }
      }, 50);
      
      hasMountedRef.current = true;
      
      return () => clearTimeout(timerId);
    }
    
    // Complete the loading bar when recipe generation is done
    if ((completedLoading || showFinalAnimation) && loadingRef.current) {
      loadingRef.current.complete();
    }
    
    return () => {
      // Ensure loading bar is completed when component unmounts
      if (loadingRef.current) {
        loadingRef.current.complete();
      }
    };
  }, [completedLoading, showFinalAnimation]);
  
  // Update progress based on percentComplete when available
  useEffect(() => {
    if (loadingState?.percentComplete > 0 && loadingRef.current && !completedLoading && !showFinalAnimation) {
      // Make progress seem faster and more responsive
      const targetProgress = Math.min(95, loadingState.percentComplete + 5);
      loadingRef.current.setProgress(targetProgress);
    }
  }, [loadingState.percentComplete, completedLoading, showFinalAnimation]);

  return (
    <LoadingBar 
      color={color} 
      height={height} 
      ref={loadingRef} 
      shadow={true}
      className="z-[102]" // Higher z-index to ensure visibility
    />
  );
}
