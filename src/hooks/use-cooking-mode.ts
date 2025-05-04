import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import type { RecipeStep } from '@/types/recipe-steps';
import { useRecipeScience, getStepReaction } from '@/hooks/use-recipe-science';
import { useTimer } from '@/hooks/use-timer';

interface CookingModeState {
  currentStep: number;
  completedSteps: boolean[];
  isOpen: boolean;
}

interface CookingModeActions {
  toggleStepCompletion: (index: number) => void;
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
  timer: ReturnType<typeof useTimer>;
}

export function useCookingMode(recipe: Recipe): CookingModeResult {
  // State hooks
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  
  // Timer state from our custom hook
  const timer = useTimer();
  
  // Recipe science data
  const { stepReactions } = useRecipeScience(recipe);
  
  // Initialize completed steps array when recipe changes
  useEffect(() => {
    if (recipe.instructions) {
      setCompletedSteps(new Array(recipe.instructions.length).fill(false));
    }
  }, [recipe.instructions]);
  
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
      isOpen
    },
    actions: {
      toggleStepCompletion,
      goToNextStep,
      goToPrevStep,
      setIsOpen
    },
    totalSteps,
    completedCount,
    currentStepObject,
    stepReactions,
    timer
  };
}
