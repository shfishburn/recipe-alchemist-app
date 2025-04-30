
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, Clock, Utensils } from 'lucide-react';
import { NutritionConfidenceIndicator } from './NutritionConfidenceIndicator';
import { EnhancedNutrition } from '@/types/nutrition-enhanced';
import { formatNutritionValue } from '@/components/ui/unit-display';

interface NutritionHeaderProps {
  showToggle: boolean;
  viewMode: 'recipe' | 'personal';
  onViewModeChange: (mode: 'recipe' | 'personal') => void;
  cookingMethod: string;
  totalTime: number;
  nutrition?: EnhancedNutrition;
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
    <div className="flex flex-col space-y-2 flex-1">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Nutrition Facts</h3>
        
        {nutrition?.data_quality && (
          <NutritionConfidenceIndicator 
            nutrition={nutrition} 
            size="sm"
            showTooltip={true}
          />
        )}
      </div>
      
      <div className="flex items-center text-muted-foreground text-xs">
        {cookingMethod && (
          <div className="flex items-center mr-4">
            <Utensils className="h-3.5 w-3.5 mr-1" />
            <span className="capitalize">{cookingMethod}</span>
          </div>
        )}
        
        {totalTime > 0 && (
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{formatNutritionValue(totalTime)} min</span>
          </div>
        )}
      </div>
      
      {showToggle && (
        <Tabs 
          value={viewMode} 
          onValueChange={(val) => onViewModeChange(val as 'recipe' | 'personal')}
          className="mt-1"
        >
          <TabsList className="h-8">
            <TabsTrigger value="recipe" className="text-xs px-3 h-6">
              <BarChart2 className="h-3.5 w-3.5 mr-1" />
              Recipe
            </TabsTrigger>
            <TabsTrigger value="personal" className="text-xs px-3 h-6">
              <BarChart2 className="h-3.5 w-3.5 mr-1" />
              Personalized
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
}
