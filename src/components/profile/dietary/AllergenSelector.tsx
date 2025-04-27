
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { allergenOptions } from './constants';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface AllergenSelectorProps {
  control: Control<any>;
  preferences: NutritionPreferencesType;
}

export function AllergenSelector({ control, preferences }: AllergenSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Allergens</h3>
      <Controller
        control={control}
        name="allergens"
        render={({ field }) => (
          <Select 
            value={field.value.join(',')}
            onValueChange={(value) => {
              if (value === '') {
                field.onChange([]);
              } else {
                field.onChange(value.split(','));
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select allergens" />
            </SelectTrigger>
            <SelectContent>
              {allergenOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <p className="text-xs text-muted-foreground mt-1">
        Selected allergens: {preferences.allergens?.join(', ') || 'None'}
      </p>
    </div>
  );
}
