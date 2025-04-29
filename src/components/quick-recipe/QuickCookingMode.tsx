
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from '@/components/ui/drawer';
import { Progress } from '@/components/ui/progress';
import { Check, ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { QuickRecipe } from '@/hooks/use-quick-recipe';

interface QuickCookingModeProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickCookingMode({ recipe, open, onOpenChange }: QuickCookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(recipe.steps.map(() => false));

  const totalSteps = recipe.steps.length;
  const completedCount = completedSteps.filter(Boolean).length;
  
  const toggleStepComplete = () => {
    const newCompleted = [...completedSteps];
    newCompleted[currentStep] = !newCompleted[currentStep];
    setCompletedSteps(newCompleted);
  };
  
  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl text-center">{recipe.title}</DrawerTitle>
          <Progress value={(completedCount / totalSteps) * 100} className="h-2 mt-2" />
        </DrawerHeader>
        
        <div className="container max-w-md mx-auto px-4 py-8 flex-1 overflow-y-auto">
          <div className="mb-6 grid grid-cols-2 gap-4 text-sm text-center">
            <div className="bg-gray-50 p-2 rounded">
              <span className="block text-muted-foreground">Prep Time</span>
              <span className="font-medium">{recipe.prepTime} min</span>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="block text-muted-foreground">Cook Time</span>
              <span className="font-medium">{recipe.cookTime} min</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-medium mb-2">Ingredients</h3>
            <ul className="space-y-1 pl-2">
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-recipe-blue rounded-full mr-2"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {totalSteps}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className={completedSteps[currentStep] ? "text-green-600" : "text-gray-500"}
                onClick={toggleStepComplete}
              >
                {completedSteps[currentStep] ? <Check className="h-5 w-5" /> : "Mark Done"}
              </Button>
            </div>
            <p className="text-lg">{recipe.steps[currentStep]}</p>
          </div>
        </div>
        
        <DrawerFooter className="border-t">
          <div className="flex justify-between items-center w-full">
            <Button 
              onClick={goToPrevStep} 
              disabled={currentStep === 0}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Prev
            </Button>
            
            <span className="text-center text-sm text-muted-foreground">
              {completedCount}/{totalSteps} Steps
            </span>
            
            <Button 
              onClick={goToNextStep} 
              disabled={currentStep === totalSteps - 1}
              variant={completedSteps[currentStep] ? "default" : "outline"}
              size="sm"
              className={completedSteps[currentStep] ? "bg-recipe-blue" : ""}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
