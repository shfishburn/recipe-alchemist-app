
import { useState, useCallback } from 'react';

export interface StepCompletionState {
  completedSteps: {[key: number]: boolean};
  toggleStep: (index: number) => void;
  isStepCompleted: (index: number) => boolean;
  resetAllSteps: () => void;
  markAllStepsCompleted: () => void;
}

/**
 * Custom hook to manage recipe instruction step completion state
 */
export function useStepCompletion(): StepCompletionState {
  const [completedSteps, setCompletedSteps] = useState<{[key: number]: boolean}>({});
  
  const toggleStep = useCallback((index: number) => {
    // Ensure a clean user interaction without UI blocking
    setTimeout(() => {
      setCompletedSteps(prev => ({
        ...prev,
        [index]: !prev[index]
      }));
    }, 0);
  }, []);
  
  const isStepCompleted = useCallback((index: number) => {
    return !!completedSteps[index];
  }, [completedSteps]);
  
  const resetAllSteps = useCallback(() => {
    setCompletedSteps({});
  }, []);
  
  const markAllStepsCompleted = useCallback(() => {
    // Create a new state object with all steps marked as completed
    const allCompleted: {[key: number]: boolean} = {};
    // We don't know the total number of steps, so we use the existing keys and ensure they're all true
    Object.keys(completedSteps).forEach(key => {
      allCompleted[parseInt(key)] = true;
    });
    setCompletedSteps(allCompleted);
  }, [completedSteps]);
  
  return {
    completedSteps,
    toggleStep,
    isStepCompleted,
    resetAllSteps,
    markAllStepsCompleted
  };
}
