
import React from 'react';

interface WeightDisplayProps {
  weightKg: number;
  unitSystem: 'metric' | 'imperial';
  decimals?: number;
}

export function WeightDisplay({ weightKg, unitSystem, decimals = 1 }: WeightDisplayProps) {
  const weight = unitSystem === 'metric' 
    ? weightKg 
    : weightKg * 2.20462;
    
  const unit = unitSystem === 'metric' ? 'kg' : 'lbs';
  
  return (
    <span>{weight.toFixed(decimals)} {unit}</span>
  );
}

interface HeightDisplayProps {
  heightCm: number;
  unitSystem: 'metric' | 'imperial';
}

export function HeightDisplay({ heightCm, unitSystem }: HeightDisplayProps) {
  if (unitSystem === 'metric') {
    return <span>{heightCm} cm</span>;
  } else {
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return <span>{feet}'{inches}"</span>;
  }
}
