
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
}

export function WeightGoalSelector({ control, weightGoalOptions, setValue }: WeightGoalSelectorProps) {
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
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
