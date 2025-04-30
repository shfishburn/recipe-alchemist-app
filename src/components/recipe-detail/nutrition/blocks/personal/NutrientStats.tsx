
import React from 'react';
import { WeightDisplay } from '@/components/ui/unit-display';

interface NutrientStatsProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caloriesPercentage: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
  colors: Record<string, string>;
  unitSystem: 'metric' | 'imperial';
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
  colors,
  unitSystem
}: NutrientStatsProps) {
  // Function to determine status color based on percentage
  const getStatusColor = (percentage: number, nutrient: string) => {
    if (nutrient === 'calories') {
      if (percentage < 30) return 'text-green-600';
      if (percentage > 80) return 'text-red-600';
      return 'text-amber-600';
    } else {
      if (percentage < 50) return 'text-amber-600';
      if (percentage > 150) return 'text-red-600';
      return 'text-green-600';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      <div className="bg-white p-3 rounded-md shadow-sm">
        <p className="text-xs text-gray-500">Calories</p>
        <p className="text-base font-semibold">{calories} kcal</p>
        <p className={`text-xs ${getStatusColor(caloriesPercentage, 'calories')}`}>
          {caloriesPercentage}% of daily needs
        </p>
      </div>
      
      <div className="bg-white p-3 rounded-md shadow-sm">
        <p className="text-xs text-gray-500">Protein</p>
        <p className="text-base font-semibold flex items-baseline gap-1">
          <span>{protein}g</span>
        </p>
        <p className={`text-xs ${getStatusColor(proteinPercentage, 'protein')}`}>
          {proteinPercentage}% of daily target
        </p>
      </div>
      
      <div className="bg-white p-3 rounded-md shadow-sm">
        <p className="text-xs text-gray-500">Carbs</p>
        <p className="text-base font-semibold flex items-baseline gap-1">
          <span>{carbs}g</span>
        </p>
        <p className={`text-xs ${getStatusColor(carbsPercentage, 'carbs')}`}>
          {carbsPercentage}% of daily target
        </p>
      </div>
      
      <div className="bg-white p-3 rounded-md shadow-sm">
        <p className="text-xs text-gray-500">Fat</p>
        <p className="text-base font-semibold flex items-baseline gap-1">
          <span>{fat}g</span>
        </p>
        <p className={`text-xs ${getStatusColor(fatPercentage, 'fat')}`}>
          {fatPercentage}% of daily target
        </p>
      </div>
    </div>
  );
}
