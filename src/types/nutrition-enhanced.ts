
export interface EnhancedNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  vitamin_d?: number;
  vitamin_c?: number;
  vitamin_a?: number;
  serving_size?: number;
  servingSize?: number;
  dataQuality?: 'low' | 'medium' | 'high';
  data_quality?: 'low' | 'medium' | 'high';
  [key: string]: any; // Allow for additional properties
}
