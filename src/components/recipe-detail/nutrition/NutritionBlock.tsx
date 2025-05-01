
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
    unitSystem?: 'metric' | 'imperial';
  };
}

export function NutritionBlock({ recipeNutrition, viewMode, userPreferences }: NutritionBlockProps) {
  const unitSystem = userPreferences?.unitSystem || 'metric';
  
  // Process nutrition data more efficiently without deep cloning
  const processedNutrition = React.useMemo(() => {
    if (!recipeNutrition) return null;
    
    // Only process fields that will be displayed
    const fieldsToProcess = [
      'calories', 'protein', 'carbs', 'fat', 'fiber', 'sugar', 'sodium',
      'vitaminA', 'vitaminC', 'vitaminD', 'calcium', 'iron', 'potassium'
    ];
    
    // Create a new object with only the processed fields
    const processed: Record<string, any> = {};
    
    for (const field of fieldsToProcess) {
      const value = recipeNutrition[field as keyof ExtendedNutritionData];
      
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
    
    // Return as ExtendedNutritionData with type assertion after ensuring required properties exist
    return processed as unknown as ExtendedNutritionData;
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
