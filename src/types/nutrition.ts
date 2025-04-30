
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
  
  // New fields for metabolic simulation
  bodyComposition?: {
    bodyFatPercentage?: number;
    leanMass?: number;
    fatMass?: number;
  };
  activityComponents?: {
    occupation?: string;
    dailyMovement?: string;
    structuredExercise?: string;
    occupationMultiplier?: number;
    dailyMovementMultiplier?: number;
    exerciseMultiplier?: number;
  };
  adaptationTracking?: {
    weeksDieting?: number;
    adaptationPercentage?: number;
    lastDietBreakDate?: string;
    initialWeight?: number;
    initialTDEE?: number;
  };
  matadorProtocol?: {
    enabled: boolean;
    dietPhaseLength: number;
    breakPhaseLength: number;
    currentPhase: 'diet' | 'break';
    phaseStartDate: string;
    schedule?: Array<{
      date: string;
      isDeficitDay: boolean;
      weekNumber: number;
      dayInPhase: number;
    }>;
  };
  bodyFatPercentile?: {
    value?: number;
    category?: string;
    healthRisks?: string[];
  };
  projections?: {
    weightProjections?: Array<{date: string; weight: number; leanMass: number; fatMass: number}>;
    metabolicAdaptation?: Array<{date: string; adaptationPercentage: number}>;
    tdeeProjection?: Array<{date: string; tdee: number}>;
  };
}
