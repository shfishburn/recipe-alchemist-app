
import { RecipeNutrition } from '@/types/quick-recipe';

/**
 * Enhanced nutrition data with quality and confidence information
 */
export interface EnhancedNutrition extends RecipeNutrition {
  // Additional data quality information
  data_quality?: {
    overall_confidence: 'high' | 'medium' | 'low';
    overall_confidence_score: number;
    penalties?: Record<string, any>;
    unmatched_or_low_confidence_ingredients?: string[];
    limitations?: string[];
  };
  per_ingredient?: Record<string, any>;
  audit_log?: any[] | Record<string, any>; // Modified to accept both array and record for backward compatibility
}
