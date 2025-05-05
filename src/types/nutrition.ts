
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

export interface MacroSplitType {
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionPreferencesType {
  dailyCalories: number;
  macroSplit: MacroSplitType;
  dietaryRestrictions: string[];
  allergens: string[];
  healthGoal: string;
  mealSizePreference: string;
  preferredCuisines?: string[];
  unitSystem?: 'metric' | 'imperial';
  // Optional fields
  weightGoalType?: string;
  weightGoalDeficit?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  nonExerciseActivity?: 'minimal' | 'low' | 'moderate' | 'high' | 'very_high';
  exerciseIntensity?: 'light' | 'moderate' | 'challenging' | 'intense' | 'extreme';
  macroDetails?: {
    complexCarbs: number;
    simpleCarbs: number;
    saturatedFat: number;
    unsaturatedFat: number;
  }
}

// Default values for nutrition preferences
export const DEFAULT_NUTRITION_PREFERENCES: NutritionPreferencesType = {
  dailyCalories: 2000,
  macroSplit: {
    protein: 30,
    carbs: 40,
    fat: 30
  },
  dietaryRestrictions: [],
  allergens: [],
  preferredCuisines: [],
  healthGoal: 'maintenance',
  mealSizePreference: 'medium',
  unitSystem: 'metric',
  weightGoalType: 'maintenance',
  weightGoalDeficit: 0
};

// Helper function to check if an object matches the NutritionPreferencesType interface
export function isNutritionPreferences(obj: any): obj is NutritionPreferencesType {
  return obj 
    && typeof obj === 'object'
    && (typeof obj.dailyCalories === 'number' || obj.dailyCalories === undefined)
    && (typeof obj.macroSplit === 'object' || obj.macroSplit === undefined);
}
