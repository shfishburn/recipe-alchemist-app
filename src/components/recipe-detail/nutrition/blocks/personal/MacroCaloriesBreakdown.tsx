
import React from 'react';

interface MacroCaloriesBreakdownProps {
  proteinCalories: number;
  carbCalories: number;
  fatCalories: number;
  proteinCaloriePercent: number;
  carbCaloriePercent: number;
  fatCaloriePercent: number;
  colors: {
    protein: string;
    carbs: string;
    fat: string;
  };
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
  return (
    <div className="bg-white p-3 rounded-md shadow-sm">
      <h5 className="text-xs font-medium mb-2">Calories from Macronutrients</h5>
      <div className="flex items-center mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="flex h-full rounded-full overflow-hidden">
            <div style={{ width: `${proteinCaloriePercent}%`, backgroundColor: colors.protein }} />
            <div style={{ width: `${carbCaloriePercent}%`, backgroundColor: colors.carbs }} />
            <div style={{ width: `${fatCaloriePercent}%`, backgroundColor: colors.fat }} />
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: colors.protein }}></div>
          <span>Protein: {proteinCaloriePercent}% ({proteinCalories} kcal)</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: colors.carbs }}></div>
          <span>Carbs: {carbCaloriePercent}% ({carbCalories} kcal)</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: colors.fat }}></div>
          <span>Fat: {fatCaloriePercent}% ({fatCalories} kcal)</span>
        </div>
      </div>
    </div>
  );
}
