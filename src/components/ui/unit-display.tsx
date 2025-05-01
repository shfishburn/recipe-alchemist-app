
import React from 'react';

interface WeightDisplayProps {
  weightKg: number;
  unitSystem: 'metric' | 'imperial';
  decimals?: number;
}

export function WeightDisplay({ weightKg, unitSystem, decimals = 1 }: WeightDisplayProps) {
  // Skip conversion for zero or invalid values
  if (!weightKg || isNaN(weightKg)) return <span>0</span>;
  
  const weight = unitSystem === 'metric' 
    ? weightKg 
    : weightKg * 2.20462;
    
  const unit = unitSystem === 'metric' ? 'kg' : 'lbs';
  
  // Use more intuitive decimal precision
  let displayDecimals = decimals;
  if (weight < 1) {
    displayDecimals = Math.max(1, decimals);
  } else if (weight >= 10) {
    displayDecimals = 0;
  }
  
  return (
    <span>{weight.toFixed(displayDecimals)} {unit}</span>
  );
}

interface HeightDisplayProps {
  heightCm: number;
  unitSystem: 'metric' | 'imperial';
}

export function HeightDisplay({ heightCm, unitSystem }: HeightDisplayProps) {
  if (!heightCm || isNaN(heightCm)) return <span>0</span>;
  
  if (unitSystem === 'metric') {
    return <span>{Math.round(heightCm)} cm</span>;
  } else {
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    // Handle case where inches is 12
    if (inches === 12) {
      return <span>{feet + 1}'0"</span>;
    }
    return <span>{feet}'{inches}"</span>;
  }
}

// Format with appropriate units for nutrition display
export function formatNutrientWithUnit(
  value: number | undefined | null, 
  unit: string, 
  unitSystem: 'metric' | 'imperial' = 'metric',
  showDecimals = false
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return `0 ${unit}`;
  }
  
  // Apply unit conversions based on user preference
  let displayValue = value;
  let displayUnit = unit;
  
  if (unitSystem === 'imperial') {
    // Convert metric units to imperial
    if (unit === 'g') {
      displayValue = value / 28.35;
      displayUnit = 'oz';
      showDecimals = true;
    } else if (unit === 'kg') {
      displayValue = value * 2.20462;
      displayUnit = 'lb';
      showDecimals = true;
    } else if (unit === 'ml') {
      displayValue = value / 29.57;
      displayUnit = 'fl oz';
      showDecimals = true;
    }
  }
  
  if (showDecimals) {
    return `${displayValue.toFixed(1)} ${displayUnit}`;
  }
  
  return `${Math.round(displayValue)} ${displayUnit}`;
}

// New utility function to format nutrition values appropriately
export function formatNutritionValue(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0";
  }
  
  // Format appropriately based on value size
  if (value < 1 && value > 0) {
    return value.toFixed(1);
  }
  return Math.round(value).toString();
}
