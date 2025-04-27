
import React from 'react';
import { NutritionChart } from '@/components/recipe-detail/NutritionChart';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Recipe } from '@/types/recipe';

interface RecipeNutritionProps {
  recipe: Recipe;
}

export function RecipeNutrition({ recipe }: RecipeNutritionProps) {
  const { user } = useAuth();

  if (!recipe.nutrition) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Information</CardTitle>
      </CardHeader>
      <CardContent>
        <NutritionChart 
          recipeNutrition={recipe.nutrition}
        />
      </CardContent>
    </Card>
  );
}
