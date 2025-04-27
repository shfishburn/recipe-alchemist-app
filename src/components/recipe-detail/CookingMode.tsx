import React, { useState, useEffect } from 'react';
import { ChefHat, Timer, X, ArrowLeft, ArrowRight, Check, Square } from 'lucide-react';
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
import type { Recipe } from '@/hooks/use-recipe-detail';

interface CookingModeProps {
  recipe: Recipe;
}

export function CookingMode({ recipe }: CookingModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  // Initialize completed steps array
  useEffect(() => {
    if (recipe.instructions) {
      setCompletedSteps(new Array(recipe.instructions.length).fill(false));
    }
  }, [recipe.instructions]);
  
  // Timer countdown logic
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => (prev !== null && prev > 0) ? prev - 1 : null);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining]);
  
  // Keep screen on during cooking mode
  useEffect(() => {
    let wakeLock: any = null;
    
    const requestWakeLock = async () => {
      if (isOpen && 'wakeLock' in navigator) {
        try {
          // @ts-ignore - TypeScript doesn't have Wake Lock API types yet
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
  
  // Format time for display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleStepCompletion = (index: number) => {
    const newCompleted = [...completedSteps];
    newCompleted[index] = !newCompleted[index];
    setCompletedSteps(newCompleted);
  };
  
  const startTimer = (minutes: number) => {
    setTimer(minutes);
    setTimeRemaining(minutes * 60);
  };
  
  const cancelTimer = () => {
    setTimer(null);
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
  
  const progressPercentage = 
    recipe.instructions && recipe.instructions.length > 0
      ? ((currentStep + 1) / recipe.instructions.length) * 100
      : 0;
  
  const completedCount = completedSteps.filter(Boolean).length;
  const completionPercentage = 
    completedSteps.length > 0
      ? (completedCount / completedSteps.length) * 100
      : 0;
  
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted hover:text-foreground">
          <ChefHat className="mr-2 h-4 w-4" />
          Cooking Mode
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] flex flex-col">
        <div className="container max-w-3xl mx-auto flex-1 overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="text-xl">Cooking: {recipe.title}</DrawerTitle>
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {recipe.instructions ? recipe.instructions.length : 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {completedCount} of {completedSteps.length} steps completed
              </div>
            </div>
            <Progress value={progressPercentage} className="mt-2" />
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
          
          {/* Ingredients section */}
          <div className="px-4 py-2">
            <h3 className="text-lg font-medium mb-2">Ingredients</h3>
            <div className="rounded-lg border p-4 bg-muted/30">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipe.ingredients && recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="flex-1">
                      <span className="font-medium">{ingredient.qty} {ingredient.unit}</span> {ingredient.item}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Current step */}
          <div className="px-4 py-8">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Step {currentStep + 1}</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleStepCompletion(currentStep)}
                >
                  {completedSteps[currentStep] ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Square className="h-4 w-4 mr-1" />
                  )}
                  {completedSteps[currentStep] ? "Completed" : "Mark Complete"}
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border p-6 bg-background">
              <p className="text-xl leading-relaxed">
                {recipe.instructions && recipe.instructions[currentStep]}
              </p>
            </div>
            
            {/* Timer section */}
            <div className="mt-8 flex flex-col items-center">
              {timeRemaining !== null ? (
                <div className="p-6 rounded-lg border text-center w-full">
                  <div className="text-3xl font-bold mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={cancelTimer}
                  >
                    Stop Timer
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button variant="outline" onClick={() => startTimer(1)}>
                    <Timer className="h-4 w-4 mr-2" />
                    1 min
                  </Button>
                  <Button variant="outline" onClick={() => startTimer(3)}>
                    <Timer className="h-4 w-4 mr-2" />
                    3 min
                  </Button>
                  <Button variant="outline" onClick={() => startTimer(5)}>
                    <Timer className="h-4 w-4 mr-2" />
                    5 min
                  </Button>
                  <Button variant="outline" onClick={() => startTimer(10)}>
                    <Timer className="h-4 w-4 mr-2" />
                    10 min
                  </Button>
                </div>
              )}
            </div>
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
              <Progress value={completionPercentage} className="w-24 h-2" />
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
