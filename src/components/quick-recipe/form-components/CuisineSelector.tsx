
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export interface CuisineSelectorProps {
  value: string;
  onChange: (cuisine: string) => void;
}

// Define cuisine options grouped by their proper database cuisine_category enum values
const cuisineOptions = [
  {
    category: "Global",
    options: [
      { value: "any", label: "Any Cuisine" },
      { value: "american", label: "American" },
      { value: "brazilian", label: "Brazilian" },
      { value: "caribbean", label: "Caribbean" }
    ]
  },
  {
    category: "Asian",
    options: [
      { value: "chinese", label: "Chinese" },
      { value: "indian", label: "Indian" },
      { value: "japanese", label: "Japanese" },
      { value: "korean", label: "Korean" },
      { value: "thai", label: "Thai" },
      { value: "vietnamese", label: "Vietnamese" }
    ]
  },
  {
    category: "European",
    options: [
      { value: "eastern-european", label: "Eastern European" },
      { value: "french", label: "French" },
      { value: "german", label: "German" },
      { value: "greek", label: "Greek" },
      { value: "italian", label: "Italian" },
      { value: "mediterranean", label: "Mediterranean" },
      { value: "spanish", label: "Spanish" }
    ]
  },
  {
    category: "Regional American",
    options: [
      { value: "cajun-creole", label: "Cajun/Creole" },
      { value: "southern", label: "Southern" },
      { value: "southwestern", label: "Southwestern" },
      { value: "tex-mex", label: "Tex-Mex" }
    ]
  },
  {
    category: "Dietary Styles",
    options: [
      { value: "gluten-free", label: "Gluten-Free" },
      { value: "keto", label: "Keto" },
      { value: "low-fodmap", label: "Low-FODMAP" },
      { value: "paleo", label: "Paleo" },
      { value: "plant-based", label: "Plant-Based" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "whole30", label: "Whole30" }
    ]
  },
  {
    category: "Middle Eastern",
    options: [
      { value: "middle-eastern", label: "Middle Eastern" }
    ]
  }
];

// The component now gets the value and onChange from props
export function CuisineSelector({ value, onChange }: CuisineSelectorProps) {
  // Flatten all options for the selector
  const allOptions = cuisineOptions.flatMap(group => group.options);

  return (
    <div className="w-full">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select cuisine">
            {value ? allOptions.find(option => option.value === value)?.label : "Select cuisine"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white max-h-[300px]">
          {cuisineOptions.map((group) => (
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
