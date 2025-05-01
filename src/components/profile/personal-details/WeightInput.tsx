
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { kgToLbs, lbsToKg } from '@/utils/unit-conversion';

interface WeightInputProps {
  register: any;
  unitSystem: 'metric' | 'imperial';
  setValue?: (name: string, value: any) => void;
  watch?: (name: string) => any;
}

export function WeightInput({ register, unitSystem, setValue, watch }: WeightInputProps) {
  const weightUnitLabel = unitSystem === 'metric' ? '(kg)' : '(lbs)';
  const weightMinValue = unitSystem === 'metric' ? 40 : 90;
  const weightMaxValue = unitSystem === 'metric' ? 200 : 440;
  
  // If we have both setValue and watch, we can handle unit conversion automatically
  useEffect(() => {
    if (setValue && watch) {
      const currentWeight = watch('weight');
      if (currentWeight) {
        // Whenever unit system changes, convert the weight value
        if (unitSystem === 'imperial') {
          setValue('weight', Math.round(kgToLbs(currentWeight) * 10) / 10);
        } else {
          setValue('weight', Math.round(lbsToKg(currentWeight) * 10) / 10);
        }
      }
    }
  }, [unitSystem, setValue, watch]);

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
