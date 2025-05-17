
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/types/recipe';
import { DisplayIngredient } from './DisplayIngredient';
import { ingredientToReactNode } from '@/utils/react-node-helpers';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export function CookingMode({ recipe, onClose }: CookingModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = recipe.instructions?.length || 0;

  // Get the current instruction
  const currentInstruction = recipe.instructions?.[currentStep] || "";

  // Determine which ingredients are needed for the current step
  const getCurrentStepIngredients = () => {
    const instruction = currentInstruction.toLowerCase();
    
    // Return ingredients that are mentioned in the current step
    return recipe.ingredients.filter(ing => {
      const itemName = typeof ing.item === 'string' 
        ? ing.item.toLowerCase() 
        : ing.item?.name?.toLowerCase() || '';
      
      return instruction.includes(itemName);
    });
  };

  const currentIngredients = getCurrentStepIngredients();

  const goToPreviousStep = () => {
    setCurrentStep(prevStep => Math.max(0, prevStep - 1));
  };

  const goToNextStep = () => {
    setCurrentStep(prevStep => Math.min(totalSteps - 1, prevStep + 1));
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold truncate">{recipe.title}</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-recipe-green h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Step {currentStep + 1} of {totalSteps}
        </div>

        {/* Current step */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-lg leading-relaxed">{currentInstruction}</p>
        </div>

        {/* Ingredients for this step */}
        {currentIngredients.length > 0 && (
          <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-sm font-semibold mb-3">Ingredients for this step:</h3>
            <div className="space-y-2">
              {currentIngredients.map((ing, idx) => (
                <DisplayIngredient
                  key={idx}
                  qty={ing.qty || ing.qty_metric || 0}
                  unit={ing.unit || ing.unit_metric || ''}
                  item={ingredientToReactNode(ing.item)}
                  notes={ing.notes}
                />
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            onClick={goToPreviousStep} 
            disabled={currentStep === 0}
            variant="outline"
            className="w-28"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            onClick={goToNextStep} 
            disabled={currentStep === totalSteps - 1}
            className="w-28 bg-recipe-green hover:bg-recipe-green/90"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
