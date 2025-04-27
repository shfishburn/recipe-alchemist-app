
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { NutritionToggle } from './NutritionToggle';

interface NutritionHeaderProps {
  showToggle: boolean;
  viewMode: 'recipe' | 'personal';
  onViewModeChange: (value: 'recipe' | 'personal') => void;
}

export function NutritionHeader({ showToggle, viewMode, onViewModeChange }: NutritionHeaderProps) {
  return (
    <CardHeader className="pb-2">
      <CardTitle className="text-lg md:text-xl flex items-center justify-between">
        <span>Nutrition Information</span>
        {showToggle && (
          <NutritionToggle 
            viewMode={viewMode} 
            onViewModeChange={onViewModeChange} 
          />
        )}
      </CardTitle>
    </CardHeader>
  );
}
