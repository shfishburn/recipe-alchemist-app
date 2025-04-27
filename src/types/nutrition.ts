
export interface NutritionPreferencesType {
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  dietaryRestrictions: string[];
  allergens: string[];
  healthGoal: string;
  mealSizePreference: string;
  macroDetails?: {
    complexCarbs: number;
    simpleCarbs: number;
    saturatedFat: number;
    unsaturatedFat: number;
  };
  mealTiming?: {
    mealsPerDay: number;
    fastingWindow: number;
    preworkoutTiming: number;
    postworkoutTiming: number;
  };
  personalDetails?: {
    age?: number;
    weight?: number;
    height?: number;
    gender?: string;
    activityLevel?: string;
  };
  bmr?: number;
  tdee?: number;
  weightGoalType?: string;
  weightGoalDeficit?: number;
}
