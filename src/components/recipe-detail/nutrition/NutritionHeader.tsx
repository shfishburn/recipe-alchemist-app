
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
    <CardHeader className="pb-4">
      <CardTitle className="text-base md:text-lg flex items-center justify-between">
        <span className="text-slate-800">Nutrition Information</span>
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
