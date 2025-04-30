
import { Nutrition } from '@/types/recipe';

/**
 * NutritionDataQuality represents quality metrics for nutrition data
 */
export interface NutritionDataQuality {
  overall_confidence: 'high' | 'medium' | 'low';
  overall_confidence_score: number; // 0-1
  penalties: {
    energy_check_fail: boolean;
    unmatched_ingredients_rate: number;
    low_confidence_top_ingredients: boolean;
  };
  unmatched_or_low_confidence_ingredients: string[];
  limitations: string[];
}

/**
 * NutritionAuditLog contains detailed information about how nutrition was calculated
 */
export interface NutritionAuditLog {
  unit_conversions: Record<string, any>;
  yield_sources: Record<string, string>;
  confidence_calculation: {
    ingredient_scores: Array<{ingredient: string, score: number, weight: number}>;
    penalties_applied: Array<{reason: string, multiplier: number}>;
    final_calculation: string;
  };
}

/**
 * EnhancedNutrition extends the base Nutrition type with quality metrics
 * and per-ingredient breakdown
 */
export interface EnhancedNutrition extends Nutrition {
  data_quality?: NutritionDataQuality;
  audit_log?: NutritionAuditLog;
  per_ingredient?: Record<string, Partial<Nutrition>>;
}
