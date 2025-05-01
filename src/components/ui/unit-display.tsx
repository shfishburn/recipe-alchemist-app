
import React from 'react';
import { getWeightDisplay, getHeightDisplay } from '@/utils/unit-conversion';

/**
 * Format a nutrition value for display, rounding to integer for cleaner UI
 */
export function formatNutritionValue(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  return Math.round(value).toString();
}

/**
 * Format a nutrient with its unit for display
 * Handles unit conversion based on unit system preference
 */
export function formatNutrientWithUnit(
  value: number | undefined | null, 
  unit: string,
  unitSystem: 'metric' | 'imperial' = 'metric'
): string {
  // Handle null/undefined values
  if (value === undefined || value === null || isNaN(Number(value))) {
    return `0${unit}`;
  }

  // Round to integer for cleaner display
  const roundedValue = Math.round(Number(value));

  // Convert units if needed based on unit system
  if (unitSystem === 'imperial' && unit === 'g' && roundedValue >= 1000) {
    // Convert to pounds for large values
    return `${(roundedValue / 453.592).toFixed(1)} lb`;
  }

  return `${roundedValue}${unit}`;
}

interface UnitValueProps {
  value: number;
  unit: string;
  unitSystem: 'metric' | 'imperial';
  decimals?: number;
  className?: string;
}

export function UnitValue({ value, unit, unitSystem, decimals = 1, className }: UnitValueProps) {
  const formattedValue = formatNutrientWithUnit(value, unit, unitSystem);
  
  return (
    <span className={className}>
      {formattedValue}
    </span>
  );
}

interface WeightDisplayProps {
  weightKg: number;
  unitSystem: 'metric' | 'imperial';
  decimals?: number;
  className?: string;
}

export function WeightDisplay({ weightKg, unitSystem, decimals = 1, className }: WeightDisplayProps) {
  const formattedWeight = getWeightDisplay(weightKg, unitSystem, decimals);
  
  return (
    <span className={className}>
      {formattedWeight}
    </span>
  );
}

interface HeightDisplayProps {
  heightCm: number;
  unitSystem: 'metric' | 'imperial';
  className?: string;
}

export function HeightDisplay({ heightCm, unitSystem, className }: HeightDisplayProps) {
  const formattedHeight = getHeightDisplay(heightCm, unitSystem);
  
  return (
    <span className={className}>
      {formattedHeight}
    </span>
  );
}

interface NutrientDisplayProps {
  value: number;
  unitSystem: 'metric' | 'imperial';
  unit?: string;
  className?: string;
}

export function NutrientDisplay({ value, unitSystem, unit = 'g', className }: NutrientDisplayProps) {
  return (
    <UnitValue 
      value={value} 
      unit={unit}
      unitSystem={unitSystem}
      className={className}
    />
  );
}

// Export other utility functions
export { getWeightDisplay, getHeightDisplay };
