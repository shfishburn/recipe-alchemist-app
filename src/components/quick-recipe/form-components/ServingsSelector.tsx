
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface ServingsSelectorProps {
  selectedServings: number | undefined;
  onServingsChange: (servings: number) => void; 
}

export function ServingsSelector({ selectedServings, onServingsChange }: ServingsSelectorProps) {
  // Ensure selectedServings has a valid value for toString()
  const servingValue = selectedServings !== undefined ? selectedServings.toString() : '2';

  return (
    <div className="w-full">
      <Select 
        value={servingValue} 
        onValueChange={(value) => onServingsChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-full h-10">
          <SelectValue placeholder="Select servings" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800">
          {[1, 2, 3, 4, 6, 8].map((servings) => (
            <SelectItem key={servings} value={servings.toString()} className="px-3 py-2">
              {servings} {servings === 1 ? 'serving' : 'servings'}
            </SelectItem>
          ))}
          <SelectItem value="10" className="px-3 py-2">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
