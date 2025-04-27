
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MealSizeSelectorProps {
  control: Control<any>;
}

export function MealSizeSelector({ control }: MealSizeSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Meal Size Preference</h3>
      <Controller
        control={control}
        name="mealSizePreference"
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="meal-size-small" />
              <Label htmlFor="meal-size-small">Small</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="meal-size-medium" />
              <Label htmlFor="meal-size-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="meal-size-large" />
              <Label htmlFor="meal-size-large">Large</Label>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
}
