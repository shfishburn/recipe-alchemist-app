import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface ServingsSelectorProps {
  selectedServings: number;
  onServingsChange: (servings: number) => void; // Changed from onServingsSelect
}

export function ServingsSelector({ selectedServings, onServingsChange }: ServingsSelectorProps) {
  return (
    <div className="w-full">
      <Select 
        value={selectedServings.toString()} 
        onValueChange={(value) => onServingsChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select servings" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 6, 8].map((servings) => (
            <SelectItem key={servings} value={servings.toString()}>
              {servings} {servings === 1 ? 'serving' : 'servings'}
            </SelectItem>
          ))}
          <SelectItem value="10">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
