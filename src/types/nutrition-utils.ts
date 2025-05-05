
/**
 * This file provides utility functions for standardizing nutrition data across different formats
 * Re-exports utility functions from @/utils/nutrition-utils.ts for backward compatibility
 */

import type { Nutrition } from '@/types/recipe';
import { standardizeNutrition, validateNutritionData } from '@/utils/nutrition-utils';

export type NutritionData = Nutrition;

// Re-export utility functions 
export { standardizeNutrition, validateNutritionData };
