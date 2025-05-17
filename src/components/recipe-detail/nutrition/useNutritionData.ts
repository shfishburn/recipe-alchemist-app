
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
      protein: 0,
      carbs: 0,
      fat: 0,
      data_quality: {
        overall_confidence: 'low',
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
      protein: nutrition.protein || 0,
      carbs: nutrition.carbs || 0,
      fat: nutrition.fat || 0,
      
      // Optional nutrients if available
      ...(nutrition.fiber && { fiber: nutrition.fiber }),
      ...(nutrition.sugar && { sugar: nutrition.sugar }),
      ...(nutrition.sodium && { sodium: nutrition.sodium }),
      
      // Micronutrients
      ...(nutrition.vitaminA && { vitaminA: nutrition.vitaminA }),
      ...(nutrition.vitaminC && { vitaminC: nutrition.vitaminC }),
      ...(nutrition.vitaminD && { vitaminD: nutrition.vitaminD }),
      ...(nutrition.calcium && { calcium: nutrition.calcium }),
      ...(nutrition.iron && { iron: nutrition.iron }),
      ...(nutrition.potassium && { potassium: nutrition.potassium }),
      
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
