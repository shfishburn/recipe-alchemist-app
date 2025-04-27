
import React from 'react';

interface NutritionSummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caloriesPercentage: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
}

export function NutritionSummary({
  calories,
  protein,
  carbs,
  fat,
  caloriesPercentage,
  proteinPercentage,
  carbsPercentage,
  fatPercentage
}: NutritionSummaryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <div className="p-2 rounded-md bg-gray-50">
        <p className="text-xs text-gray-500 font-medium">Calories</p>
        <p className="font-bold">{calories} kcal</p>
        <p className="text-xs text-gray-500">({caloriesPercentage}% daily)</p>
      </div>
      <div className="p-2 rounded-md" style={{ backgroundColor: '#e5deff' }}>
        <p className="text-xs text-gray-500 font-medium">Protein</p>
        <p className="font-bold">{protein}g</p>
        <p className="text-xs text-gray-500">({proteinPercentage}% daily)</p>
      </div>
      <div className="p-2 rounded-md" style={{ backgroundColor: '#d3e4fd' }}>
        <p className="text-xs text-gray-500 font-medium">Carbs</p>
        <p className="font-bold">{carbs}g</p>
        <p className="text-xs text-gray-500">({carbsPercentage}% daily)</p>
      </div>
      <div className="p-2 rounded-md" style={{ backgroundColor: '#f2fce2' }}>
        <p className="text-xs text-gray-500 font-medium">Fat</p>
        <p className="font-bold">{fat}g</p>
        <p className="text-xs text-gray-500">({fatPercentage}% daily)</p>
      </div>
    </div>
  );
}
