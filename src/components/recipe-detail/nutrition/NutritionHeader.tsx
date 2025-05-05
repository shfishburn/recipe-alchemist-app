
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { User, Users } from 'lucide-react';
import { EnhancedNutrition } from '@/types/nutrition-enhanced';

interface NutritionHeaderProps {
  showToggle: boolean;
  viewMode: 'recipe' | 'personal';
  onViewModeChange: (mode: 'recipe' | 'personal') => void;
  cookingMethod: string;
  totalTime: number;
  nutrition: EnhancedNutrition;
}

export function NutritionHeader({
  showToggle,
  viewMode,
  onViewModeChange,
  cookingMethod,
  totalTime,
  nutrition
}: NutritionHeaderProps) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Nutrition Information</h3>
        
        {showToggle && (
          <div className="flex items-center space-x-1">
            <Toggle
              pressed={viewMode === 'recipe'}
              onPressedChange={() => onViewModeChange('recipe')}
              aria-label="Recipe nutrition"
              title="Recipe nutrition"
              className="h-8 w-8 p-0 data-[state=on]:bg-recipe-blue data-[state=on]:text-white"
            >
              <Users className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === 'personal'}
              onPressedChange={() => onViewModeChange('personal')}
              aria-label="Personal nutrition"
              title="Personal nutrition"
              className="h-8 w-8 p-0 data-[state=on]:bg-recipe-blue data-[state=on]:text-white"
            >
              <User className="h-4 w-4" />
            </Toggle>
          </div>
        )}
      </div>
      
      {viewMode === 'recipe' && (
        <p className="text-sm text-muted-foreground mt-1">
          Per serving • {nutrition.calories || 0} calories
        </p>
      )}
      
      {viewMode === 'personal' && (
        <p className="text-sm text-muted-foreground mt-1">
          Percentage of daily targets
        </p>
      )}
    </div>
  );
}
