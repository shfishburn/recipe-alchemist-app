
import { format, addDays } from 'date-fns';

// Body fat reference data structure
export const bodyFatReferenceData = {
  metadata: {
    sources: ["CDC NHANES", "Gallagher et al. 2000"],
    lastUpdated: "2023",
    version: "1.0"
  },
  male: {
    "18-29": {
      percentiles: {
        5: { value: 8, category: "Elite" },
        15: { value: 12, category: "Fitness" },
        50: { value: 19, category: "Average" },
        75: { value: 24, category: "Overweight" },
        95: { value: 30, category: "Obese" },
      },
      healthRisks: {
        veryLow: ["Hormone disruption", "Decreased immune function"],
        low: [],
        average: [],
        high: ["Increased cardiovascular risk", "Higher diabetes risk"],
        veryHigh: ["Significantly increased health risks", "Metabolic syndrome risk"]
      }
    },
    "30-39": {
      percentiles: {
        5: { value: 10, category: "Elite" },
        15: { value: 14, category: "Fitness" },
        50: { value: 21, category: "Average" },
        75: { value: 26, category: "Overweight" },
        95: { value: 32, category: "Obese" },
      },
      healthRisks: {
        veryLow: ["Hormone disruption", "Decreased immune function"],
        low: [],
        average: [],
        high: ["Increased cardiovascular risk", "Higher diabetes risk"],
        veryHigh: ["Significantly increased health risks", "Metabolic syndrome risk"]
      }
    },
    "40-49": {
      percentiles: {
        5: { value: 12, category: "Elite" },
        15: { value: 16, category: "Fitness" },
        50: { value: 23, category: "Average" },
        75: { value: 28, category: "Overweight" },
        95: { value: 34, category: "Obese" },
      },
      healthRisks: {
        veryLow: ["Hormone disruption", "Decreased immune function"],
        low: [],
        average: [],
        high: ["Increased cardiovascular risk", "Higher diabetes risk"],
        veryHigh: ["Significantly increased health risks", "Metabolic syndrome risk"]
      }
    },
    "50+": {
      percentiles: {
        5: { value: 13, category: "Elite" },
        15: { value: 17, category: "Fitness" },
        50: { value: 25, category: "Average" },
        75: { value: 30, category: "Overweight" },
        95: { value: 35, category: "Obese" },
      },
      healthRisks: {
        veryLow: ["Hormone disruption", "Decreased immune function"],
        low: [],
        average: [],
        high: ["Increased cardiovascular risk", "Higher diabetes risk"],
        veryHigh: ["Significantly increased health risks", "Metabolic syndrome risk"]
      }
    }
  },
  female: {
    "18-29": {
      percentiles: {
        5: { value: 17, category: "Elite" },
        15: { value: 21, category: "Fitness" },
        50: { value: 28, category: "Average" },
        75: { value: 33, category: "Overweight" },
        95: { value: 39, category: "Obese" },
      },
      healthRisks: {
        veryLow: ["Hormone disruption", "Menstrual irregularities"],
        low: [],
        average: [],
        high: ["Increased cardiovascular risk", "Higher diabetes risk"],
        veryHigh: ["Significantly increased health risks", "Metabolic syndrome risk"]
      }
    },
    "30-39": {
      percentiles: {
        5: { value: 18, category: "Elite" },
        15: { value: 22, category: "Fitness" },
        50: { value: 29, category: "Average" },
        75: { value: 34, category: "Overweight" },
        95: { value: 40, category: "Obese" },
      },
      healthRisks: {
        veryLow: ["Hormone disruption", "Menstrual irregularities"],
        low: [],
        average: [],
        high: ["Increased cardiovascular risk", "Higher diabetes risk"],
        veryHigh: ["Significantly increased health risks", "Metabolic syndrome risk"]
      }
    },
    "40-49": {
      percentiles: {
        5: { value: 19, category: "Elite" },
        15: { value: 23, category: "Fitness" },
        50: { value: 30, category: "Average" },
        75: { value: 36, category: "Overweight" },
        95: { value: 42, category: "Obese" },
      },
      healthRisks: {
        veryLow: ["Hormone disruption", "Decreased immune function"],
        low: [],
        average: [],
        high: ["Increased cardiovascular risk", "Higher diabetes risk"],
        veryHigh: ["Significantly increased health risks", "Metabolic syndrome risk"]
      }
    },
    "50+": {
      percentiles: {
        5: { value: 20, category: "Elite" },
        15: { value: 24, category: "Fitness" },
        50: { value: 31, category: "Average" },
        75: { value: 38, category: "Overweight" },
        95: { value: 43, category: "Obese" },
      },
      healthRisks: {
        veryLow: ["Hormone disruption", "Decreased immune function"],
        low: [],
        average: [],
        high: ["Increased cardiovascular risk", "Higher diabetes risk"],
        veryHigh: ["Significantly increased health risks", "Metabolic syndrome risk"]
      }
    }
  }
};

