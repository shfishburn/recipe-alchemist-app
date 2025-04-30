
import React from 'react';

interface MacroCaloriesBreakdownProps {
  proteinCalories: number;
  carbCalories: number;
  fatCalories: number;
  proteinCaloriePercent: number;
  carbCaloriePercent: number;
  fatCaloriePercent: number;
  colors: Record<string, string>;
}

export function MacroCaloriesBreakdown({
  proteinCalories,
  carbCalories,
  fatCalories,
  proteinCaloriePercent,
  carbCaloriePercent,
  fatCaloriePercent,
  colors
}: MacroCaloriesBreakdownProps) {
  const totalCalories = proteinCalories + carbCalories + fatCalories;
  
  return (
    <div className="mt-4">
      <h5 className="text-xs font-semibold mb-2">Calorie Distribution</h5>
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex mb-2">
          <div className="w-full h-4 flex rounded-full overflow-hidden">
            <div 
              className="h-full" 
              style={{ 
                width: `${proteinCaloriePercent}%`, 
                backgroundColor: colors.protein
              }}
            ></div>
            <div 
              className="h-full" 
              style={{ 
                width: `${carbCaloriePercent}%`, 
                backgroundColor: colors.carbs
              }}
            ></div>
            <div 
              className="h-full" 
              style={{ 
                width: `${fatCaloriePercent}%`, 
                backgroundColor: colors.fat
              }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <div>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: colors.protein }}
              ></div>
              <span className="font-medium">Protein</span>
            </div>
            <div>{proteinCalories} kcal ({proteinCaloriePercent}%)</div>
          </div>
          <div>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: colors.carbs }}
              ></div>
              <span className="font-medium">Carbs</span>
            </div>
            <div>{carbCalories} kcal ({carbCaloriePercent}%)</div>
          </div>
          <div>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: colors.fat }}
              ></div>
              <span className="font-medium">Fat</span>
            </div>
            <div>{fatCalories} kcal ({fatCaloriePercent}%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
