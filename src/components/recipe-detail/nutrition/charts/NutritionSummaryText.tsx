
import React from 'react';

interface NutritionSummaryTextProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  caloriesPercentage: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
}

export function NutritionSummaryText({
  calories,
  protein,
  carbs,
  fat,
  caloriesPercentage,
  proteinPercentage,
  carbsPercentage,
  fatPercentage,
}: NutritionSummaryTextProps) {
  return (
    <div className="text-sm space-y-1">
      <p>
        <span className="font-medium">Calories:</span> {calories} kcal ({caloriesPercentage}% of daily target)
      </p>
      <p>
        <span className="font-medium">Protein:</span> {protein}g ({proteinPercentage}% of daily target)
      </p>
      <p>
        <span className="font-medium">Carbs:</span> {carbs}g ({carbsPercentage}% of daily target)
      </p>
      <p>
        <span className="font-medium">Fat:</span> {fat}g ({fatPercentage}% of daily target)
      </p>
    </div>
  );
}
