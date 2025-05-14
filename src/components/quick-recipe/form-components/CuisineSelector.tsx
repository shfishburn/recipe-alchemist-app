
import React from 'react';
import { Globe } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

// Cuisine options with emoji flags
const CUISINES = [
  { value: 'any', label: 'Any Cuisine', flag: '🌎' },
  { value: 'american', label: 'American', flag: '🇺🇸' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'mexican', label: 'Mexican', flag: '🇲🇽' },
  { value: 'asian', label: 'Asian', flag: '🇨🇳' },
  { value: 'mediterranean', label: 'Mediterranean', flag: '🇬🇷' },
  { value: 'indian', label: 'Indian', flag: '🇮🇳' },
  { value: 'french', label: 'French', flag: '🇫🇷' },
];

interface CuisineSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CuisineSelector({ value, onChange }: CuisineSelectorProps) {
  // Handle single selection in the UI, but store as array in state
  const handleCuisineChange = (selectedValue: string) => {
    // If 'any' is selected, clear other selections
    if (selectedValue === 'any') {
      onChange(['any']);
    } else {
      // Remove 'any' if it's in the array and add the new selection
      onChange([selectedValue]);
    }
  };
  
  // Get the display value (first cuisine in array or 'any')
  const displayValue = value && value.length > 0 ? value[0] : 'any';
  
  // Find the cuisine object for the selected value
  const selectedCuisine = CUISINES.find(cuisine => cuisine.value === displayValue) || CUISINES[0];
  
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
      
      {/* Material Design select */}
      <Select value={displayValue} onValueChange={handleCuisineChange}>
        <SelectTrigger 
          id="cuisine-select"
          className={cn(
            "w-full bg-background border border-input hover:border-primary/50 transition-colors",
            "shadow-elevation-1 hover:shadow-elevation-2 focus:shadow-elevation-2",
            "h-10 py-2 rounded-md"
          )}
        >
          <SelectValue>
            <div className="flex items-center">
              <span className="mr-2">{selectedCuisine.flag}</span>
              {selectedCuisine.label}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent 
          className="bg-background border border-input shadow-elevation-2"
          position="popper"
        >
          {CUISINES.map((cuisine) => (
            <SelectItem 
              key={cuisine.value} 
              value={cuisine.value}
              className={cn(
                "cursor-pointer",
                "data-[highlighted]:bg-primary/10",
                "data-[selected]:bg-primary/20 data-[selected]:text-primary",
                "rounded-sm my-0.5 flex items-center"
              )}
            >
              <span className="mr-2">{cuisine.flag}</span> {cuisine.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Material Design helper text */}
      <p className="text-xs text-muted-foreground">
        Style of cuisine for your recipe
      </p>
    </div>
  );
}
