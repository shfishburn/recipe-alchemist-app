
import React from 'react';
import { MultiSelect, SelectOption } from '@/components/ui/multi-select';

export interface DietarySelectorProps {
  value: string[];
  onChange: (dietary: string[]) => void;
}

// Define a consistent ordered list of dietary options
const dietaryOptions: SelectOption[] = [
  { value: "any", label: "No Restrictions" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "low-carb", label: "Low-Carb" },
  { value: "low-fat", label: "Low-Fat" },
  { value: "high-protein", label: "High-Protein" },
  { value: "low-sodium", label: "Low-Sodium" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "nut-free", label: "Nut-Free" },
  { value: "soy-free", label: "Soy-Free" },
  { value: "egg-free", label: "Egg-Free" }
];

export function DietarySelector({ value, onChange }: DietarySelectorProps) {
  // Handle dietary selection with max 4 limit
  const handleDietaryChange = (selected: string[]) => {
    onChange(selected);
  };

  return (
    <div className="w-full">
      <MultiSelect
        options={dietaryOptions}
        selected={value}
        onChange={handleDietaryChange}
        placeholder="Select dietary preference (max 4)"
        maxSelections={4}
      />
    </div>
  );
}
