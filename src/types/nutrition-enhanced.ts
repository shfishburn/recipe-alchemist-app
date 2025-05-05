
// Enhanced nutrition type that includes data quality metrics and other details
export interface EnhancedNutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  vitamin_a_iu: number;
  vitamin_c_mg: number;
  vitamin_d_iu: number;
  calcium_mg: number;
  iron_mg: number;
  potassium_mg: number;
  
  // For standardization purposes
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  kcal?: number;
  
  // Enhanced properties
  data_quality: {
    overall_confidence: 'high' | 'medium' | 'low';
    overall_confidence_score: number;
    penalties: {
      energy_check_fail: boolean;
      unmatched_ingredients_rate: number;
      low_confidence_top_ingredients: boolean;
    };
    unmatched_or_low_confidence_ingredients: string[];
    limitations: string[];
  };
  
  per_ingredient: Record<string, any>;
  audit_log: {
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
    unit_conversions: Array<{
      ingredient: string;
      originalQty: number;
      originalUnit: string;
      convertedGrams: number;
      scaleFactor: number;
      referenceAmount?: string;
    }>;
    yield_sources: Record<string, any>;
  };
}
