
import React from 'react';
import { formatNutrientWithUnit, getWeightDisplay, getHeightDisplay } from '@/utils/unit-conversion';

// Function to format a nutrition value (rounding to integers for readability)
export function formatNutritionValue(value: number): string {
  if (!value && value !== 0) return 'N/A';
  return value >= 10 ? Math.round(value).toString() : value.toFixed(1);
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

// Make sure to export the formatNutrientWithUnit function from this file too
export { formatNutrientWithUnit, getWeightDisplay, getHeightDisplay };
