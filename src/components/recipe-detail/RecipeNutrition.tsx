
import React, { useState } from 'react';
import { NutritionChart } from '@/components/recipe-detail/NutritionChart';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { User2, ChefHat } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

interface RecipeNutritionProps {
  recipe: Recipe;
}

export function RecipeNutrition({ recipe }: RecipeNutritionProps) {
  const { user, profile } = useAuth();
  const [viewMode, setViewMode] = useState<'recipe' | 'personal'>('recipe');

  if (!recipe.nutrition) {
    return null;
  }

  // Map nutrition from the recipe
  const recipeNutrition = {
    calories: recipe.nutrition.calories || recipe.nutrition.kcal || 0,
    protein: recipe.nutrition.protein || recipe.nutrition.protein_g || 0,
    carbs: recipe.nutrition.carbs || recipe.nutrition.carbs_g || 0,
    fat: recipe.nutrition.fat || recipe.nutrition.fat_g || 0
  };

  // Get user preferences if available
  const userPreferences = profile?.nutrition_preferences ? {
    dailyCalories: profile.nutrition_preferences.dailyCalories,
    macroSplit: profile.nutrition_preferences.macroSplit
  } : undefined;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl flex items-center justify-between">
          <span>Nutrition Information</span>
          {user && userPreferences && (
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as 'recipe' | 'personal')}
              className="space-x-1"
            >
              <ToggleGroupItem value="recipe" size="sm" className="px-3 py-1">
                <ChefHat className="h-4 w-4 mr-2" />
                Recipe
              </ToggleGroupItem>
              <ToggleGroupItem value="personal" size="sm" className="px-3 py-1">
                <User2 className="h-4 w-4 mr-2" />
                Personal
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NutritionChart 
          recipeNutrition={recipeNutrition}
          userPreferences={viewMode === 'personal' ? userPreferences : undefined}
        />
      </CardContent>
    </Card>
  );
}
