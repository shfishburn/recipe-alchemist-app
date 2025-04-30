
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

// Servings options
export const SERVINGS_OPTIONS = [1, 2, 4, 6, 8];

interface ServingsSelectorProps {
  selectedServings: number;
  onServingsSelect: (servings: number) => void;
}

export function ServingsSelector({ selectedServings, onServingsSelect }: ServingsSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-recipe-blue" />
        <label className="text-sm font-medium">How many servings?</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {SERVINGS_OPTIONS.map(servingOption => (
          <Badge 
            key={servingOption}
            variant="outline"
            className={`cursor-pointer px-3 py-1.5 text-sm ${
              selectedServings === servingOption 
                ? 'bg-recipe-blue text-white hover:bg-recipe-blue/90' 
                : 'hover:bg-accent'
            }`}
            onClick={() => onServingsSelect(servingOption)}
          >
            {servingOption} {servingOption === 1 ? 'person' : 'people'}
          </Badge>
        ))}
      </div>
    </div>
  );
}
