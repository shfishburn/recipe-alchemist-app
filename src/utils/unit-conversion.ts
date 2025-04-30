
/**
 * Utility functions for converting between metric and imperial units
 */

// Weight conversions
export const kgToLbs = (kg: number): number => {
  return kg * 2.20462;
};

export const lbsToKg = (lbs: number): number => {
  return lbs / 2.20462;
};

// Height conversions
export const cmToFtIn = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm * 0.393701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

export const ftInToCm = (feet: number, inches: number): number => {
  return (feet * 12 + inches) * 2.54;
};

// Format weight based on unit system
export const formatWeight = (weight: number, unitSystem: 'metric' | 'imperial'): string => {
  if (unitSystem === 'metric') {
    return `${weight.toFixed(1)} kg`;
  } else {
    return `${kgToLbs(weight).toFixed(1)} lbs`;
  }
};

// Format height based on unit system
export const formatHeight = (heightCm: number, unitSystem: 'metric' | 'imperial'): string => {
  if (unitSystem === 'metric') {
    return `${heightCm.toFixed(1)} cm`;
  } else {
    const { feet, inches } = cmToFtIn(heightCm);
    return `${feet}'${inches}"`;
  }
};

// Convert weight input based on current unit system to kg (stored value)
export const convertWeightToKg = (weight: number, unitSystem: 'metric' | 'imperial'): number => {
  if (unitSystem === 'metric') {
    return weight;
  } else {
    return lbsToKg(weight);
  }
};

// Convert weight from kg (stored) to display value in current unit system
export const convertWeightFromKg = (weightKg: number, unitSystem: 'metric' | 'imperial'): number => {
  if (unitSystem === 'metric') {
    return weightKg;
  } else {
    return kgToLbs(weightKg);
  }
};
