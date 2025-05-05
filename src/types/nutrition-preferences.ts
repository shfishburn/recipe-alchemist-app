
export interface MacroSplitType {
  protein: number;
  carbs: number;
  fat: number;
}

export interface PersonalDetailsType {
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
}

export interface BodyCompositionType {
  bodyFatPercentage?: number;
  leanMass?: number;
  fatMass?: number;
}

export interface MealTimingType {
  mealsPerDay: number;
  fastingWindow: number;
  preworkoutTiming: number;
  postworkoutTiming: number;
}

export interface MacroDetailsType {
  complexCarbs: number;
  simpleCarbs: number;
  saturatedFat: number;
  unsaturatedFat: number;
}

export interface AdaptationTrackingType {
  weeksDieting?: number;
  initialWeight?: number;
  lastDietBreakDate?: string;
  adaptationPercentage?: number;
}

export interface MatadorProtocolType {
  enabled: boolean;
  dietPhaseLength: number;
  breakPhaseLength: number;
  currentPhase?: 'diet' | 'break';
  phaseStartDate?: string;
  schedule?: Array<any>;
}

export interface ActivityComponentsType {
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  nonExerciseActivity?: 'minimal' | 'low' | 'moderate' | 'high' | 'very_high';
  exerciseIntensity?: 'light' | 'moderate' | 'challenging' | 'intense' | 'extreme';
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
  macroDetails?: MacroDetailsType;
  
  // Fields referenced in the components
  personalDetails?: PersonalDetailsType;
  bodyComposition?: BodyCompositionType;
  mealTiming?: MealTimingType;
  adaptationTracking?: AdaptationTrackingType;
  matadorProtocol?: MatadorProtocolType;
  activityComponents?: ActivityComponentsType;
  bmr?: number;
  tdee?: number;
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
  weightGoalDeficit: 0,
  personalDetails: {
    age: 30,
    weight: 70,
    height: 170,
    gender: 'other',
    activityLevel: 'moderate'
  },
  mealTiming: {
    mealsPerDay: 3,
    fastingWindow: 12,
    preworkoutTiming: 60,
    postworkoutTiming: 30
  },
  // Set default values for other fields
  bodyComposition: {
    bodyFatPercentage: undefined,
    leanMass: undefined,
    fatMass: undefined
  },
  activityComponents: {
    activityLevel: 'moderate',
    nonExerciseActivity: 'moderate',
    exerciseIntensity: 'moderate'
  },
  matadorProtocol: {
    enabled: false,
    dietPhaseLength: 14,
    breakPhaseLength: 7
  },
  bmr: 0,
  tdee: 0
};
