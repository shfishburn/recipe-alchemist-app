
import React from 'react';
import { format, differenceInWeeks } from 'date-fns';
import type { NutritionPreferencesType } from '@/types/nutrition';
import { calculateMetabolicAdaptation } from '@/utils/body-composition';

interface AdaptationTrackerProps {
  preferences: NutritionPreferencesType;
}

export function AdaptationTracker({ preferences }: AdaptationTrackerProps) {
  const adaptationTracking = preferences.adaptationTracking || {};
  const weeksDieting = adaptationTracking.weeksDieting || 0;
  
  // Calculate adaptation based on weeks dieting and weight loss
  const initialWeight = adaptationTracking.initialWeight || preferences.personalDetails?.weight;
  const currentWeight = preferences.personalDetails?.weight;
  const adaptationRate = 1.0; // % per week
  const maximumAdaptation = 15.0; // %

  const params = {
    consecutiveWeeksDieting: weeksDieting,
    adaptationRate,
    maximumAdaptation,
    initialWeight: initialWeight || 0,
    currentWeight: currentWeight || 0
  };
  
  const adaptation = calculateMetabolicAdaptation(params);
  const adaptationPercentage = (adaptation * 100).toFixed(1);
  
  const lastDietBreakDate = adaptationTracking.lastDietBreakDate
    ? new Date(adaptationTracking.lastDietBreakDate)
    : undefined;
    
  const weeksInDiet = lastDietBreakDate 
    ? differenceInWeeks(new Date(), lastDietBreakDate)
    : weeksDieting;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Metabolic Adaptation Tracker</h3>
      
      <div className="p-4 bg-orange-50 rounded-md">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">Current Adaptation</span>
          <span className="text-lg font-bold">{adaptationPercentage}%</span>
        </div>
        
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div 
            className="absolute top-0 left-0 h-full bg-orange-500" 
            style={{ width: `${adaptationPercentage}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Consecutive weeks in deficit</span>
            <span>{weeksInDiet}</span>
          </div>
          
          {initialWeight && currentWeight && initialWeight > currentWeight && (
            <div className="flex justify-between">
              <span>Total weight loss</span>
              <span>{(initialWeight - currentWeight).toFixed(1)} kg</span>
            </div>
          )}
          
          {lastDietBreakDate && (
            <div className="flex justify-between">
              <span>Last diet break</span>
              <span>{format(lastDietBreakDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          
          {preferences.tdee && adaptation > 0 && (
            <div className="flex justify-between pt-2 text-sm font-medium">
              <span>Adjusted TDEE with adaptation</span>
              <span>{Math.round(preferences.tdee * (1 - adaptation))} calories</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
