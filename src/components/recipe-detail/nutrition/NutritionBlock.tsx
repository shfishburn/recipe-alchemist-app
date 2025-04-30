
import React from 'react';
import { RecipeBlock } from './blocks/RecipeBlock';
import { PersonalBlock } from './blocks/PersonalBlock';
import { ExtendedNutritionData } from './useNutritionData';

interface NutritionBlockProps {
  recipeNutrition: ExtendedNutritionData;
  viewMode: 'recipe' | 'personal';
  userPreferences?: {
    dailyCalories: number;
    macroSplit: {
      protein: number;
      carbs: number;
      fat: number;
    };
    unitSystem?: 'metric' | 'imperial';
  };
}

export function NutritionBlock({ recipeNutrition, viewMode, userPreferences }: NutritionBlockProps) {
  const unitSystem = userPreferences?.unitSystem || 'metric';
  
  return (
    <div className="space-y-4 transition-all duration-200">
      {viewMode === 'recipe' ? (
        <RecipeBlock recipeNutrition={recipeNutrition} unitSystem={unitSystem} />
      ) : (
        <PersonalBlock
          recipeNutrition={recipeNutrition}
          userPreferences={userPreferences!}
          unitSystem={unitSystem}
        />
      )}
    </div>
  );
}
