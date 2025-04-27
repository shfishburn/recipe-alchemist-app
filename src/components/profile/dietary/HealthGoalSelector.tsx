
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { healthGoalOptions } from './constants';

interface HealthGoalSelectorProps {
  control: Control<any>;
}

export function HealthGoalSelector({ control }: HealthGoalSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Health Goal</h3>
      <Controller
        control={control}
        name="healthGoal"
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
            {healthGoalOptions.map((option) => (
              <div className="flex items-center space-x-2" key={option.value}>
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  );
}
