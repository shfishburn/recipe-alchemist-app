
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
  unitSystem: 'metric'
};
