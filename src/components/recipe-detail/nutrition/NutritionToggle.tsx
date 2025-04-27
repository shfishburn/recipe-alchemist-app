
import React from 'react';
import { Button } from '@/components/ui/button';
import { User2, ChefHat } from 'lucide-react';

interface NutritionToggleProps {
  viewMode: 'recipe' | 'personal';
  onViewModeChange: (value: 'recipe' | 'personal') => void;
}

export function NutritionToggle({ viewMode, onViewModeChange }: NutritionToggleProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant={viewMode === 'recipe' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('recipe')}
        className="flex items-center gap-2"
      >
        <ChefHat className="h-4 w-4" />
        Recipe
      </Button>
      <Button
        variant={viewMode === 'personal' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewModeChange('personal')}
        className="flex items-center gap-2"
      >
        <User2 className="h-4 w-4" />
        Personal Impact
      </Button>
    </div>
  );
}
