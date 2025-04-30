
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WeightInputProps {
  register: any;
  unitSystem: 'metric' | 'imperial';
}

export function WeightInput({ register, unitSystem }: WeightInputProps) {
  const weightUnitLabel = unitSystem === 'metric' ? '(kg)' : '(lbs)';
  const weightMinValue = unitSystem === 'metric' ? 40 : 90;
  const weightMaxValue = unitSystem === 'metric' ? 200 : 440;

  return (
    <div className="space-y-2">
      <Label htmlFor="weight">Weight {weightUnitLabel}</Label>
      <Input
        id="weight"
        type="number"
        min={weightMinValue}
        max={weightMaxValue}
        step="0.1"
        {...register('weight')}
      />
    </div>
  );
}
