
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { NutritionToggle } from './NutritionToggle';
import { CookingPot } from 'lucide-react';

interface NutritionHeaderProps {
  showToggle: boolean;
  viewMode: 'recipe' | 'personal';
  onViewModeChange: (value: 'recipe' | 'personal') => void;
  cookingMethod?: string;
  totalTime?: number;
}

export function NutritionHeader({ showToggle, viewMode, onViewModeChange, cookingMethod, totalTime }: NutritionHeaderProps) {
  return (
    <CardHeader className="pb-4">
      <CardTitle className="text-base md:text-lg flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-slate-800">Nutrition Information</span>
          {cookingMethod && totalTime && totalTime > 60 && (
            <div className="flex items-center text-xs text-amber-600 mt-1 font-normal">
              <CookingPot className="h-3 w-3 mr-1" />
              <span>{`${cookingMethod} recipe - ${Math.floor(totalTime / 60)} hr ${totalTime % 60 ? totalTime % 60 + ' min' : ''} total time`}</span>
            </div>
          )}
        </div>
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
