
export interface Nutrition {
  // Basic nutrition (with both naming conventions)
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  
  // New property for saturated fat
  saturated_fat?: number;
  
  // Aliases for backwards compatibility
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  
  // Micronutrients
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  cholesterol?: number;
  
  // Alternative naming for micronutrients (aliases)
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  
  // Enhanced nutrition data properties
  data_quality?: {
    overall_confidence: 'high' | 'medium' | 'low';
    overall_confidence_score: number;
    penalties?: Record<string, any>;
    unmatched_or_low_confidence_ingredients?: string[];
    limitations?: string[];
  };
  
  // Verification metadata
  verification?: {
    verified_at: string;
    verified_nutrients: string[];
    verification_source: 'fdc_api' | 'usda_sr28';
    verification_confidence: number;
    differences?: Record<string, {old: number, new: number, difference_percent: number}>;
  };
  
  per_ingredient?: Record<string, any>;
  audit_log?: Record<string, any>;
  
  // Added for compatibility with standardized nutrition
  carbohydrates?: number;
}
