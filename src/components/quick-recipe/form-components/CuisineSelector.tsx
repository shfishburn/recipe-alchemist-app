
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

// Cuisine options with flag emojis
const CUISINES = [
  { name: "American", value: "american", flag: "🇺🇸" },
  { name: "Italian", value: "italian", flag: "🇮🇹" },
  { name: "Mexican", value: "mexican", flag: "🇲🇽" },
  { name: "Asian", value: "asian", flag: "🇨🇳" },
  { name: "Mediterranean", value: "mediterranean", flag: "🇬🇷" },
  { name: "French", value: "french", flag: "🇫🇷" },
  { name: "Indian", value: "indian", flag: "🇮🇳" }
];

interface CuisineSelectorProps {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}

export function CuisineSelector({ 
  value = [], 
  onChange 
}: CuisineSelectorProps) {
  // Ensure value is always an array to prevent iteration errors
  const cuisineValues = Array.isArray(value) ? value : [];
  
  // Toggle cuisine selection
  const toggleCuisine = (cuisineValue: string) => {
    if (cuisineValues.includes(cuisineValue)) {
      onChange(cuisineValues.filter(c => c !== cuisineValue));
    } else {
      onChange([...cuisineValues, cuisineValue]);
    }
  };
  
  return (
    <div className="space-y-2">
      {/* Material Design label */}
      <label 
        htmlFor="cuisine-select" 
        className="text-sm font-medium flex items-center gap-1.5 text-foreground"
      >
        <Globe className="h-4 w-4 text-primary/80" />
        Cuisine
      </label>
      
      {/* Display selected cuisines as badges instead of using Select */}
      <div className="flex flex-wrap gap-2">
        {CUISINES.map(cuisine => (
          <button
            key={cuisine.value}
            type="button"
            onClick={() => toggleCuisine(cuisine.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm flex items-center gap-1 border transition-colors",
              cuisineValues.includes(cuisine.value) 
                ? "bg-primary text-white border-primary" 
                : "bg-background border-input hover:border-primary/50"
            )}
          >
            <span>{cuisine.flag}</span>
            <span>{cuisine.name}</span>
          </button>
        ))}
      </div>
      
      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        Select cuisine preferences for your recipe
      </p>
    </div>
  );
}
