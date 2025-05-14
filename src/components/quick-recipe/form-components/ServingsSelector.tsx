
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServingsSelectorProps {
  selectedServings: number;
  onServingsChange: (servings: number) => void;
}

export function ServingsSelector({ 
  selectedServings, 
  onServingsChange 
}: ServingsSelectorProps) {
  // Available servings options
  const servingsOptions = [1, 2, 3, 4, 6, 8, 10, 12];
  
  return (
    <div className="space-y-2">
      {/* Material Design label */}
      <label 
        htmlFor="servings-select" 
        className="text-sm font-medium flex items-center gap-1.5 text-foreground"
      >
        <Users className="h-4 w-4 text-primary/80" />
        Servings
      </label>
      
      {/* Material Design select */}
      <Select 
        value={selectedServings.toString()}  
        onValueChange={(value) => onServingsChange(parseInt(value))}
      >
        <SelectTrigger 
          id="servings-select"
          className={cn(
            "w-full bg-background border border-input hover:border-primary/50 transition-colors",
            "shadow-elevation-1 hover:shadow-elevation-2 focus:shadow-elevation-2",
            "h-10 py-2 rounded-md"
          )}
        >
          <SelectValue placeholder="Select servings" />
        </SelectTrigger>
        <SelectContent 
          className="bg-background border border-input shadow-elevation-2"
          position="popper"
        >
          {servingsOptions.map((servings) => (
            <SelectItem 
              key={servings} 
              value={servings.toString()}
              className={cn(
                "cursor-pointer",
                "data-[highlighted]:bg-primary/10", 
                "data-[selected]:bg-primary/20 data-[selected]:text-primary",
                "rounded-sm my-0.5"
              )}
            >
              {servings} {servings === 1 ? 'person' : 'people'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Material Design helper text */}
      <p className="text-xs text-muted-foreground">
        Number of people you're cooking for
      </p>
    </div>
  );
}
