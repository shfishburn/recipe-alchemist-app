
// Define the types for enhanced nutrition data
export interface EnhancedNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  
  data_quality: {
    overall_confidence: 'low' | 'medium' | 'high' | string;
    ingredient_coverage?: number;
    source_count?: number;
  };
  
  per_serving: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    [key: string]: number;
  };
  
  // Optional properties
  highlights?: string[];
  vitamins?: {
    [key: string]: { value: number; unit: string; percent?: number };
  };
  minerals?: {
    [key: string]: { value: number; unit: string; percent?: number };
  };
}
