/**
 * Unit conversion constants
 */
export const UNIT_CONVERSIONS = {
  // Length
  KILOMETERS_TO_MILES: 0.621371,
  MILES_TO_KILOMETERS: 1.60934,
  METERS_TO_FEET: 3.28084,
  FEET_TO_METERS: 0.3048,
  CENTIMETERS_TO_INCHES: 0.393701,
  INCHES_TO_CENTIMETERS: 2.54,
  
  // Weight
  KILOGRAMS_TO_POUNDS: 2.20462,
  POUNDS_TO_KILOGRAMS: 0.453592,
  GRAMS_TO_OUNCES: 0.035274,
  OUNCES_TO_GRAMS: 28.3495,
  
  // Volume
  LITERS_TO_GALLONS: 0.264172,
  GALLONS_TO_LITERS: 3.78541,
  MILLILITERS_TO_FLOZ: 0.033814,
  FLOZ_TO_MILLILITERS: 29.5735,
};

/**
 * Convert from kg to pounds
 */
export function kgToLbs(weight: number): number {
  return weight * UNIT_CONVERSIONS.KILOGRAMS_TO_POUNDS;
}

/**
 * Convert from pounds to kg
 */
export function lbsToKg(weight: number): number {
  return weight * UNIT_CONVERSIONS.POUNDS_TO_KILOGRAMS;
}

/**
 * Convert from cm to feet and inches
 */
export function cmToFtIn(height: number): { feet: number; inches: number } {
  const totalInches = height * UNIT_CONVERSIONS.CENTIMETERS_TO_INCHES;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  
  // Handle case where inches equals 12
  if (inches === 12) {
    return { feet: feet + 1, inches: 0 };
  }
  
  return { feet, inches };
}

/**
 * Convert from feet and inches to cm
 */
export function ftInToCm(feet: number, inches: number): number {
  const totalInches = (feet * 12) + inches;
  return Math.round(totalInches * UNIT_CONVERSIONS.INCHES_TO_CENTIMETERS);
}

/**
 * Convert weight from kg to the specified unit system
 */
export function convertWeightFromKg(weightKg: number, unitSystem: 'metric' | 'imperial'): number {
  if (unitSystem === 'imperial') {
    return kgToLbs(weightKg);
  }
  return weightKg;
}

/**
 * Convert weight to kg from the specified unit system
 */
export function convertWeightToKg(weight: number, unitSystem: 'metric' | 'imperial'): number {
  if (unitSystem === 'imperial') {
    return lbsToKg(weight);
  }
  return weight;
}

/**
 * Format a nutrient value with the appropriate unit
 */
export function formatNutrientWithUnit(value: number, unit: string, unitSystem: 'metric' | 'imperial'): string {
  if (!value && value !== 0) return 'N/A';
  
  // Round to 1 decimal place for most values, or to integer for larger values
  const formattedValue = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  
  // Convert units if necessary based on the unit system
  if (unitSystem === 'imperial') {
    if (unit === 'g') {
      // Convert grams to ounces for imperial
      return `${(formattedValue * UNIT_CONVERSIONS.GRAMS_TO_OUNCES).toFixed(1)} oz`;
    }
    if (unit === 'mg' && value > 1000) {
      // Large mg values convert to fraction of an ounce
      return `${(formattedValue / 1000 * UNIT_CONVERSIONS.GRAMS_TO_OUNCES).toFixed(2)} oz`;
    }
  }
  
  // Default: return the value with its original unit
  return `${formattedValue} ${unit}`;
}

/**
 * Get unit-specific display for weight
 */
export function getWeightDisplay(weightKg: number, unitSystem: 'metric' | 'imperial', decimals: number = 1): string {
  if (unitSystem === 'imperial') {
    const weightLbs = kgToLbs(weightKg);
    return `${weightLbs.toFixed(decimals)} lbs`;
  }
  return `${weightKg.toFixed(decimals)} kg`;
}

/**
 * Get unit-specific display for height
 */
export function getHeightDisplay(heightCm: number, unitSystem: 'metric' | 'imperial'): string {
  if (unitSystem === 'imperial') {
    const { feet, inches } = cmToFtIn(heightCm);
    return `${feet}'${inches}"`;
  }
  return `${Math.round(heightCm)} cm`;
}

/**
 * Recipe units to shopping units
 * This is used to convert recipe measurements to practical shopping measurements
 */
export function getShoppingQuantity(qty: number, unit: string): { qty: number, unit: string } {
  // Handle common conversions to more practical shopping units
  if (unit === 'g' && qty >= 1000) {
    return { qty: qty / 1000, unit: 'kg' };
  }
  
  if (unit === 'ml' && qty >= 1000) {
    return { qty: qty / 1000, unit: 'L' };
  }
  
  if (unit === 'tsp' && qty >= 3) {
    return { qty: qty / 3, unit: 'tbsp' };
  }
  
  if (unit === 'tbsp' && qty >= 16) {
    return { qty: qty / 16, unit: 'cup' };
  }
  
  // For small amounts of spices, we often buy by container not exact measure
  if ((unit === 'tsp' || unit === 'tbsp') && 
      (qty <= 2) && 
      (unit === 'tsp' || unit === 'tbsp')) {
    return { qty: 1, unit: 'small container' };
  }
  
  // Default - keep original measurement
  return { qty, unit };
}
