
import React from 'react';
import { RecipeBlock } from './blocks/RecipeBlock';
import { PersonalBlock } from './blocks/PersonalBlock';
import { EnhancedNutrition } from './useNutritionData';
import type { Recipe, NutriScore } from '@/types/recipe';

interface NutritionBlockProps {
  recipeNutrition: EnhancedNutrition;
  viewMode: 'recipe' | 'personal';
  nutriScore?: NutriScore;
  recipeId?: string;
  ingredients?: any[];
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

export function NutritionBlock({ recipeNutrition, viewMode, nutriScore, recipeId, ingredients, userPreferences }: NutritionBlockProps) {
  const unitSystem = userPreferences?.unitSystem || 'metric';
  
  // Process nutrition data more efficiently without deep cloning
  const processedNutrition = React.useMemo(() => {
    if (!recipeNutrition) return null;
    
    // Only process fields that will be displayed
    const fieldsToProcess = [
      'calories', 'protein', 'carbs', 'fat', 'fiber', 'sugar', 'sodium',
      'saturated_fat', 'vitaminA', 'vitaminC', 'vitaminD', 'calcium', 'iron', 'potassium'
    ];
    
    // Create a new object with only the processed fields
    const processed: Record<string, any> = {};
    
    for (const field of fieldsToProcess) {
      const value = recipeNutrition[field as keyof EnhancedNutrition];
      
      // Only process numeric values and ensure they're rounded for display
      if (typeof value === 'number') {
        processed[field] = Math.round(value);
      } else if (value !== undefined && value !== null) {
        // Try to convert to number if possible
        const numValue = Number(value);
        processed[field] = !isNaN(numValue) ? Math.round(numValue) : 0;
      } else {
        processed[field] = 0;
      }
    }
    
    // Preserve data quality and metadata
    if (recipeNutrition.data_quality) {
      processed.data_quality = recipeNutrition.data_quality;
    }
    
    // Preserve verification metadata if present
    if (recipeNutrition.verification) {
      processed.verification = recipeNutrition.verification;
    }
    
    // Create a properly typed EnhancedNutrition object
    const result: EnhancedNutrition = {
      calories: processed.calories || 0,
      protein: processed.protein || 0,
      carbs: processed.carbs || 0,
      fat: processed.fat || 0,
      fiber: processed.fiber || 0,
      sugar: processed.sugar || 0,
      sodium: processed.sodium || 0,
      saturated_fat: processed.saturated_fat || 0,
      vitaminA: processed.vitaminA || 0,
      vitaminC: processed.vitaminC || 0,
      vitaminD: processed.vitaminD || 0,
      calcium: processed.calcium || 0,
      iron: processed.iron || 0,
      potassium: processed.potassium || 0,
      data_quality: processed.data_quality,
      verification: processed.verification
    };
    
    return result;
  }, [recipeNutrition]);
  
  // Handle case when nutrition data is null or empty
  if (!recipeNutrition || !processedNutrition) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No nutrition information available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 transition-all duration-200">
      {viewMode === 'recipe' ? (
        <RecipeBlock 
          recipeNutrition={processedNutrition} 
          unitSystem={unitSystem}
          nutriScore={nutriScore}
          recipeId={recipeId}
          ingredients={ingredients}
        />
      ) : (
        <PersonalBlock
          recipeNutrition={processedNutrition}
          userPreferences={userPreferences!}
          unitSystem={unitSystem}
        />
      )}
    </div>
  );
}
