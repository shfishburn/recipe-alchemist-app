
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { dietaryOptions } from './constants';

interface DietaryRestrictionsProps {
  control: Control<any>;
}

export function DietaryRestrictions({ control }: DietaryRestrictionsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Dietary Restrictions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Controller
          control={control}
          name="dietaryRestrictions"
          render={({ field }) => (
            <>
              {dietaryOptions.map((option) => (
                <div className="flex items-center space-x-2" key={option.id}>
                  <Checkbox
                    id={option.id}
                    checked={field.value.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...field.value, option.id]);
                      } else {
                        field.onChange(field.value.filter((value: string) => value !== option.id));
                      }
                    }}
                  />
                  <Label htmlFor={option.id} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
}
