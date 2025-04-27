
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MealsPerDaySelectProps {
  value: number;
  onChange: (value: number) => void;
}

export function MealsPerDaySelect({ value, onChange }: MealsPerDaySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="mealsPerDay">Meals Per Day</Label>
      <Select
        onValueChange={(value) => onChange(parseInt(value))}
        defaultValue={value.toString()}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select number of meals" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2">2 meals</SelectItem>
          <SelectItem value="3">3 meals</SelectItem>
          <SelectItem value="4">4 meals</SelectItem>
          <SelectItem value="5">5 meals</SelectItem>
          <SelectItem value="6">6 meals</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
