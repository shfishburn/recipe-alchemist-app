
import React from 'react';
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
import { useCookingMode } from '@/hooks/use-cooking-mode';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface CookingModeProps {
  recipe: Recipe;
}

export function CookingMode({ recipe }: CookingModeProps) {
  // Use our custom hook to manage all cooking mode state and logic
  const {
    state,
    actions,
    totalSteps,
    completedCount,
    currentStepObject,
    timer
  } = useCookingMode(recipe);
  
  const { currentStep, completedSteps, isOpen } = state;
  const { toggleStepCompletion, goToNextStep, goToPrevStep, setIsOpen } = actions;
  const { timeRemaining, startTimer, cancelTimer, isLowTime } = timer;
  
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
            isLowTime={isLowTime}
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
