
import { useMemo } from 'react';
import type { EnhancedNutrition } from '@/types/nutrition-enhanced';

// Re-export the EnhancedNutrition type for components that import it from here
export type { EnhancedNutrition };

interface UseNutritionDataResult {
  recipeNutrition: EnhancedNutrition;
  refetchNutrition: () => void;
}

export function useNutritionData(nutrition?: any): UseNutritionDataResult {
  const recipeNutrition = useMemo(() => {
    // Default nutrition data structure
    const defaultNutrition: EnhancedNutrition = {
      calories: 0,
      protein: { value: 0, percent: 0 },
      carbs: { value: 0, percent: 0 },
      fat: { value: 0, percent: 0 },
      data_quality: {
        overall_confidence: 'low',
        ingredient_coverage: 0,
        source_count: 0
      },
      per_serving: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    };
    
    // If no nutrition data, return defaults
    if (!nutrition) return defaultNutrition;
    
    // Map from raw nutrition data to enhanced format
    const enhanced: EnhancedNutrition = {
      calories: nutrition.calories || 0,
      protein: {
        value: nutrition.protein || 0,
        percent: calculateMacroPercent(nutrition.protein, nutrition)
      },
      carbs: {
        value: nutrition.carbs || 0,
        percent: calculateMacroPercent(nutrition.carbs, nutrition)
      },
      fat: {
        value: nutrition.fat || 0,
        percent: calculateMacroPercent(nutrition.fat, nutrition)
      },
      // Optional nutrients if available
      ...(nutrition.fiber && {
        fiber: {
          value: nutrition.fiber,
          percent: (nutrition.fiber / 25) * 100 // Based on 25g daily recommended
        }
      }),
      ...(nutrition.sugar && {
        sugar: {
          value: nutrition.sugar,
          percent: (nutrition.sugar / 50) * 100 // Based on 50g max recommended
        }
      }),
      ...(nutrition.sodium && {
        sodium: {
          value: nutrition.sodium,
          percent: (nutrition.sodium / 2300) * 100 // Based on 2300mg recommended max
        }
      }),
      ...(nutrition.saturated_fat && {
        saturated_fat: {
          value: nutrition.saturated_fat,
          percent: (nutrition.saturated_fat / 20) * 100 // Based on 20g max recommended
        }
      }),
      
      // Vitamins and minerals if available
      ...(nutrition.vitamins && { vitamins: nutrition.vitamins }),
      ...(nutrition.minerals && { minerals: nutrition.minerals }),
      
      // Highlights/insights if available
      ...(nutrition.highlights && { highlights: nutrition.highlights }),
      
      // Data quality metrics
      data_quality: {
        overall_confidence: nutrition.data_quality?.overall_confidence || 'low',
        ingredient_coverage: nutrition.data_quality?.ingredient_coverage || 0,
        source_count: nutrition.data_quality?.source_count || 0
      },
      
      // Per serving data
      per_serving: {
        calories: nutrition.per_serving?.calories || nutrition.calories || 0,
        protein: nutrition.per_serving?.protein || nutrition.protein || 0,
        carbs: nutrition.per_serving?.carbs || nutrition.carbs || 0,
        fat: nutrition.per_serving?.fat || nutrition.fat || 0,
        ...(nutrition.per_serving || {})
      }
    };
    
    return enhanced;
  }, [nutrition]);
  
  // Simple refetch function (in a real app, this would likely use a query client)
  const refetchNutrition = () => {
    console.log("Nutrition data refetch requested");
    // Implementation would depend on the actual data fetching strategy
  };
  
  return { recipeNutrition, refetchNutrition };
}

// Calculate macro percentage
function calculateMacroPercent(macroValue: number, nutrition: any): number {
  if (!macroValue || !nutrition) return 0;
  
  const totalCalories = nutrition.calories || 0;
  if (totalCalories === 0) return 0;
  
  // Calculate percentage based on caloric contribution
  // Protein and carbs: 4 calories per gram
  // Fat: 9 calories per gram
  const caloriesFromMacro = calculateCaloriesFromMacro(macroValue, nutrition);
  return (caloriesFromMacro / totalCalories) * 100;
}

// Calculate calories from a macro type
function calculateCaloriesFromMacro(value: number, nutrition: any): number {
  const proteinCalories = (nutrition.protein || 0) * 4;
  const carbsCalories = (nutrition.carbs || 0) * 4;
  const fatCalories = (nutrition.fat || 0) * 9;
  
  // Figure out which macro this is
  if (value === nutrition.protein) return proteinCalories;
  if (value === nutrition.carbs) return carbsCalories;
  if (value === nutrition.fat) return fatCalories;
  
  // Default fallback
  return value * 4; // Assume it's protein or carbs if we can't determine
}
