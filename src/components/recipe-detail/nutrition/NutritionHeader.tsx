
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronsUpDown, Timer, Book } from 'lucide-react';
import { Nutrition } from '@/types/recipe';
import { ExtendedNutritionData } from './useNutritionData';

interface NutritionHeaderProps {
  viewMode: 'recipe' | 'personal';
  onViewModeChange: (mode: 'recipe' | 'personal') => void;
  showToggle: boolean;
  cookingMethod?: string;
  totalTime?: number;
  nutrition: Nutrition;
}

export function NutritionHeader({ 
  viewMode, 
  onViewModeChange, 
  showToggle, 
  cookingMethod, 
  totalTime,
  nutrition
}: NutritionHeaderProps) {
  const hasDataQuality = nutrition && nutrition.data_quality;
  const confidenceLevel = hasDataQuality ? 
    nutrition.data_quality?.overall_confidence || 'medium' : 
    'medium';
  
  return (
    <div className="flex flex-col sm:flex-row justify-between w-full">
      <div className="flex items-center mb-2 sm:mb-0">
        <h3 className="text-lg font-medium">Nutrition Information</h3>
        
        {hasDataQuality && (
          <div className="ml-2 flex items-center">
            <span className={`
              inline-flex items-center px-2 py-1 text-xs rounded-full
              ${confidenceLevel === 'high' ? 'bg-green-100 text-green-800' : 
                confidenceLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-orange-100 text-orange-800'}
            `}>
              {confidenceLevel === 'high' ? 'High accuracy' : 
               confidenceLevel === 'medium' ? 'Medium accuracy' : 
               'Low accuracy'}
            </span>
          </div>
        )}
        
        {(cookingMethod || totalTime) && (
          <div className="hidden md:flex items-center ml-4 space-x-4 text-sm text-muted-foreground">
            {cookingMethod && (
              <div className="flex items-center">
                <Book className="h-4 w-4 mr-1" />
                <span>{cookingMethod}</span>
              </div>
            )}
            
            {totalTime && totalTime > 0 && (
              <div className="flex items-center">
                <Timer className="h-4 w-4 mr-1" />
                <span>{totalTime} min</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {showToggle && (
        <div className="flex items-center">
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => onViewModeChange(value as 'recipe' | 'personal')}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-[200px] grid-cols-2">
              <TabsTrigger value="recipe">Recipe</TabsTrigger>
              <TabsTrigger value="personal">My Diet</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
    </div>
  );
}
