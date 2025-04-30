
import React from 'react';
import { WeightDisplay } from '@/components/ui/unit-display';

interface CalculationDisplayProps {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  deficit: number;
  projectedWeightLossPerWeek: number;
  adaptedTDEE?: number;
  hasAdaptation: boolean;
  unitSystem: 'metric' | 'imperial';
}

export function CalculationDisplay({
  bmr,
  tdee,
  dailyCalories,
  deficit,
  projectedWeightLossPerWeek,
  adaptedTDEE,
  hasAdaptation,
  unitSystem
}: CalculationDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Basal Metabolic Rate</p>
          <p className="text-lg font-semibold">{bmr} kcal/day</p>
          <p className="text-xs text-muted-foreground">Calories needed at complete rest</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Total Daily Energy Expenditure</p>
          <p className="text-lg font-semibold">{tdee} kcal/day</p>
          <p className="text-xs text-muted-foreground">Calories needed for maintenance</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Daily Target</p>
          <p className="text-lg font-semibold">{dailyCalories} kcal/day</p>
          <p className="text-xs text-muted-foreground">Daily calorie target with goal adjustment</p>
        </div>
      </div>

      {deficit > 0 && (
        <div className="bg-white p-4 rounded-md shadow-sm border-l-4 border-l-blue-500 border border-gray-100">
          <p className="text-sm font-medium">Weight Loss Projection</p>
          <p className="text-xs text-muted-foreground mb-2">Based on your calorie deficit</p>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500">Daily Deficit</p>
              <p className="text-base font-medium">{deficit} kcal/day</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Weekly Loss Projection</p>
              <p className="text-base font-medium">
                <WeightDisplay 
                  weightKg={projectedWeightLossPerWeek} 
                  unitSystem={unitSystem} 
                  decimals={2}
                />
                /week
              </p>
            </div>
          </div>
        </div>
      )}
      
      {hasAdaptation && adaptedTDEE && (
        <div className="bg-orange-50 p-4 rounded-md shadow-sm border border-orange-100">
          <p className="text-sm font-medium text-orange-800">Metabolic Adaptation Warning</p>
          <div className="flex justify-between mt-2">
            <div>
              <p className="text-xs text-orange-800">Original TDEE</p>
              <p className="text-base font-medium">{tdee} kcal/day</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-orange-800">Adapted TDEE</p>
              <p className="text-base font-medium">{adaptedTDEE} kcal/day</p>
            </div>
          </div>
          <p className="text-xs text-orange-700 mt-2">
            Your metabolism has adapted to your calorie restriction, reducing your energy expenditure.
            Consider a diet break to reset adaptation.
          </p>
        </div>
      )}
    </div>
  );
}
