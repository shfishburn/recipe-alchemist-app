
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NutritionHeader } from './nutrition/NutritionHeader';
import { useNutritionData, EnhancedNutrition } from './nutrition/useNutritionData';
import { NutritionBlock } from './nutrition/NutritionBlock';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useUnitSystem } from '@/hooks/use-unit-system';
import type { Recipe } from '@/types/recipe';
import { standardizeNutrition } from '@/types/nutrition-utils';
import { validateNutritionData } from '@/utils/nutrition-utils';

// Safe import for ProfileContext - don't throw errors if not available
let useProfileSettings: () => any | null = () => null;
try {
  // Dynamically import the profile context hook
  import('@/hooks/use-profile-context').then(module => {
    useProfileSettings = module.useProfileSettings;
  }).catch(error => {
    console.log("ProfileContext not available, using default settings");
  });
} catch (error) {
  console.log("Error importing ProfileContext, using default settings");
}

interface RecipeNutritionProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
  onRecipeUpdate?: (updatedRecipe: Recipe) => void;
}

export function RecipeNutrition({ recipe, isOpen, onToggle, onRecipeUpdate }: RecipeNutritionProps) {
  const { user } = useAuth();
  let nutritionPreferences = null;
  
  try {
    // Try to get nutrition preferences from profile context, but don't crash if unavailable
    const profileSettings = useProfileSettings?.();
    nutritionPreferences = profileSettings?.nutritionPreferences;
  } catch (error) {
    // If ProfileContext is not available, continue without profile settings
    console.log("ProfileContext not available, using default settings");
  }
  
  const { unitSystem } = useUnitSystem();
  const [viewMode, setViewMode] = useState<'recipe' | 'personal'>('recipe');
  const { recipeNutrition, refetchNutrition } = useNutritionData(recipe);
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Calculate total time from prep + cook time
  const totalTime = (recipe.prep_time_min || 0) + (recipe.cook_time_min || 0);
  // Use cuisine as cooking method since cooking_method doesn't exist in the type
  const cookingMethod = recipe.cuisine || '';

  // Enhanced check to ensure we have valid nutrition data
  const hasValidNutrition = React.useMemo(() => {
    try {
      if (!recipe.nutrition) return false;
      
      // If recipeNutrition isn't available, try to standardize it ourselves
      const nutrition = recipeNutrition || standardizeNutrition(recipe.nutrition);
      
      // Use validateNutritionData utility for consistent validation
      return validateNutritionData(nutrition);
    } catch (error) {
      console.error("Error validating nutrition data:", error);
      return false;
    }
  }, [recipe.nutrition, recipeNutrition]);

  // Determine if we should use the collapsible UI or not
  // If we're directly on the Nutrition tab, we'll skip the collapsible wrapper
  const isInDedicatedTab = window.location.hash === '#nutrition';

  // Process nutrition data into the format expected by the components
  const processedNutrition: EnhancedNutrition = React.useMemo(() => {
    // If there's no valid nutrition data, return a fallback object
    if (!hasValidNutrition) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      } as EnhancedNutrition;
    }
    
    // Use the nutrition data from the hook or standardize the recipe's nutrition data
    const standardized = recipeNutrition || standardizeNutrition(recipe.nutrition || {});
    return standardized as EnhancedNutrition;
  }, [hasValidNutrition, recipe.nutrition, recipeNutrition]);

  // If we're on the dedicated nutrition tab, always render as expanded
  if (isInDedicatedTab) {
    // If there's no valid nutrition data, show a placeholder instead of nothing
    if (!hasValidNutrition) {
      return (
        <Card className="w-full">
          <CardContent className="text-center py-6">
            <p className="text-muted-foreground">
              Nutrition information is not available for this recipe.
            </p>
          </CardContent>
        </Card>
      );
    }

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
    
    const updatedUserPreferences = nutritionPreferences ? {
      ...defaultPreferences,
      ...nutritionPreferences,
      unitSystem: nutritionPreferences.unitSystem || unitSystem
    } : defaultPreferences;

    return (
      <Card className="w-full">
        <div className="flex items-center justify-between p-4">
          <NutritionHeader
            showToggle={!!user && !!updatedUserPreferences}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            cookingMethod={cookingMethod}
            totalTime={totalTime}
            nutrition={processedNutrition}
          />
        </div>
        <CardContent className={isMobile ? "p-2" : "p-4"}>
          <NutritionBlock 
            recipeNutrition={processedNutrition}
            userPreferences={updatedUserPreferences}
            viewMode={viewMode}
          />
        </CardContent>
      </Card>
    );
  }

  // If there's no valid nutrition data, show a placeholder instead of nothing
  if (!hasValidNutrition) {
    return (
      <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
        <Card className="w-full">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h3 className="text-lg font-medium">Nutrition Information</h3>
            </div>
            <div className="flex items-center gap-2">
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
          </div>
          <CollapsibleContent>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">
                Nutrition information is not available for this recipe.
              </p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

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
  
  const updatedUserPreferences = nutritionPreferences ? {
    ...defaultPreferences,
    ...nutritionPreferences,
    unitSystem: nutritionPreferences.unitSystem || unitSystem
  } : defaultPreferences;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <Card className="w-full">
        <div className="flex items-center justify-between p-4">
          <NutritionHeader
            showToggle={!!user && !!updatedUserPreferences}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            cookingMethod={cookingMethod}
            totalTime={totalTime}
            nutrition={processedNutrition}
          />
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 touch-target"
                aria-label="Toggle nutrition section"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle nutrition section</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <CardContent className={isMobile ? "p-2" : "p-4"}>
            <NutritionBlock 
              recipeNutrition={processedNutrition}
              userPreferences={updatedUserPreferences}
              viewMode={viewMode}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
