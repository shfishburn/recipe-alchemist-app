import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import type { RecipeStep } from '@/types/recipe-steps';
import { useRecipeScience, getStepReaction } from '@/hooks/use-recipe-science';

interface CookingModeState {
  currentStep: number;
  completedSteps: boolean[];
  timeRemaining: number | null;
  isOpen: boolean;
}

interface CookingModeActions {
  toggleStepCompletion: (index: number) => void;
  startTimer: (minutes: number) => void;
  cancelTimer: () => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  setIsOpen: (value: boolean) => void;
}

interface CookingModeResult {
  state: CookingModeState;
  actions: CookingModeActions;
  totalSteps: number;
  completedCount: number;
  currentStepObject: RecipeStep | null;
  stepReactions: ReturnType<typeof useRecipeScience>['stepReactions'];
}

export function useCookingMode(recipe: Recipe): CookingModeResult {
  // State hooks
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  // Recipe science data
  const { stepReactions } = useRecipeScience(recipe);
  
  // Initialize completed steps array when recipe changes
  useEffect(() => {
    if (recipe.instructions) {
      setCompletedSteps(new Array(recipe.instructions.length).fill(false));
    }
  }, [recipe.instructions]);
  
  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => (prev !== null && prev > 0) ? prev - 1 : null);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining]);
  
  // Keep screen awake during cooking mode
  useEffect(() => {
    let wakeLock: any = null;
    
    const requestWakeLock = async () => {
      if (isOpen && 'wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error('Wake Lock error:', err);
        }
      }
    };
    
    requestWakeLock();
    
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(console.error);
      }
    };
  }, [isOpen]);
  
  // Handler functions
  const toggleStepCompletion = (index: number) => {
    const newCompleted = [...completedSteps];
    newCompleted[index] = !newCompleted[index];
    setCompletedSteps(newCompleted);
  };
  
  const startTimer = (minutes: number) => {
    setTimeRemaining(minutes * 60);
  };
  
  const cancelTimer = () => {
    setTimeRemaining(null);
  };
  
  const goToNextStep = () => {
    if (recipe.instructions && currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Calculate derived values
  const totalSteps = recipe.instructions?.length || 0;
  const completedCount = completedSteps.filter(Boolean).length;
  
  // Create formatted step object for the current step
  const getCurrentStepObject = (): RecipeStep | null => {
    if (!recipe.instructions || !recipe.instructions[currentStep]) {
      return null;
    }
    
    const stepText = recipe.instructions[currentStep];
    const stepReaction = getStepReaction(stepReactions, currentStep);
    
    return {
      text: stepText,
      index: currentStep,
      isCompleted: completedSteps[currentStep],
      reaction: stepReaction
    };
  };
  
  const currentStepObject = getCurrentStepObject();
  
  return {
    state: {
      currentStep,
      completedSteps,
      timeRemaining,
      isOpen
    },
    actions: {
      toggleStepCompletion,
      startTimer,
      cancelTimer,
      goToNextStep,
      goToPrevStep,
      setIsOpen
    },
    totalSteps,
    completedCount,
    currentStepObject,
    stepReactions
  };
}
