
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { ComparisonChart } from '../charts/ComparisonChart';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

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
}

export function PersonalBlock({ recipeNutrition, userPreferences }: PersonalBlockProps) {
  const isMobile = useIsMobile();
  
  const COLORS = {
    protein: '#9b87f5',
    carbs: '#0EA5E9',
    fat: '#22c55e',
    calories: '#F97316'
  };
  
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
      fill: COLORS.protein,
      value: `${proteinPercentage}% (${recipeNutrition.protein}g)`
    },
    {
      name: 'Carbs',
      Recipe: recipeNutrition.carbs,
      Target: carbsTarget,
      percentage: carbsPercentage,
      fill: COLORS.carbs,
      value: `${carbsPercentage}% (${recipeNutrition.carbs}g)`
    },
    {
      name: 'Fat',
      Recipe: recipeNutrition.fat,
      Target: fatTarget,
      percentage: fatPercentage,
      fill: COLORS.fat,
      value: `${fatPercentage}% (${recipeNutrition.fat}g)`
    }
  ];
  
  const calorieData = [
    {
      name: 'Calories',
      Recipe: recipeNutrition.calories,
      Target: userPreferences.dailyCalories,
      percentage: caloriesPercentage,
      fill: COLORS.calories,
      value: `${caloriesPercentage}% (${recipeNutrition.calories} kcal)`
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
            Percentage of your daily targets this recipe provides
          </p>
          <HorizontalBarChart 
            data={[...compareData, ...calorieData]} 
            showPercentage={true}
            showValue={true}
            height={isMobile ? 200 : 240}
          />
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
                  <p className="text-xs">Compares the actual amount of nutrients in this recipe to your daily targets in grams.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Side by side comparison in grams
          </p>
          <ComparisonChart compareData={compareData} />
        </CardContent>
      </Card>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-3">Nutritional Insights</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Calories</p>
            <p className="text-lg font-semibold">{caloriesPercentage}%</p>
            <p className="text-xs text-muted-foreground">{recipeNutrition.calories} of {userPreferences.dailyCalories} kcal</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${COLORS.protein}` }}>
            <p className="text-xs text-gray-500">Protein</p>
            <p className="text-lg font-semibold">{proteinPercentage}%</p>
            <p className="text-xs text-muted-foreground">{recipeNutrition.protein}g of {proteinTarget}g</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${COLORS.carbs}` }}>
            <p className="text-xs text-gray-500">Carbs</p>
            <p className="text-lg font-semibold">{carbsPercentage}%</p>
            <p className="text-xs text-muted-foreground">{recipeNutrition.carbs}g of {carbsTarget}g</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${COLORS.fat}` }}>
            <p className="text-xs text-gray-500">Fat</p>
            <p className="text-lg font-semibold">{fatPercentage}%</p>
            <p className="text-xs text-muted-foreground">{recipeNutrition.fat}g of {fatTarget}g</p>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-md shadow-sm">
          <h5 className="text-xs font-medium mb-2">Calories from Macronutrients</h5>
          <div className="flex items-center mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="flex h-full rounded-full overflow-hidden">
                <div style={{ width: `${proteinCaloriePercent}%`, backgroundColor: COLORS.protein }} />
                <div style={{ width: `${carbCaloriePercent}%`, backgroundColor: COLORS.carbs }} />
                <div style={{ width: `${fatCaloriePercent}%`, backgroundColor: COLORS.fat }} />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS.protein }}></div>
              <span>Protein: {proteinCaloriePercent}% ({proteinCalories} kcal)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS.carbs }}></div>
              <span>Carbs: {carbCaloriePercent}% ({carbCalories} kcal)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS.fat }}></div>
              <span>Fat: {fatCaloriePercent}% ({fatCalories} kcal)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
