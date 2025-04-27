
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { NutritionHeader } from './nutrition/NutritionHeader';
import { useNutritionData } from './nutrition/useNutritionData';
import { NutritionBlock } from './nutrition/NutritionBlock';
import type { Recipe } from '@/types/recipe';

interface RecipeNutritionProps {
  recipe: Recipe;
}

export function RecipeNutrition({ recipe }: RecipeNutritionProps) {
  const { user, profile } = useAuth();
  const [viewMode, setViewMode] = useState<'recipe' | 'personal'>('recipe');
  const { recipeNutrition, userPreferences } = useNutritionData(recipe, profile);

  if (!recipeNutrition) {
    return null;
  }

  return (
    <Card className="w-full">
      <NutritionHeader
        showToggle={!!user && !!userPreferences}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <CardContent>
        <NutritionBlock 
          recipeNutrition={recipeNutrition}
          userPreferences={userPreferences}
          viewMode={viewMode}
        />
      </CardContent>
    </Card>
  );
}
