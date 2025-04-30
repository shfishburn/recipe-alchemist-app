
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
