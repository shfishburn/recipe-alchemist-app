
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ftInToCm, cmToFtIn } from '@/utils/unit-conversion';

interface HeightInputProps {
  register: any;
  unitSystem: 'metric' | 'imperial';
  heightFeet: number;
  heightInches: number;
  setHeightFeet: (feet: number) => void;
  setHeightInches: (inches: number) => void;
}

export function HeightInput({ 
  register, 
  unitSystem,
  heightFeet,
  heightInches, 
  setHeightFeet,
  setHeightInches 
}: HeightInputProps) {
  const heightUnitLabel = unitSystem === 'metric' ? '(cm)' : '';

  if (unitSystem === 'metric') {
    return (
      <div className="space-y-2">
        <Label htmlFor="height">Height {heightUnitLabel}</Label>
        <Input
          id="height"
          type="number"
          min="140"
          max="220"
          {...register('height')}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor="height">Height (ft/in)</Label>
      <div className="flex space-x-2">
        <div className="w-1/2">
          <select 
            className="w-full rounded-md border border-input bg-background px-3 h-10"
            value={heightFeet}
            onChange={(e) => {
              const newFeet = Number(e.target.value);
              setHeightFeet(newFeet);
              // Update the hidden height input with equivalent in cm
              const heightCm = ftInToCm(newFeet, heightInches);
              register('height').onChange({ target: { value: heightCm } });
            }}
          >
            {[4, 5, 6, 7].map(feet => (
              <option key={feet} value={feet}>{feet} ft</option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <select 
            className="w-full rounded-md border border-input bg-background px-3 h-10"
            value={heightInches}
            onChange={(e) => {
              const newInches = Number(e.target.value);
              setHeightInches(newInches);
              // Update the hidden height input with equivalent in cm
              const heightCm = ftInToCm(heightFeet, newInches);
              register('height').onChange({ target: { value: heightCm } });
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{i} in</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
