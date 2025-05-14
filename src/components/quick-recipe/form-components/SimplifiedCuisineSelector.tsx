
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple cuisine options with emojis for visual appeal
const CUISINES = [
  { id: "american", name: "American", emoji: "🇺🇸" },
  { id: "italian", name: "Italian", emoji: "🇮🇹" },
  { id: "mexican", name: "Mexican", emoji: "🇲🇽" },
  { id: "asian", name: "Asian", emoji: "🇨🇳" },
  { id: "mediterranean", name: "Mediterranean", emoji: "🇬🇷" },
  { id: "french", name: "French", emoji: "🇫🇷" },
  { id: "indian", name: "Indian", emoji: "🇮🇳" }
];

interface SimplifiedCuisineSelectorProps {
  selected: string[];
  onChange: (values: string[]) => void;
}

export function SimplifiedCuisineSelector({ 
  selected = [], 
  onChange 
}: SimplifiedCuisineSelectorProps) {
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
        <Globe className="h-4 w-4 text-primary/80" />
        Cuisine
      </label>
      
      <div className="flex flex-wrap gap-2">
        {CUISINES.map(cuisine => (
          <button
            key={cuisine.id}
            type="button"
            onClick={() => toggleSelection(cuisine.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm flex items-center gap-1 border transition-colors",
              selectedValues.includes(cuisine.id) 
                ? "bg-primary text-white border-primary" 
                : "bg-background border-input hover:border-primary/50"
            )}
          >
            <span>{cuisine.emoji}</span>
            <span>{cuisine.name}</span>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Select cuisine preferences for your recipe
      </p>
    </div>
  );
}
