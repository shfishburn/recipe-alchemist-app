/**
 * Convert from kg to pounds
 */
export function kgToLbs(weight: number): number {
  return weight * 2.20462;
}

/**
 * Convert from pounds to kg
 */
export function lbsToKg(weight: number): number {
  return weight / 2.20462;
}

/**
 * Convert from cm to feet and inches
 */
export function cmToFtIn(height: number): { feet: number; inches: number } {
  const totalInches = height / 2.54;
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
  return Math.round(totalInches * 2.54);
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
 * Convert recipe units to shopping units
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
