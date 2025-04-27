
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { ComparisonChart } from '../charts/ComparisonChart';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';

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
  
  const COLORS = ['#9b87f5', '#0EA5E9', '#22c55e', '#F97316'];
  
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
      fill: COLORS[0]
    },
    {
      name: 'Carbs',
      Recipe: recipeNutrition.carbs,
      Target: carbsTarget,
      percentage: carbsPercentage,
      fill: COLORS[1]
    },
    {
      name: 'Fat',
      Recipe: recipeNutrition.fat,
      Target: fatTarget,
      percentage: fatPercentage,
      fill: COLORS[2]
    }
  ];
  
  const calorieData = [
    {
      name: 'Calories',
      Recipe: recipeNutrition.calories,
      Target: userPreferences.dailyCalories,
      percentage: caloriesPercentage,
      fill: COLORS[3]
    }
  ];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-center mb-2">Daily Target Percentages</h4>
          <HorizontalBarChart 
            data={[...compareData, ...calorieData]} 
            showPercentage={true}
            height={isMobile ? 180 : 240}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium text-center mb-2">Comparison to Daily Targets (g)</h4>
          <ComparisonChart compareData={compareData} />
        </CardContent>
      </Card>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">Percentage of Daily Goals</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Calories</p>
            <p className="text-lg font-semibold">{caloriesPercentage}%</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Protein</p>
            <p className="text-lg font-semibold">{proteinPercentage}%</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Carbs</p>
            <p className="text-lg font-semibold">{carbsPercentage}%</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Fat</p>
            <p className="text-lg font-semibold">{fatPercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
