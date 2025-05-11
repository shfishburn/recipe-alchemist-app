
import { useState, useEffect, useRef } from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

// Array of loading step descriptions
export const LOADING_STEPS = [
  "Analyzing your ingredients...",
  "Finding compatible recipes...",
  "Calculating measurements...",
  "Optimizing cooking techniques...",
  "Adding scientific insights...",
  "Finalizing your perfect recipe..."
];

// Configuration constants - consolidated in one place
export const MAX_LOADING_TIME = 40; // Maximum time to wait before showing error (in seconds)
export const TIMEOUT_WARNING_TIME = 8000; // Time before showing timeout warning (in ms)

export function useLoadingProgress() {
  const { loadingState, updateLoadingState, setError, completedLoading, setCompletedLoading } = useQuickRecipeStore();
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutWarningRef = useRef<NodeJS.Timeout | null>(null);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showFinalAnimation, setShowFinalAnimation] = useState(false);
  
  // Track whether the hook is mounted to prevent state updates after unmounting
  const isMounted = useRef(true);

  // Clean up all timers on unmount
  const cleanupAllTimers = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
    if (timeoutWarningRef.current) {
      clearTimeout(timeoutWarningRef.current);
      timeoutWarningRef.current = null;
    }
  };

  // Set up mount/unmount tracking
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      cleanupAllTimers();
    };
  }, []);

  // Update progress - FIXED: Only depends on estimatedTimeRemaining to avoid recreating timers
  useEffect(() => {
    // Clear any existing timers first
    cleanupAllTimers();
    
    // Set a default estimated time if not provided
    const initialEstimate = loadingState.estimatedTimeRemaining || 15;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Setting up progress timer with estimate:', initialEstimate);
    }
    
    const startTime = Date.now();
    
    // Initialize with at least 5% to show something immediately
    if (loadingState.percentComplete === 0) {
      updateLoadingState({ 
        percentComplete: 5 
      });
    }
    
    progressTimerRef.current = setInterval(() => {
      if (!isMounted.current) return;
      
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, initialEstimate - elapsed);
      const percent = Math.min(99, Math.floor(((initialEstimate - remaining) / initialEstimate) * 100));
      
      // Only update if the percent is actually changing
      if (percent !== loadingState.percentComplete) {
        updateLoadingState({ 
          estimatedTimeRemaining: remaining,
          percentComplete: percent 
        });
      }
      
      // If almost done, show completion animation
      if (remaining <= 0.5 && !completedLoading) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Progress timer: showing completion animation');
        }
        
        setCompletedLoading(true);
        // Show final animation
        setShowFinalAnimation(true);
        
        // Clear interval
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
      }
    }, 100);
    
    return cleanupAllTimers;
  }, [loadingState.estimatedTimeRemaining, updateLoadingState, completedLoading, setCompletedLoading]);
  
  // Cycle through loading steps
  useEffect(() => {
    // Clear any existing step timer
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
    }
    
    // Initialize with first step if empty
    if (!loadingState.stepDescription) {
      updateLoadingState({
        step: 0,
        stepDescription: LOADING_STEPS[0]
      });
    }
    
    stepTimerRef.current = setInterval(() => {
      if (!isMounted.current) return;
      
      const nextStep = (loadingState.step + 1) % LOADING_STEPS.length;
      updateLoadingState({
        step: nextStep,
        stepDescription: LOADING_STEPS[nextStep]
      });
    }, 3000);
    
    return () => {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
        stepTimerRef.current = null;
      }
    };
  }, [loadingState.step, updateLoadingState]);

  // Set a timeout warning and timeout error
  useEffect(() => {
    // Clear any existing timers
    if (timeoutWarningRef.current) clearTimeout(timeoutWarningRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    
    // Show a timeout warning after a few seconds
    timeoutWarningRef.current = setTimeout(() => {
      if (!isMounted.current) return;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("Timeout warning triggered");
      }
      
      if (!completedLoading) {
        setShowTimeout(true);
      }
    }, TIMEOUT_WARNING_TIME);
    
    // Set a timeout to prevent infinite loading state
    timeoutTimerRef.current = setTimeout(() => {
      if (!isMounted.current) return;
      
      if (!completedLoading) {
        console.error("Recipe generation timeout after", MAX_LOADING_TIME, "seconds");
        setError("Recipe generation timed out. Please try again.");
      }
    }, MAX_LOADING_TIME * 1000);
    
    return () => {
      if (timeoutWarningRef.current) {
        clearTimeout(timeoutWarningRef.current);
        timeoutWarningRef.current = null;
      }
      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
        timeoutTimerRef.current = null;
      }
    };
  }, [completedLoading, setError]);

  return {
    loadingState,
    showTimeout,
    showFinalAnimation,
    cleanup: cleanupAllTimers
  };
}
