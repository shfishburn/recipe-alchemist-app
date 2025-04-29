
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
  };
}

export function NutritionBlock({ recipeNutrition, viewMode, userPreferences }: NutritionBlockProps) {
  return (
    <div className="space-y-4 transition-all duration-200">
      {viewMode === 'recipe' ? (
        <RecipeBlock recipeNutrition={recipeNutrition} />
      ) : (
        <PersonalBlock
          recipeNutrition={recipeNutrition}
          userPreferences={userPreferences!}
        />
      )}
    </div>
  );
}
