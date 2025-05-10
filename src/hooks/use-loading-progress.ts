
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

// Maximum time to wait before showing error (in seconds)
export const MAX_LOADING_TIME = 40;

// Time before showing timeout warning (in ms)
const TIMEOUT_WARNING_TIME = 8000;

export function useLoadingProgress() {
  const { loadingState, updateLoadingState, setError, completedLoading, setCompletedLoading } = useQuickRecipeStore();
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutWarningRef = useRef<NodeJS.Timeout | null>(null);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showFinalAnimation, setShowFinalAnimation] = useState(false);

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

  // Update progress every second
  useEffect(() => {
    // Clear any existing timers first
    cleanupAllTimers();
    
    // Set a default estimated time if not provided
    const initialEstimate = loadingState.estimatedTimeRemaining || 15;
    
    console.log('Setting up progress timer with estimate:', initialEstimate);
    const startTime = Date.now();
    
    progressTimerRef.current = setInterval(() => {
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
        console.log('Progress timer: showing completion animation');
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
  }, [loadingState.estimatedTimeRemaining, updateLoadingState, completedLoading, setCompletedLoading, loadingState.percentComplete]);
  
  // Cycle through loading steps
  useEffect(() => {
    // Clear any existing step timer
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
    }
    
    stepTimerRef.current = setInterval(() => {
      updateLoadingState({
        step: (loadingState.step + 1) % LOADING_STEPS.length,
        stepDescription: LOADING_STEPS[(loadingState.step + 1) % LOADING_STEPS.length]
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
      console.log("Timeout warning triggered");
      if (!completedLoading) {
        setShowTimeout(true);
      }
    }, TIMEOUT_WARNING_TIME);
    
    // Set a timeout to prevent infinite loading state
    timeoutTimerRef.current = setTimeout(() => {
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
