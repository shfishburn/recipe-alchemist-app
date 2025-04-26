
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeNutritionProps {
  recipe: Recipe;
}

export function RecipeNutrition({ recipe }: RecipeNutritionProps) {
  if (!recipe.nutrition) return null;
  
  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Nutrition (per serving)</h2>
        <ul className="space-y-2">
          {recipe.nutrition.kcal !== undefined && (
            <li className="flex justify-between">
              <span>Calories:</span>
              <span className="font-medium">{recipe.nutrition.kcal} kcal</span>
            </li>
          )}
          {recipe.nutrition.protein_g !== undefined && (
            <li className="flex justify-between">
              <span>Protein:</span>
              <span className="font-medium">{recipe.nutrition.protein_g}g</span>
            </li>
          )}
          {recipe.nutrition.carbs_g !== undefined && (
            <li className="flex justify-between">
              <span>Carbs:</span>
              <span className="font-medium">{recipe.nutrition.carbs_g}g</span>
            </li>
          )}
          {recipe.nutrition.fat_g !== undefined && (
            <li className="flex justify-between">
              <span>Fat:</span>
              <span className="font-medium">{recipe.nutrition.fat_g}g</span>
            </li>
          )}
          {recipe.nutrition.fiber_g !== undefined && (
            <li className="flex justify-between">
              <span>Fiber:</span>
              <span className="font-medium">{recipe.nutrition.fiber_g}g</span>
            </li>
          )}
          {recipe.nutrition.sugar_g !== undefined && (
            <li className="flex justify-between">
              <span>Sugar:</span>
              <span className="font-medium">{recipe.nutrition.sugar_g}g</span>
            </li>
          )}
          {recipe.nutrition.sodium_mg !== undefined && (
            <li className="flex justify-between">
              <span>Sodium:</span>
              <span className="font-medium">{recipe.nutrition.sodium_mg}mg</span>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
