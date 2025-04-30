
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QuickRecipe } from '@/hooks/use-quick-recipe';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Clock, LightbulbIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickCookingModeProps {
  recipe: QuickRecipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickCookingMode({ recipe, open, onOpenChange }: QuickCookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = recipe.steps.length;
  
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{recipe.title}</DialogTitle>
        </DialogHeader>
        
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1 my-1">
          {recipe.steps.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === currentStep 
                  ? "w-6 bg-recipe-green" 
                  : "w-2 bg-gray-200"
              )}
            />
          ))}
        </div>
        
        <div className="mt-2">
          {/* Time info */}
          <div className="flex items-center justify-start gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span>Total: {recipe.prepTime + recipe.cookTime} min</span>
            <span>|</span>
            <span>Step {currentStep + 1} of {totalSteps}</span>
          </div>
          
          {/* Ingredients (visible on first step) */}
          {currentStep === 0 && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="font-medium mb-1">You'll need:</p>
              <ul className="pl-5 list-disc text-sm space-y-1">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Cooking tip - show if available */}
          {currentStep === 0 && recipe.cookingTip && (
            <div className="mb-4 p-3 bg-recipe-orange/10 rounded-lg">
              <p className="font-medium mb-1 flex items-center gap-1">
                <LightbulbIcon className="h-4 w-4 text-recipe-orange" />
                Chef's Tip:
              </p>
              <p className="text-sm text-muted-foreground">{recipe.cookingTip}</p>
            </div>
          )}
          
          {/* Current Step */}
          <div className="mt-3 p-4 bg-white border rounded-lg shadow-sm">
            <p className="text-lg">{recipe.steps[currentStep]}</p>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="w-24"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Prev
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-24"
          >
            <X className="mr-1 h-4 w-4" /> Close
          </Button>
          
          <Button 
            variant={currentStep === totalSteps - 1 ? "outline" : "default"}
            onClick={handleNext}
            disabled={currentStep === totalSteps - 1}
            className="w-24"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
