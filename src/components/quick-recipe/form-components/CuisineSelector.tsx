
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface CuisineSelectorProps {
  value: string;
  onChange: (cuisine: string) => void;
}

// Define a consistent ordered list of cuisines that matches database enum values
const cuisineOptions = [
  { value: "any", label: "Any Cuisine" },
  { value: "american", label: "American" },
  { value: "cajun-creole", label: "Cajun/Creole" },
  { value: "chinese", label: "Chinese" },
  { value: "eastern-european", label: "Eastern European" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "greek", label: "Greek" },
  { value: "indian", label: "Indian" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "mexican", label: "Mexican" },
  { value: "middle-eastern", label: "Middle Eastern" },
  { value: "southern", label: "Southern" },
  { value: "southwestern", label: "Southwestern" },
  { value: "spanish", label: "Spanish" },
  { value: "thai", label: "Thai" },
  { value: "vietnamese", label: "Vietnamese" }
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
