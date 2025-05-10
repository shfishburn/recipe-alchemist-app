
import React from 'react';
import { QuickRecipe } from '@/types/quick-recipe';
import { PieChart } from '@/components/common/PieChart';
import { Card } from '@/components/ui/card';
import { NutritionImpact } from '@/hooks/use-recipe-modifications';

interface QuickRecipeNutritionSummaryProps {
  recipe: QuickRecipe;
  nutritionImpact?: NutritionImpact;
}

export function QuickRecipeNutritionSummary({ recipe, nutritionImpact }: QuickRecipeNutritionSummaryProps) {
  const nutrition = recipe.nutrition;
  
  if (!nutrition) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Nutrition information not available for this recipe.
      </div>
    );
  }
  
  const totalCalories = nutrition.calories || 0;
  
  // Calculate macronutrient percentages
  const proteinCalories = (nutrition.protein || 0) * 4; // 4 calories per gram of protein
  const carbsCalories = (nutrition.carbs || 0) * 4; // 4 calories per gram of carbs
  const fatCalories = (nutrition.fat || 0) * 9; // 9 calories per gram of fat
  
  const proteinPercentage = totalCalories ? Math.round((proteinCalories / totalCalories) * 100) : 0;
  const carbsPercentage = totalCalories ? Math.round((carbsCalories / totalCalories) * 100) : 0;
  const fatPercentage = totalCalories ? Math.round((fatCalories / totalCalories) * 100) : 0;
  
  // Data for pie chart
  const data = [
    { name: 'Protein', value: proteinPercentage, color: '#4CAF50' },
    { name: 'Carbs', value: carbsPercentage, color: '#2196F3' },
    { name: 'Fat', value: fatPercentage, color: '#FFC107' },
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-2">
          <div className="flex justify-center items-center h-32">
            <PieChart data={data} />
          </div>
        </div>
        <div className="p-2 flex flex-col justify-center">
          <h3 className="text-sm font-medium mb-2">Nutrition Summary</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between">
              <span>Calories:</span> 
              <span className="font-medium">{nutrition.calories}
                {nutritionImpact && nutritionImpact.calories !== 0 && (
                  <span className={nutritionImpact.calories > 0 ? "text-red-600 ml-1" : "text-green-600 ml-1"}>
                    {nutritionImpact.calories > 0 ? "+" : ""}{nutritionImpact.calories}
                  </span>
                )}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Protein:</span> 
              <span className="font-medium">{nutrition.protein}g
                {nutritionImpact && nutritionImpact.protein !== 0 && (
                  <span className={nutritionImpact.protein > 0 ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                    {nutritionImpact.protein > 0 ? "+" : ""}{nutritionImpact.protein}g
                  </span>
                )}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Carbs:</span> 
              <span className="font-medium">{nutrition.carbs}g
                {nutritionImpact && nutritionImpact.carbs !== 0 && (
                  <span className={nutritionImpact.carbs > 0 ? "text-red-600 ml-1" : "text-green-600 ml-1"}>
                    {nutritionImpact.carbs > 0 ? "+" : ""}{nutritionImpact.carbs}g
                  </span>
                )}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Fat:</span> 
              <span className="font-medium">{nutrition.fat}g
                {nutritionImpact && nutritionImpact.fat !== 0 && (
                  <span className={nutritionImpact.fat > 0 ? "text-red-600 ml-1" : "text-green-600 ml-1"}>
                    {nutritionImpact.fat > 0 ? "+" : ""}{nutritionImpact.fat}g
                  </span>
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      {nutritionImpact && nutritionImpact.summary && (
        <div className="mt-2 p-2 bg-muted/30 rounded-md text-xs">
          <p className="font-medium mb-1">Impact Summary:</p>
          <p>{nutritionImpact.summary}</p>
        </div>
      )}
    </div>
  );
}
