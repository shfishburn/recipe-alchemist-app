
// Define the types for enhanced nutrition data
export interface EnhancedNutrition {
  calories: number;
  protein: { value: number; percent: number };
  carbs: { value: number; percent: number };
  fat: { value: number; percent: number };
  saturated_fat?: { value: number; percent: number };
  fiber?: { value: number; percent: number };
  sugar?: { value: number; percent: number };
  sodium?: { value: number; percent: number };
  
  data_quality: {
    overall_confidence: 'low' | 'medium' | 'high' | string;
    ingredient_coverage: number;
    source_count: number;
  };
  
  vitamins?: {
    [key: string]: { value: number; unit: string; percent?: number };
  };
  
  minerals?: {
    [key: string]: { value: number; unit: string; percent?: number };
  };
  
  highlights?: string[];
  
  per_serving: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    [key: string]: number;
  };
}
