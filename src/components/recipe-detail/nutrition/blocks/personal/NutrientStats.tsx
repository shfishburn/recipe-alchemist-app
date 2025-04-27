
import React from 'react';

interface NutrientStatsProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caloriesPercentage: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
  colors: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

export function NutrientStats({
  calories,
  protein,
  carbs,
  fat,
  caloriesPercentage,
  proteinPercentage,
  carbsPercentage,
  fatPercentage,
  colors
}: NutrientStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-white p-3 rounded-md shadow-sm">
        <p className="text-xs text-gray-500">Calories</p>
        <p className="text-lg font-semibold">{caloriesPercentage}%</p>
        <p className="text-xs text-muted-foreground">{calories} of daily kcal</p>
      </div>
      <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${colors.protein}` }}>
        <p className="text-xs text-gray-500">Protein</p>
        <p className="text-lg font-semibold">{proteinPercentage}%</p>
        <p className="text-xs text-muted-foreground">{protein}g of daily target</p>
      </div>
      <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${colors.carbs}` }}>
        <p className="text-xs text-gray-500">Carbs</p>
        <p className="text-lg font-semibold">{carbsPercentage}%</p>
        <p className="text-xs text-muted-foreground">{carbs}g of daily target</p>
      </div>
      <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${colors.fat}` }}>
        <p className="text-xs text-gray-500">Fat</p>
        <p className="text-lg font-semibold">{fatPercentage}%</p>
        <p className="text-xs text-muted-foreground">{fat}g of daily target</p>
      </div>
    </div>
  );
}
