
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

  // Map nutrition from the recipe to the format expected by NutritionChart
  const formattedNutrition = {
    calories: recipe.nutrition.calories || recipe.nutrition.kcal || 0,
    protein: recipe.nutrition.protein || recipe.nutrition.protein_g || 0,
    carbs: recipe.nutrition.carbs || recipe.nutrition.carbs_g || 0,
    fat: recipe.nutrition.fat || recipe.nutrition.fat_g || 0
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl">Nutrition Information</CardTitle>
      </CardHeader>
      <CardContent>
        <NutritionChart 
          recipeNutrition={formattedNutrition}
        />
      </CardContent>
    </Card>
  );
}
