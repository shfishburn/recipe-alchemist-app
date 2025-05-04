
export interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
  serving_size?: number;
  data_quality?: 'low' | 'medium' | 'high';
  [key: string]: any; // Allow for additional properties
}
