import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { CookingHeader } from './cooking/CookingHeader';
import { CookingIngredientsSection } from './cooking/CookingIngredientsSection';
import { StepContent } from './cooking/StepContent';
import { CookingFooter } from './cooking/CookingFooter';
import { useRecipeScience, getStepReaction } from '@/hooks/use-recipe-science';
import type { Recipe } from '@/hooks/use-recipe-detail';
import type { RecipeStep } from '@/types/recipe-steps';

interface CookingModeProps {
  recipe: Recipe;
}

export function CookingMode({ recipe }: CookingModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  // Use the unified science data hook
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
  
  const completedCount = completedSteps.filter(Boolean).length;
  const totalSteps = recipe.instructions?.length || 0;
  
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
  
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button id="cooking-mode-trigger" className="hidden">Cooking Mode</button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] flex flex-col">
        <div className="container max-w-3xl mx-auto flex-1 overflow-y-auto">
          <CookingHeader 
            recipe={recipe}
            currentStep={currentStep}
            totalSteps={totalSteps}
            completedSteps={completedCount}
          />
          
          <CookingIngredientsSection recipe={recipe} />
          
          <Separator className="my-6" />
          
          <StepContent 
            currentStep={currentStepObject}
            timeRemaining={timeRemaining}
            onToggleComplete={() => toggleStepCompletion(currentStep)}
            onStartTimer={startTimer}
            onCancelTimer={cancelTimer}
          />
        </div>
        
        <CookingFooter
          currentStep={currentStep}
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          onPrevStep={goToPrevStep}
          onNextStep={goToNextStep}
        />
      </DrawerContent>
    </Drawer>
  );
}
