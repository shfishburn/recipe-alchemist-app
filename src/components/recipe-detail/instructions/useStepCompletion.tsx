import { useState, useCallback } from 'react';

export interface StepCompletionState {
  completedSteps: {[key: number]: boolean};
  toggleStep: (index: number) => void;
  isStepCompleted: (index: number) => boolean;
  resetAllSteps: () => void;
  markAllStepsCompleted: (totalSteps?: number) => void;
  completedCount: number;
  totalCompletedPercentage: (total: number) => number;
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
  
  const markAllStepsCompleted = useCallback((totalSteps?: number) => {
    // If totalSteps is provided, we can create a new state with all steps marked completed
    if (typeof totalSteps === 'number') {
      const newState: {[key: number]: boolean} = {};
      for (let i = 0; i < totalSteps; i++) {
        newState[i] = true;
      }
      setCompletedSteps(newState);
      return;
    }
    
    // Otherwise use the existing keys
    const allCompleted: {[key: number]: boolean} = {};
    Object.keys(completedSteps).forEach(key => {
      allCompleted[parseInt(key)] = true;
    });
    setCompletedSteps(allCompleted);
  }, [completedSteps]);
  
  // Calculate how many steps are completed
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  
  // Calculate percentage of steps completed
  const totalCompletedPercentage = useCallback((total: number) => {
    if (total === 0) return 0;
    return (completedCount / total) * 100;
  }, [completedCount]);
  
  return {
    completedSteps,
    toggleStep,
    isStepCompleted,
    resetAllSteps,
    markAllStepsCompleted,
    completedCount,
    totalCompletedPercentage
  };
}
