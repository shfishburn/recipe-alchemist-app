
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NutritionHeader } from './nutrition/NutritionHeader';
import { useNutritionData } from './nutrition/useNutritionData';
import { NutritionBlock } from './nutrition/NutritionBlock';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useUnitSystem } from '@/hooks/use-unit-system';
import type { Recipe } from '@/types/recipe';
import { EnhancedNutrition } from '@/types/nutrition-enhanced';

interface RecipeNutritionProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

export function RecipeNutrition({ recipe, isOpen, onToggle }: RecipeNutritionProps) {
  const { user, profile } = useAuth();
  const { unitSystem } = useUnitSystem();
  const [viewMode, setViewMode] = useState<'recipe' | 'personal'>('recipe');
  const { recipeNutrition, userPreferences } = useNutritionData(recipe, profile);
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Calculate total time from prep + cook time
  const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0);
  // Use cuisine as cooking method since cooking_method doesn't exist in the type
  const cookingMethod = recipe.cuisine || '';

  // If there's no nutrition data, we don't show the component
  if (!recipe.nutrition || !recipeNutrition) {
    console.log("No nutrition data available for display");
    return null;
  }
  
  console.log("Displaying nutrition data:", recipeNutrition);
  
  // Cast to EnhancedNutrition if it has data_quality field
  const enhancedNutrition = (recipeNutrition as any)?.data_quality 
    ? (recipeNutrition as unknown as EnhancedNutrition) 
    : undefined;

  // Make sure userPreferences has unitSystem, dailyCalories and macroSplit
  const defaultPreferences = {
    unitSystem,
    dailyCalories: 2000,
    macroSplit: {
      protein: 30,
      carbs: 40,
      fat: 30
    }
  };
  
  const updatedUserPreferences = userPreferences ? {
    ...defaultPreferences,
    ...userPreferences,
    unitSystem: userPreferences.unitSystem || unitSystem
  } : defaultPreferences;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="w-full">
        <div className={`flex items-center justify-between ${isMobile ? 'p-3 pb-2' : 'p-6 pb-3'}`}>
          <NutritionHeader
            showToggle={!!user && !!updatedUserPreferences}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            cookingMethod={cookingMethod}
            totalTime={totalTime}
            nutrition={enhancedNutrition}
          />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle nutrition section</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <CardContent className={isMobile ? 'px-3 py-2 pb-4' : 'p-6'}>
            <NutritionBlock 
              recipeNutrition={recipeNutrition}
              userPreferences={updatedUserPreferences}
              viewMode={viewMode}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
