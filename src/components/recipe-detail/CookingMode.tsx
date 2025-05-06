import React, { useState, useEffect } from 'react';
import { ChefHat, Timer, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Timer as TimerComponent } from './cooking/Timer';
import { CookingStep } from './cooking/CookingStep';
import { CookingProgress } from './cooking/CookingProgress';
import { useRecipeScience, getStepReaction } from '@/hooks/use-recipe-science';
import type { Recipe } from '@/hooks/use-recipe-detail';

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
  
  useEffect(() => {
    if (recipe.instructions) {
      setCompletedSteps(new Array(recipe.instructions.length).fill(false));
    }
  }, [recipe.instructions]);
  
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => (prev !== null && prev > 0) ? prev - 1 : null);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining]);
  
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
  
  // Get reaction data for the current step
  const currentStepReaction = getStepReaction(stepReactions, currentStep);
  
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button id="cooking-mode-trigger" className="hidden">Cooking Mode</button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] flex flex-col">
        <div className="container max-w-3xl mx-auto flex-1 overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="text-xl">Cooking: {recipe.title}</DrawerTitle>
            <CookingProgress 
              currentStep={currentStep}
              totalSteps={recipe.instructions?.length || 0}
              completedSteps={completedCount}
            />
          </DrawerHeader>
          
          <div className="px-4 py-2 mb-4">
            <div className="flex gap-4 flex-wrap">
              {recipe.servings && (
                <div className="text-sm">
                  <span className="font-medium">Servings:</span> {recipe.servings}
                </div>
              )}
              {recipe.prep_time_min && (
                <div className="text-sm">
                  <span className="font-medium">Prep:</span> {recipe.prep_time_min} min
                </div>
              )}
              {recipe.cook_time_min && (
                <div className="text-sm">
                  <span className="font-medium">Cook:</span> {recipe.cook_time_min} min
                </div>
              )}
            </div>
          </div>
          
          <div className="px-4 py-2">
            <h3 className="text-lg font-medium mb-2">Ingredients</h3>
            <div className="rounded-lg border p-4 bg-muted/30">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="mb-2 flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      {typeof ingredient.item === 'string' 
                        ? ingredient.item 
                        : JSON.stringify(ingredient.item)}
                      {ingredient.notes && <span className="text-muted-foreground"> ({ingredient.notes})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="px-4 py-8">
            {recipe.instructions && (
              <CookingStep
                stepNumber={currentStep + 1}
                instruction={recipe.instructions[currentStep]}
                isCompleted={completedSteps[currentStep]}
                onToggleComplete={() => toggleStepCompletion(currentStep)}
                stepReaction={currentStepReaction}
              />
            )}
            
            <TimerComponent
              timeRemaining={timeRemaining}
              onStart={startTimer}
              onCancel={cancelTimer}
            />
          </div>
        </div>
        
        <DrawerFooter className="border-t px-4">
          <div className="flex justify-between items-center w-full">
            <Button 
              onClick={goToPrevStep} 
              disabled={currentStep === 0}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {completedCount}/{completedSteps.length} steps
              </span>
              <Progress value={(completedCount / completedSteps.length) * 100} className="w-24 h-2" />
            </div>
            
            <Button 
              onClick={goToNextStep} 
              disabled={recipe.instructions && currentStep === recipe.instructions.length - 1}
              variant={completedSteps[currentStep] ? "default" : "outline"}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
