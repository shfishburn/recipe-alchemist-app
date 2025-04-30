
import React from 'react';
import { Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Control } from 'react-hook-form';

interface WeightGoalSelectorProps {
  control: Control<any>;
  weightGoalOptions: Array<{
    value: string;
    label: string;
    deficit: number;
  }>;
  setValue: (name: string, value: any) => void;
  unitSystem: 'metric' | 'imperial';
}

export function WeightGoalSelector({ control, weightGoalOptions, setValue, unitSystem }: WeightGoalSelectorProps) {
  // Function to format goal labels based on unit system
  const formatGoalLabel = (label: string): string => {
    if (unitSystem === 'imperial' && label.includes('kg')) {
      // Convert kg mentions to lbs in the labels
      return label
        .replace('1kg/week', '2lbs/week')
        .replace('0.5kg/week', '1lb/week')
        .replace('0.25kg/week', '0.5lb/week');
    }
    return label;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="weightGoalType">Weight Management Goal</Label>
      <Controller
        control={control}
        name="weightGoalType"
        render={({ field }) => (
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              const goalOption = weightGoalOptions.find(goal => goal.value === value);
              if (goalOption) {
                setValue('weightGoalDeficit', goalOption.deficit);
              }
            }}
            defaultValue={field.value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              {weightGoalOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {formatGoalLabel(option.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
