
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface DietarySelectorProps {
  value: string;
  onChange: (dietary: string) => void;
}

// Define a consistent ordered list of dietary options
const dietaryOptions = [
  { value: "any", label: "No Restrictions" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "low-carb", label: "Low-Carb" },
  { value: "low-fat", label: "Low-Fat" },
  { value: "high-protein", label: "High-Protein" }
];

export function DietarySelector({ value, onChange }: DietarySelectorProps) {
  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select dietary preference" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {dietaryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
