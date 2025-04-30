
import { Nutrition } from '@/types/recipe';

export interface EnhancedNutrition extends Nutrition {
  data_quality: {
    overall_confidence: 'high' | 'medium' | 'low';
    overall_confidence_score: number;
    penalties: {
      energy_check_fail?: boolean;
      unmatched_ingredients_rate?: number;
      low_confidence_top_ingredients?: boolean;
    };
    unmatched_or_low_confidence_ingredients?: string[];
    limitations?: string[];
  };
  per_ingredient?: Record<string, {
    item: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
    vitamin_a_iu?: number;
    vitamin_c_mg?: number;
    vitamin_d_iu?: number;
    calcium_mg?: number;
    iron_mg?: number;
    potassium_mg?: number;
    confidence_score: number;
    match_method: string;
  }>;
  audit_log?: {
    confidence_calculation: {
      ingredient_scores: Array<{
        ingredient: string;
        score: number;
        weight: number;
      }>;
      penalties_applied: Array<{
        reason: string;
        multiplier: number;
      }>;
      final_calculation: string;
    };
    unit_conversions: Record<string, any>;
    yield_factors: Record<string, any>;
  };
}
