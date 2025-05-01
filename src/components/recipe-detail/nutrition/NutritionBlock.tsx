
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
  
  // Round all numerical values in recipeNutrition to integers
  const processedNutrition = React.useMemo(() => {
    // Create a deep copy to avoid modifying the original data
    const processed = JSON.parse(JSON.stringify(recipeNutrition));
    
    // Function to recursively round numbers in an object
    const roundNumbers = (obj: any): any => {
      if (obj === null || obj === undefined) return obj;
      
      if (typeof obj === 'number') {
        return Math.round(obj);
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => roundNumbers(item));
      }
      
      if (typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = roundNumbers(obj[key]);
          }
        }
        return result;
      }
      
      return obj;
    };
    
    return roundNumbers(processed);
  }, [recipeNutrition]);
  
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
