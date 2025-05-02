
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Popular cuisines with their display names, values, and flag emojis
export const CUISINES = [
  { name: "American", value: "american", flag: "🇺🇸" },
  { name: "Italian", value: "italian", flag: "🇮🇹" },
  { name: "Mexican", value: "mexican", flag: "🇲🇽" },
  { name: "Asian", value: "asian", flag: "🇨🇳" },
  { name: "Mediterranean", value: "mediterranean", flag: "🇬🇷" },
  { name: "French", value: "french", flag: "🇫🇷" },
  { name: "Indian", value: "indian", flag: "🇮🇳" }
];

export const MAX_CUISINE_SELECTIONS = 2;

interface CuisineSelectorProps {
  selectedCuisines: string[];
  onCuisineToggle: (value: string) => void;
}

export function CuisineSelector({ selectedCuisines, onCuisineToggle }: CuisineSelectorProps) {
  const { toast } = useToast();

  const handleToggle = (value: string) => {
    // If the cuisine is already selected, allow removal
    if (selectedCuisines.includes(value)) {
      onCuisineToggle(value);
      return;
    }
    
    // Check if we've reached the maximum selections
    if (selectedCuisines.length >= MAX_CUISINE_SELECTIONS) {
      toast({
        title: "Selection limit reached",
        description: `You can select up to ${MAX_CUISINE_SELECTIONS} cuisines.`,
        variant: "default"
      });
      return;
    }
    
    // Toggle the cuisine
    onCuisineToggle(value);
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-recipe-green" />
        <label className="text-base font-medium text-recipe-green">
          What flavors match your mood tonight? <span className="text-gray-600 text-sm">(select up to {MAX_CUISINE_SELECTIONS})</span>
        </label>
      </div>
      <div className="flex flex-wrap gap-3 justify-start w-full">
        {CUISINES.map(cuisine => (
          <Badge 
            key={cuisine.value} 
            variant="outline" 
            className={`cursor-pointer hover:bg-accent px-3 py-1.5 text-sm ${
              selectedCuisines.includes(cuisine.value) ? 'bg-recipe-green text-white hover:bg-recipe-green/90' : ''
            }`}
            onClick={() => handleToggle(cuisine.value)}
          >
            <span className="mr-1">{cuisine.flag}</span>
            {cuisine.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
