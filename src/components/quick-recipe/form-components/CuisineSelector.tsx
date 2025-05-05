
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { GROUPED_CUISINE_OPTIONS } from '@/config/cuisine-config';

export interface CuisineSelectorProps {
  value: string;
  onChange: (cuisine: string) => void;
}

// The component now gets the value and onChange from props
export function CuisineSelector({ value, onChange }: CuisineSelectorProps) {
  // Flatten all options for finding selected item
  const allOptions = GROUPED_CUISINE_OPTIONS.flatMap(group => group.options);

  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select cuisine">
            {value ? allOptions.find(option => option.value === value)?.label : "Select cuisine"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white max-h-[300px]">
          {GROUPED_CUISINE_OPTIONS.map((group) => (
            <div key={group.category}>
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground bg-muted/50">
                {group.category}
              </div>
              {group.options.map((cuisine) => (
                <SelectItem key={cuisine.value} value={cuisine.value}>
                  {cuisine.label}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
