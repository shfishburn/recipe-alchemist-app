
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple dietary options
const DIETARY_OPTIONS = [
  { id: "vegetarian", name: "Vegetarian", icon: "🥦" },
  { id: "vegan", name: "Vegan", icon: "🌱" },
  { id: "gluten-free", name: "Gluten-Free", icon: "🌾" },
  { id: "dairy-free", name: "Dairy-Free", icon: "🥛" },
  { id: "keto", name: "Keto", icon: "🥑" },
  { id: "low-carb", name: "Low-Carb", icon: "🥩" }
];

interface SimplifiedDietarySelectorProps {
  selected: string[];
  onChange: (values: string[]) => void;
}

export function SimplifiedDietarySelector({ 
  selected = [], 
  onChange 
}: SimplifiedDietarySelectorProps) {
  // Ensure selected is always an array
  const selectedValues = Array.isArray(selected) ? selected : [];
  
  // Toggle selection
  const toggleSelection = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter(item => item !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-1.5 text-foreground">
        <Leaf className="h-4 w-4 text-green-600" />
        Dietary Preferences
      </label>
      
      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => toggleSelection(option.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm flex items-center gap-1 border transition-colors",
              selectedValues.includes(option.id) 
                ? "bg-recipe-orange text-white border-recipe-orange" 
                : "bg-background border-input hover:border-recipe-orange/50"
            )}
          >
            <span>{option.icon}</span>
            <span>{option.name}</span>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Select any dietary restrictions for your recipe
      </p>
    </div>
  );
}
