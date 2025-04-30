
import { NutritionPreferencesType } from '@/types/nutrition';

export function calculateMetabolics(prefs: NutritionPreferencesType) {
  const { age, weight, height, gender, activityLevel } = prefs.personalDetails || {};
  
  if (!age || !weight || !height || !gender) {
    return { bmr: 0, tdee: 0, adaptedTDEE: 0 };
  }
  
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr = 0;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * (activityMultipliers[activityLevel || 'moderate'] || 1.55);
  
  // Calculate adapted TDEE if there's adaptation tracking
  let adaptedTDEE = tdee;
  if (prefs.adaptationTracking?.adaptationPercentage) {
    adaptedTDEE = tdee * (1 - prefs.adaptationTracking.adaptationPercentage / 100);
  }
  
  return { bmr, tdee, adaptedTDEE };
}
