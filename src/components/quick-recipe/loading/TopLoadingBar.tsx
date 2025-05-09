
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
  
  // Start loading bar on component mount
  useEffect(() => {
    loadingRef.current?.continuousStart();
    
    // Complete the loading bar when recipe generation is done
    if (completedLoading || showFinalAnimation) {
      loadingRef.current?.complete();
    }
    
    return () => {
      // Ensure loading bar is completed when component unmounts
      loadingRef.current?.complete();
    };
  }, [completedLoading, showFinalAnimation]);
  
  // Update progress based on percentComplete when available
  useEffect(() => {
    if (loadingState.percentComplete > 0 && loadingState.percentComplete < 100) {
      loadingRef.current?.setProgress(loadingState.percentComplete);
    }
  }, [loadingState.percentComplete]);

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
