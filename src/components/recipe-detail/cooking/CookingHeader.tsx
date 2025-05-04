
import React from 'react';
import { DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { CookingProgress } from './CookingProgress';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface CookingHeaderProps {
  recipe: Recipe;
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

export function CookingHeader({ 
  recipe, 
  currentStep,
  totalSteps,
  completedSteps
}: CookingHeaderProps) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-xl">Cooking: {recipe.title}</DrawerTitle>
        <CookingProgress 
          currentStep={currentStep}
          totalSteps={totalSteps}
          completedSteps={completedSteps}
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
    </>
  );
}