/**
 * Get the body fat percentile information based on age, gender and body fat percentage
 */
export function getBodyFatPercentile(
  age: number,
  gender: string,
  bodyFatPercentage: number
): { percentile: number; category?: string; healthRisks: string[] } {
  // Determine age bracket
  let ageBracket = "50+";
  if (age < 30) ageBracket = "18-29";
  else if (age < 40) ageBracket = "30-39";
  else if (age < 50) ageBracket = "40-49";

  // Get gender-specific data
  const genderData = gender.toLowerCase() === "female" 
    ? bodyFatReferenceData.female 
    : bodyFatReferenceData.male;

  // Get age-specific data
  const ageData = genderData[ageBracket as keyof typeof genderData];
  if (!ageData) {
    return { percentile: 0, healthRisks: [] };
  }

  // Calculate percentile using linear interpolation between known percentiles
  const percentiles = Object.entries(ageData.percentiles).map(
    ([percentile, data]) => ({
      percentile: parseInt(percentile),
      value: data.value,
      category: data.category,
    })
  );
  
  // Sort by body fat value
  percentiles.sort((a, b) => a.value - b.value);

  // If below lowest percentile
  if (bodyFatPercentage <= percentiles[0].value) {
    return { 
      percentile: percentiles[0].percentile, 
      category: percentiles[0].category,
      healthRisks: ageData.healthRisks.veryLow 
    };
  }

  // If above highest percentile
  if (bodyFatPercentage >= percentiles[percentiles.length - 1].value) {
    return { 
      percentile: percentiles[percentiles.length - 1].percentile,
      category: percentiles[percentiles.length - 1].category,
      healthRisks: ageData.healthRisks.veryHigh
    };
  }

  // Find the two closest percentiles and interpolate
  for (let i = 0; i < percentiles.length - 1; i++) {
    const lower = percentiles[i];
    const upper = percentiles[i + 1];

    if (bodyFatPercentage >= lower.value && bodyFatPercentage <= upper.value) {
      // Linear interpolation
      const range = upper.value - lower.value;
      const position = bodyFatPercentage - lower.value;
      const percentPosition = position / range;
      
      const interpolatedPercentile = Math.round(
        lower.percentile + percentPosition * (upper.percentile - lower.percentile)
      );
      
      // Determine health risks category based on percentile
      let healthRisks: string[] = [];
      if (interpolatedPercentile <= 5) healthRisks = ageData.healthRisks.veryLow;
      else if (interpolatedPercentile <= 15) healthRisks = ageData.healthRisks.low;
      else if (interpolatedPercentile <= 75) healthRisks = ageData.healthRisks.average;
      else if (interpolatedPercentile <= 90) healthRisks = ageData.healthRisks.high;
      else healthRisks = ageData.healthRisks.veryHigh;
      
      // Determine category based on closest percentile
      const closerToUpper = percentPosition > 0.5;
      const category = closerToUpper ? upper.category : lower.category;

      return { 
        percentile: interpolatedPercentile,
        category,
        healthRisks
      };
    }
  }

  // Fallback (should not reach here if data is properly structured)
  return { percentile: 50, category: "Average", healthRisks: [] };
}

/**
 * Calculate activity multiplier based on the three components
 */
export function calculateActivityMultiplier(activityProfile: {
  occupation: string;
  dailyMovement: string;
  structuredExercise: string;
}) {
  const { occupation, dailyMovement, structuredExercise } = activityProfile;
  
  // Define multipliers for each activity level
  const activityLevels = {
    occupation: {
      sedentary: { multiplier: 0.1, description: "Desk job, minimal movement" },
      light: { multiplier: 0.175, description: "Standing job, light activity" },
      moderate: { multiplier: 0.25, description: "Active job with regular movement" },
      heavy: { multiplier: 0.35, description: "Physical labor job" },
      "very-heavy": { multiplier: 0.45, description: "Heavy manual labor" },
    },
    dailyLife: {
      minimal: { multiplier: 0.05, description: "Less than 4,000 steps per day" },
      light: { multiplier: 0.1, description: "4,000-7,000 steps per day" },
      moderate: { multiplier: 0.15, description: "7,000-10,000 steps per day" },
      active: { multiplier: 0.2, description: "10,000-15,000 steps per day" },
      "very-active": { multiplier: 0.25, description: "More than 15,000 steps per day" },
    },
    exercise: {
      none: { multiplier: 0.0, description: "No structured exercise" },
      light: { multiplier: 0.1, description: "1-2 light sessions weekly" },
      moderate: { multiplier: 0.2, description: "2-3 moderate sessions weekly" },
      active: { multiplier: 0.3, description: "3-4 intense sessions weekly" },
      athlete: { multiplier: 0.4, description: "5+ intense sessions weekly" },
    },
  };
  
  // Component multipliers from activity levels
  const occupationMultiplier = activityLevels.occupation[occupation as keyof typeof activityLevels.occupation]?.multiplier || 0.1;
  const dailyLifeMultiplier = activityLevels.dailyLife[dailyMovement as keyof typeof activityLevels.dailyLife]?.multiplier || 0.05;
  const exerciseMultiplier = activityLevels.exercise[structuredExercise as keyof typeof activityLevels.exercise]?.multiplier || 0.0;
  
  // Base multiplier represents BMR
  const baseMultiplier = 1.0;
  
  // Combined activity multiplier
  const totalMultiplier = baseMultiplier + occupationMultiplier + dailyLifeMultiplier + exerciseMultiplier;
  
  return {
    totalMultiplier,
    components: { occupation: occupationMultiplier, dailyLife: dailyLifeMultiplier, exercise: exerciseMultiplier },
    descriptions: {
      occupation: activityLevels.occupation[occupation as keyof typeof activityLevels.occupation]?.description || "",
      dailyLife: activityLevels.dailyLife[dailyMovement as keyof typeof activityLevels.dailyLife]?.description || "",
      exercise: activityLevels.exercise[structuredExercise as keyof typeof activityLevels.exercise]?.description || "",
    }
  };
}

