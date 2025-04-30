
import React from 'react';

interface CalculationDisplayProps {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  deficit: number;
  projectedWeightLossPerWeek: number;
  adaptedTDEE?: number;
  hasAdaptation?: boolean;
}

export function CalculationDisplay({ 
  bmr, 
  tdee, 
  dailyCalories, 
  deficit, 
  projectedWeightLossPerWeek,
  adaptedTDEE,
  hasAdaptation
}: CalculationDisplayProps) {
  return (
    <div className="p-4 bg-blue-50 rounded-md space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Basal Metabolic Rate (BMR)</p>
          <p className="font-semibold">{bmr} calories</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Daily Energy Expenditure (TDEE)</p>
          <p className="font-semibold">{tdee} calories</p>
        </div>
      </div>
      
      {hasAdaptation && adaptedTDEE && (
        <div className="border-t border-blue-100 pt-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              TDEE with Metabolic Adaptation
              <span className="ml-2 text-orange-500 font-medium">
                (-{Math.round(((tdee - adaptedTDEE) / tdee) * 100)}%)
              </span>
            </p>
            <p className="font-semibold">{adaptedTDEE} calories</p>
          </div>
        </div>
      )}
      
      <div className="border-t pt-4">
        <div className="space-y-2">
          <p className="font-medium">Recommended Daily Calories: {dailyCalories}</p>
          {deficit > 0 && (
            <div className="text-sm text-muted-foreground">
              <p>Calorie Deficit: {deficit} calories per day</p>
              <p>Projected Weight Loss: {projectedWeightLossPerWeek.toFixed(1)} lbs per week</p>
            </div>
          )}
          {deficit < 0 && (
            <div className="text-sm text-muted-foreground">
              <p>Calorie Surplus: {Math.abs(deficit)} calories per day</p>
              <p>Ideal for muscle gain and recovery</p>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        These calculations are estimates based on your personal details and activity level.
        Adjust your daily calories based on your progress and how you feel.
      </p>
    </div>
  );
}
