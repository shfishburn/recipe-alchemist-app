
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { User2, ChefHat } from 'lucide-react';

interface NutritionToggleProps {
  viewMode: 'recipe' | 'personal';
  onViewModeChange: (value: 'recipe' | 'personal') => void;
}

export function NutritionToggle({ viewMode, onViewModeChange }: NutritionToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={(value) => value && onViewModeChange(value as 'recipe' | 'personal')}
      className="space-x-1"
    >
      <ToggleGroupItem value="recipe" size="sm" className="px-3 py-1">
        <ChefHat className="h-4 w-4 mr-2" />
        Recipe
      </ToggleGroupItem>
      <ToggleGroupItem value="personal" size="sm" className="px-3 py-1">
        <User2 className="h-4 w-4 mr-2" />
        Personal
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