/**
 * Calculate metabolic adaptation based on dieting duration and weight loss
 */
export function calculateMetabolicAdaptation(params: {
  consecutiveWeeksDieting: number;
  adaptationRate: number;
  maximumAdaptation: number;
  initialWeight: number;
  currentWeight: number;
}): number {
  const { 
    consecutiveWeeksDieting, 
    adaptationRate, 
    maximumAdaptation, 
    initialWeight, 
    currentWeight 
  } = params;
  
  // Calculate time-based adaptation component
  const timeBasedAdaptation = Math.min(
    (adaptationRate / 100) * consecutiveWeeksDieting, 
    maximumAdaptation / 100
  );
  
  // Weight-loss based component
  let weightLossComponent = 0;
  if (initialWeight > 0 && currentWeight > 0 && initialWeight > currentWeight) {
    const percentWeightLost = ((initialWeight - currentWeight) / initialWeight) * 100;
    const weightLossImpact = 0.5; // Weight loss impact factor
    weightLossComponent = (percentWeightLost / 10) * weightLossImpact / 100;
  }
  
  // Total adaptation (capped)
  const totalAdaptation = Math.min(
    timeBasedAdaptation + weightLossComponent, 
    (maximumAdaptation / 100) + weightLossComponent
  );
  
  return totalAdaptation;
}

/**
 * Generate a MATADOR protocol schedule
 */
export function generateMATADORSchedule(
  totalDays: number, 
  options: {
    dietPhaseLength: number;
    breakPhaseLength: number;
    startWithDiet?: boolean;
  }
) {
  const {
    dietPhaseLength = 28, // 4 weeks in days
    breakPhaseLength = 14, // 2 weeks in days
    startWithDiet = true
  } = options;
  
  const schedule = [];
  let currentDay = 0;
  let inDietPhase = startWithDiet;
  
  while (currentDay < totalDays) {
    const currentPhaseLength = inDietPhase ? dietPhaseLength : breakPhaseLength;
    
    for (let i = 0; i < currentPhaseLength && currentDay < totalDays; i++) {
      schedule.push({
        day: currentDay,
        isDeficitDay: inDietPhase,
        weekNumber: Math.floor(currentDay / 7),
        dayInPhase: i + 1,
        phaseType: inDietPhase ? 'deficit' : 'maintenance'
      });
      
      currentDay++;
    }
    
    // Switch phase
    inDietPhase = !inDietPhase;
  }
  
  return schedule;
}

/**
 * Calculate RMR (Resting Metabolic Rate)
 */
export function calculateRMR(user: {
  age: number;
  gender: string;
  weight: number;
  height: number;
  bodyFatPercentage: number;
}): number {
  const { age, gender, weight, height, bodyFatPercentage } = user;
  
  // Calculate lean body mass
  const leanMass = weight * (1 - (bodyFatPercentage / 100));
  
  let rmr = 0;
  
  // Use appropriate formula based on body composition
  if ((gender.toLowerCase() === 'male' && bodyFatPercentage < 15) || 
      (gender.toLowerCase() === 'female' && bodyFatPercentage < 22)) {
    // Katch-McArdle Formula for leaner individuals
    rmr = 370 + (21.6 * leanMass);
  } else {
    // Mifflin-St Jeor Equation for general population
    if (gender.toLowerCase() === 'male') {
      rmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      rmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  }
  
  return Math.round(rmr);
}
