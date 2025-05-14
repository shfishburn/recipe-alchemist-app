
import React from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Available servings options
const SERVINGS_OPTIONS = [1, 2, 3, 4, 6, 8, 10, 12];

interface SimplifiedServingsSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function SimplifiedServingsSelector({ 
  value = 2, 
  onChange 
}: SimplifiedServingsSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-1.5 text-foreground">
        <Users className="h-4 w-4 text-primary/80" />
        Servings
      </label>
      
      <div className="flex flex-wrap gap-2">
        {SERVINGS_OPTIONS.map(servings => (
          <button
            key={servings}
            type="button"
            onClick={() => onChange(servings)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm border transition-colors",
              value === servings
                ? "bg-blue-500 text-white border-blue-500" 
                : "bg-background border-input hover:border-blue-500/50"
            )}
          >
            {servings} {servings === 1 ? 'person' : 'people'}
          </button>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Number of people you're cooking for
      </p>
    </div>
  );
}
