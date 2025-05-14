
import React from 'react';
import { 
  Carrot, 
  WheatOff, 
  MilkOff, 
  Heart, 
  LeafyGreen 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Dietary options with icons
const DIETARY = [
  { name: "Low-Carb", value: "low-carb", icon: Carrot },
  { name: "Gluten-Free", value: "gluten-free", icon: WheatOff },
  { name: "Dairy-Free", value: "dairy-free", icon: MilkOff },
  { name: "Healthy", value: "healthy", icon: Heart },
  { name: "Vegetarian", value: "vegetarian", icon: LeafyGreen }
];

interface DietarySelectorProps {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export function DietarySelector({ 
  value = [], 
  onChange 
}: DietarySelectorProps) {
  // Ensure value is always an array to prevent iteration errors
  const dietaryValues = Array.isArray(value) ? value : [];
  
  // Toggle dietary preference selection
  const toggleDietary = (dietaryValue: string) => {
    if (dietaryValues.includes(dietaryValue)) {
      onChange(dietaryValues.filter(d => d !== dietaryValue));
    } else {
      onChange([...dietaryValues, dietaryValue]);
    }
  };
  
  return (
    <div className="space-y-2">
      {/* Material Design label */}
      <label className="text-sm font-medium flex items-center gap-1.5 text-foreground">
        <LeafyGreen className="h-4 w-4 text-primary/80" />
        Dietary Preferences
      </label>
      
      {/* Display selected dietary preferences as badges */}
      <div className="flex flex-wrap gap-2">
        {DIETARY.map(diet => {
          const Icon = diet.icon;
          return (
            <button
              key={diet.value}
              type="button"
              onClick={() => toggleDietary(diet.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm flex items-center gap-1 border transition-colors",
                dietaryValues.includes(diet.value) 
                  ? "bg-recipe-orange text-white border-recipe-orange" 
                  : "bg-background border-input hover:border-recipe-orange/50"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{diet.name}</span>
            </button>
          )}
        )}
      </div>
      
      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        Select any dietary restrictions for your recipe
      </p>
    </div>
  );
}
