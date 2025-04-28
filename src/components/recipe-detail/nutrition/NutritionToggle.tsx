
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
      className="border rounded-full p-1 bg-slate-50"
    >
      <ToggleGroupItem
        value="recipe"
        className="data-[state=on]:bg-primary data-[state=on]:text-white rounded-full px-3 text-sm font-medium"
      >
        <ChefHat className="h-4 w-4 mr-1" />
        Recipe
      </ToggleGroupItem>
      <ToggleGroupItem
        value="personal"
        className="data-[state=on]:bg-primary data-[state=on]:text-white rounded-full px-3 text-sm font-medium"
      >
        <User2 className="h-4 w-4 mr-1" />
        Personal
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
