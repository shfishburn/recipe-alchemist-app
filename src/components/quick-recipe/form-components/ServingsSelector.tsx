
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ServingsSelectorProps {
  selectedServings: number | undefined;
  onServingsChange: (servings: number) => void; 
}

export function ServingsSelector({ selectedServings, onServingsChange }: ServingsSelectorProps) {
  const isMobile = useIsMobile();
  
  // Ensure selectedServings has a valid value
  const servingValue = selectedServings !== undefined ? selectedServings.toString() : '4';
  
  // Define common serving options
  const servingOptions = [1, 2, 3, 4, 6, 8];

  return (
    <div className="w-full">
      <Select 
        value={servingValue} 
        onValueChange={(value) => onServingsChange(parseInt(value, 10))}
      >
        <SelectTrigger 
          className={`w-full ${isMobile ? 'h-9 text-sm' : 'h-10'}`}
          aria-label="Select number of servings"
        >
          <SelectValue placeholder="Select servings" />
        </SelectTrigger>
        
        <SelectContent 
          position={isMobile ? "popper" : "item-aligned"}
          className="bg-white dark:bg-gray-800"
        >
          {servingOptions.map((servings) => (
            <SelectItem 
              key={servings} 
              value={servings.toString()} 
              className="px-3 py-2"
            >
              {servings} {servings === 1 ? 'serving' : 'servings'}
            </SelectItem>
          ))}
          <SelectItem value="10" className="px-3 py-2">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
