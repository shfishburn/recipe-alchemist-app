
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

// Time without progress updates before stalled state (in ms)
const STALLED_THRESHOLD_MS = 7000;

export function useLoadingProgress() {
  const { loadingState, updateLoadingState, setError, completedLoading, setCompletedLoading } = useQuickRecipeStore();
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutWarningRef = useRef<NodeJS.Timeout | null>(null);
  const stalledCheckRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgressUpdateRef = useRef<number>(Date.now());
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
    if (stalledCheckRef.current) {
      clearInterval(stalledCheckRef.current);
      stalledCheckRef.current = null;
    }
  };

  // Check for stalled progress
  useEffect(() => {
    if (stalledCheckRef.current) {
      clearInterval(stalledCheckRef.current);
    }
    
    // Only start checking for stalled state if not completed
    if (!completedLoading && !showFinalAnimation) {
      stalledCheckRef.current = setInterval(() => {
        const now = Date.now();
        const timeSinceUpdate = now - lastProgressUpdateRef.current;
        
        // If we haven't had progress updates for a while, set stalled state
        if (timeSinceUpdate > STALLED_THRESHOLD_MS) {
          console.log(`Progress appears stalled (${timeSinceUpdate}ms since last update)`);
          updateLoadingState({ isStalled: true });
        } else {
          updateLoadingState({ isStalled: false });
        }
      }, 2000); // Check every 2 seconds
    }
    
    return () => {
      if (stalledCheckRef.current) {
        clearInterval(stalledCheckRef.current);
        stalledCheckRef.current = null;
      }
    };
  }, [completedLoading, showFinalAnimation, updateLoadingState]);

  // Update progress every second
  useEffect(() => {
    // Clear any existing timers first
    cleanupAllTimers();
    
    if (!loadingState.estimatedTimeRemaining) return;
    
    const startTime = Date.now();
    const initialEstimate = loadingState.estimatedTimeRemaining;
    
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
        
        // Record time of last progress update
        lastProgressUpdateRef.current = Date.now();
      }
      
      // If almost done, show completion animation
      if (remaining <= 0.5 && !completedLoading) {
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
      
      // Record the time of this update as a progress change
      lastProgressUpdateRef.current = Date.now();
    }, 3000);
    
    return () => {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
        stepTimerRef.current = null;
      }
    };
  }, [loadingState.step, updateLoadingState]);

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    // Clear any existing timers
    if (timeoutWarningRef.current) clearTimeout(timeoutWarningRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    
    // Show a timeout warning after 75% of the maximum time
    timeoutWarningRef.current = setTimeout(() => {
      if (!completedLoading) {
        setShowTimeout(true);
      }
    }, (MAX_LOADING_TIME * 0.75) * 1000);
    
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
