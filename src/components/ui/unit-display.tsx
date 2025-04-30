
import React from 'react';
import { kgToLbs, cmToFtIn } from '@/utils/unit-conversion';

interface WeightDisplayProps {
  weightKg: number;
  unitSystem: 'metric' | 'imperial';
  className?: string;
  decimals?: number;
}

export function WeightDisplay({ weightKg, unitSystem, className = '', decimals = 1 }: WeightDisplayProps) {
  if (unitSystem === 'metric') {
    return <span className={className}>{weightKg.toFixed(decimals)} kg</span>;
  } else {
    const weightLbs = kgToLbs(weightKg);
    return <span className={className}>{weightLbs.toFixed(decimals)} lbs</span>;
  }
}

interface HeightDisplayProps {
  heightCm: number;
  unitSystem: 'metric' | 'imperial';
  className?: string;
  decimals?: number;
}

export function HeightDisplay({ heightCm, unitSystem, className = '', decimals = 1 }: HeightDisplayProps) {
  if (unitSystem === 'metric') {
    return <span className={className}>{heightCm.toFixed(decimals)} cm</span>;
  } else {
    const { feet, inches } = cmToFtIn(heightCm);
    return <span className={className}>{feet}'{inches}"</span>;
  }
}

interface UnitToggleProps {
  unitSystem: 'metric' | 'imperial';
  onChange: (unitSystem: 'metric' | 'imperial') => void;
  className?: string;
}

export function UnitToggle({ unitSystem, onChange, className = '' }: UnitToggleProps) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        type="button"
        className={`px-2 py-1 text-xs rounded ${
          unitSystem === 'metric' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}
        onClick={() => onChange('metric')}
      >
        Metric
      </button>
      <button
        type="button"
        className={`px-2 py-1 text-xs rounded ${
          unitSystem === 'imperial' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}
        onClick={() => onChange('imperial')}
      >
        Imperial
      </button>
    </div>
  );
}
