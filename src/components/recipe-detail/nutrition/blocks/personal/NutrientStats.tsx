
import React from 'react';
import { UnitSystem } from '@/stores/unitSystem';
import { formatNutrientWithUnit } from '@/components/ui/unit-display';
import { EnhancedNutrition } from '@/components/recipe-detail/nutrition/useNutritionData';
import { DAILY_REFERENCE_VALUES } from '@/constants/nutrition';

interface NutrientStatsProps {
  nutrition: EnhancedNutrition;
  dailyCalories: number;
  unitSystem: UnitSystem;
}

export function NutrientStats({ nutrition, dailyCalories, unitSystem }: NutrientStatsProps) {
  // Process micronutrients data
  const micronutrients = [
    {
      name: 'Sodium',
      value: nutrition.sodium || 0,
      unit: 'mg',
      percentage: Math.round(((nutrition.sodium || 0) / DAILY_REFERENCE_VALUES.sodium) * 100)
    },
    {
      name: 'Sugar',
      value: nutrition.sugar || 0,
      unit: 'g',
      percentage: Math.round(((nutrition.sugar || 0) / DAILY_REFERENCE_VALUES.sugar) * 100)
    },
    {
      name: 'Vitamin A',
      value: nutrition.vitaminA || nutrition.vitamin_a || 0,
      unit: 'μg',
      percentage: Math.round(((nutrition.vitaminA || nutrition.vitamin_a || 0) / DAILY_REFERENCE_VALUES.vitamin_a) * 100)
    },
    {
      name: 'Vitamin C',
      value: nutrition.vitaminC || nutrition.vitamin_c || 0,
      unit: 'mg',
      percentage: Math.round(((nutrition.vitaminC || nutrition.vitamin_c || 0) / DAILY_REFERENCE_VALUES.vitamin_c) * 100)
    },
    {
      name: 'Calcium',
      value: nutrition.calcium || 0,
      unit: 'mg',
      percentage: Math.round(((nutrition.calcium || 0) / DAILY_REFERENCE_VALUES.calcium) * 100)
    },
    {
      name: 'Iron',
      value: nutrition.iron || 0,
      unit: 'mg',
      percentage: Math.round(((nutrition.iron || 0) / DAILY_REFERENCE_VALUES.iron) * 100)
    },
    {
      name: 'Saturated Fat',
      value: nutrition.saturated_fat || nutrition.saturatedFat || 0,
      unit: 'g',
      percentage: Math.round(((nutrition.saturated_fat || nutrition.saturatedFat || 0) / DAILY_REFERENCE_VALUES.saturated_fat) * 100)
    }
  ];

  // Filter out nutrients with zero or very low values
  const significantNutrients = micronutrients.filter(nutrient => 
    nutrient.value > 0.5 || nutrient.percentage > 2
  );

  // Sort nutrients by percentage of daily value
  const sortedNutrients = significantNutrients.sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-2">
      <h4 className="font-medium mb-2">Key Nutrients</h4>
      
      {sortedNutrients.length === 0 ? (
        <p className="text-sm text-muted-foreground">No significant nutrient data available</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-sm">
          {sortedNutrients.map((nutrient) => (
            <div key={nutrient.name} className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">{nutrient.name}</span>
              <span>
                {formatNutrientWithUnit(nutrient.value, nutrient.unit, unitSystem)}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({nutrient.percentage}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-2">
        *Percentages are based on standard daily reference values
      </p>
    </div>
  );
}
