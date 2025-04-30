
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { ComparisonChart } from '../charts/ComparisonChart';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { NutrientStats } from './personal/NutrientStats';
import { MacroCaloriesBreakdown } from './personal/MacroCaloriesBreakdown';
import { NUTRITION_COLORS, NUTRIENT_INFO } from './personal/constants';
import { WeightDisplay } from '@/components/ui/unit-display';

interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface UserPreferences {
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface PersonalBlockProps {
  recipeNutrition: RecipeNutrition;
  userPreferences: UserPreferences;
  unitSystem: 'metric' | 'imperial';
}

export function PersonalBlock({ recipeNutrition, userPreferences, unitSystem }: PersonalBlockProps) {
  const isMobile = useIsMobile();
  
  // Calculate user's target macros in grams
  const proteinTarget = Math.round((userPreferences.dailyCalories * (userPreferences.macroSplit.protein / 100)) / 4);
  const carbsTarget = Math.round((userPreferences.dailyCalories * (userPreferences.macroSplit.carbs / 100)) / 4);
  const fatTarget = Math.round((userPreferences.dailyCalories * (userPreferences.macroSplit.fat / 100)) / 9);
  
  // Calculate percentage of daily target
  const caloriesPercentage = Math.round((recipeNutrition.calories / userPreferences.dailyCalories) * 100);
  const proteinPercentage = Math.round((recipeNutrition.protein / proteinTarget) * 100);
  const carbsPercentage = Math.round((recipeNutrition.carbs / carbsTarget) * 100);
  const fatPercentage = Math.round((recipeNutrition.fat / fatTarget) * 100);
  
  const compareData = [
    {
      name: 'Protein',
      Recipe: recipeNutrition.protein,
      Target: proteinTarget,
      percentage: proteinPercentage,
      fill: NUTRITION_COLORS.protein,
      value: `${proteinPercentage}% (${recipeNutrition.protein}g of ${proteinTarget}g)`
    },
    {
      name: 'Carbs',
      Recipe: recipeNutrition.carbs,
      Target: carbsTarget,
      percentage: carbsPercentage,
      fill: NUTRITION_COLORS.carbs,
      value: `${carbsPercentage}% (${recipeNutrition.carbs}g of ${carbsTarget}g)`
    },
    {
      name: 'Fat',
      Recipe: recipeNutrition.fat,
      Target: fatTarget,
      percentage: fatPercentage,
      fill: NUTRITION_COLORS.fat,
      value: `${fatPercentage}% (${recipeNutrition.fat}g of ${fatTarget}g)`
    }
  ];
  
  const calorieData = [
    {
      name: 'Calories',
      Recipe: recipeNutrition.calories,
      Target: userPreferences.dailyCalories,
      percentage: caloriesPercentage,
      fill: NUTRITION_COLORS.calories,
      value: `${caloriesPercentage}% (${recipeNutrition.calories} of ${userPreferences.dailyCalories} kcal)`
    }
  ];
  
  // Calculate calories from macros
  const proteinCalories = recipeNutrition.protein * 4;
  const carbCalories = recipeNutrition.carbs * 4;
  const fatCalories = recipeNutrition.fat * 9;
  const totalCalories = proteinCalories + carbCalories + fatCalories;
  
  const proteinCaloriePercent = Math.round((proteinCalories / totalCalories) * 100);
  const carbCaloriePercent = Math.round((carbCalories / totalCalories) * 100);
  const fatCaloriePercent = Math.round((fatCalories / totalCalories) * 100);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Daily Nutrient Goals Coverage</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">Shows what percentage of your daily nutrient targets this recipe provides based on your nutritional preferences.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Percentage of your daily targets this recipe provides <span className="italic">(per serving)</span>
          </p>
          <HorizontalBarChart 
            data={[...compareData, ...calorieData]} 
            showPercentage={true}
            showValue={true}
            height={isMobile ? 200 : 240}
          />
          <p className="text-xs text-gray-500 mt-2 italic">
            * Values above 100% exceed your daily target for that nutrient
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Nutrient Comparison: Recipe vs. Daily Targets</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">Compares the actual amount of nutrients in this recipe to your daily targets in grams. Dotted lines represent recommended range (±20% of target).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Side by side comparison in grams <span className="italic">(per serving)</span>
          </p>
          <ComparisonChart compareData={compareData} />
          <p className="text-xs text-gray-500 mt-2 italic">
            * Dotted lines show recommended range (±20% of your target)
          </p>
        </CardContent>
      </Card>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-3">Nutritional Insights</h4>
        
        <NutrientStats
          calories={recipeNutrition.calories}
          protein={recipeNutrition.protein}
          carbs={recipeNutrition.carbs}
          fat={recipeNutrition.fat}
          caloriesPercentage={caloriesPercentage}
          proteinPercentage={proteinPercentage}
          carbsPercentage={carbsPercentage}
          fatPercentage={fatPercentage}
          colors={NUTRITION_COLORS}
          unitSystem={unitSystem}
        />
        
        <MacroCaloriesBreakdown
          proteinCalories={proteinCalories}
          carbCalories={carbCalories}
          fatCalories={fatCalories}
          proteinCaloriePercent={proteinCaloriePercent}
          carbCaloriePercent={carbCaloriePercent}
          fatCaloriePercent={fatCaloriePercent}
          colors={NUTRITION_COLORS}
        />
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h5 className="text-xs font-semibold mb-2">Nutritional Information</h5>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Protein provides 4 calories per gram - vital for muscle repair and growth</li>
            <li>• Carbohydrates provide 4 calories per gram - your body's preferred energy source</li>
            <li>• Fat provides 9 calories per gram - necessary for hormone production and nutrient absorption</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Values are calculated per serving based on your selected nutritional preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
