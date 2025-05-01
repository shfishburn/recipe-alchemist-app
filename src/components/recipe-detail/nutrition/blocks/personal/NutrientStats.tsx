
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { formatNutrientWithUnit } from '@/components/ui/unit-display';

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
    calories: string;
  };
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
  const formattedProtein = formatNutrientWithUnit(protein, 'g', unitSystem);
  const formattedCarbs = formatNutrientWithUnit(carbs, 'g', unitSystem);
  const formattedFat = formatNutrientWithUnit(fat, 'g', unitSystem);

  return (
    <div className="space-y-4">
      <h5 className="text-xs font-semibold">Nutrient Coverage</h5>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">Calories</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{calories} kcal</span>
            <span className="text-xs text-muted-foreground">{caloriesPercentage}%</span>
          </div>
        </div>
        <Progress value={caloriesPercentage} className="h-1.5" indicatorClassName="bg-calories" />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">Protein</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{formattedProtein}</span>
            <span className="text-xs text-muted-foreground">{proteinPercentage}%</span>
          </div>
        </div>
        <Progress value={proteinPercentage} className="h-1.5" indicatorClassName="bg-blue-600" />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">Carbs</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{formattedCarbs}</span>
            <span className="text-xs text-muted-foreground">{carbsPercentage}%</span>
          </div>
        </div>
        <Progress value={carbsPercentage} className="h-1.5" indicatorClassName="bg-amber-500" />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">Fat</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{formattedFat}</span>
            <span className="text-xs text-muted-foreground">{fatPercentage}%</span>
          </div>
        </div>
        <Progress value={fatPercentage} className="h-1.5" indicatorClassName="bg-emerald-500" />
      </div>
    </div>
  );
}
