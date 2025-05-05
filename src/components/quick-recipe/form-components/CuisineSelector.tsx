
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface CuisineSelectorProps {
  value: string;
  onChange: (cuisine: string) => void;
}

// Define a consistent ordered list of cuisines that matches database enum values
const cuisineOptions = [
  { value: "any", label: "Any Cuisine" },
  { value: "american-traditional", label: "American" },
  { value: "asian", label: "Asian" },
  { value: "cajun-creole", label: "Cajun" },
  { value: "french", label: "French" },
  { value: "indian", label: "Indian" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "mexican", label: "Mexican" },
  { value: "thai", label: "Thai" }
];

export function CuisineSelector({ value, onChange }: CuisineSelectorProps) {
  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select cuisine" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {cuisineOptions.map((cuisine) => (
            <SelectItem key={cuisine.value} value={cuisine.value}>
              {cuisine.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
