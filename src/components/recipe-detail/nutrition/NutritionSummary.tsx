
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

// Helper function to round numbers to integers
const formatAsInteger = (value: number): string => {
  return Math.round(value).toString();
};

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
        <p className="font-bold">{formatAsInteger(calories)} kcal</p>
        <p className="text-xs text-gray-500">({formatAsInteger(caloriesPercentage)}% daily)</p>
      </div>
      <div className="p-2 rounded-md" style={{ backgroundColor: '#e5deff' }}>
        <p className="text-xs text-gray-500 font-medium">Protein</p>
        <p className="font-bold">{formatAsInteger(protein)}g</p>
        <p className="text-xs text-gray-500">({formatAsInteger(proteinPercentage)}% daily)</p>
      </div>
      <div className="p-2 rounded-md" style={{ backgroundColor: '#d3e4fd' }}>
        <p className="text-xs text-gray-500 font-medium">Carbs</p>
        <p className="font-bold">{formatAsInteger(carbs)}g</p>
        <p className="text-xs text-gray-500">({formatAsInteger(carbsPercentage)}% daily)</p>
      </div>
      <div className="p-2 rounded-md" style={{ backgroundColor: '#f2fce2' }}>
        <p className="text-xs text-gray-500 font-medium">Fat</p>
        <p className="font-bold">{formatAsInteger(fat)}g</p>
        <p className="text-xs text-gray-500">({formatAsInteger(fatPercentage)}% daily)</p>
      </div>
    </div>
  );
}
