
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RecipeBlock } from './blocks/RecipeBlock';
import { PersonalBlock } from './blocks/PersonalBlock';

interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionBlockProps {
  recipeNutrition: RecipeNutrition;
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
