
import { useMemo } from 'react';

const COLORS = ['#9b87f5', '#0EA5E9', '#22c55e'];

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

export function useNutritionChartData(recipeNutrition: RecipeNutrition, userPreferences?: UserPreferences) {
  return useMemo(() => {
    // Default values if userPreferences is not available
    const dailyCalories = userPreferences?.dailyCalories || 2000;
    const proteinPercentage = userPreferences?.macroSplit.protein || 30;
    const carbsPercentage = userPreferences?.macroSplit.carbs || 40;
    const fatPercentage = userPreferences?.macroSplit.fat || 30;
    
    // Calculate user's target macros in grams
    const proteinTarget = Math.round((dailyCalories * (proteinPercentage / 100)) / 4);
    const carbsTarget = Math.round((dailyCalories * (carbsPercentage / 100)) / 4);
    const fatTarget = Math.round((dailyCalories * (fatPercentage / 100)) / 9);
    
    // Calculate percentage of daily goal
    const caloriesPercentage = Math.round((recipeNutrition.calories / dailyCalories) * 100);
    const proteinPercentOfTarget = Math.round((recipeNutrition.protein / proteinTarget) * 100);
    const carbsPercentOfTarget = Math.round((recipeNutrition.carbs / carbsTarget) * 100);
    const fatPercentOfTarget = Math.round((recipeNutrition.fat / fatTarget) * 100);
    
    // Data for macros chart
    const macroData = [
      {
        name: 'Protein',
        Recipe: recipeNutrition.protein,
        Target: proteinTarget,
        percentage: proteinPercentOfTarget,
        fill: COLORS[0]
      },
      {
        name: 'Carbs',
        Recipe: recipeNutrition.carbs,
        Target: carbsTarget,
        percentage: carbsPercentOfTarget,
        fill: COLORS[1]
      },
      {
        name: 'Fat',
        Recipe: recipeNutrition.fat,
        Target: fatTarget,
        percentage: fatPercentOfTarget,
        fill: COLORS[2]
      }
    ];

    // Data for calories chart
    const calorieData = [
      {
        name: 'Calories',
        Recipe: recipeNutrition.calories,
        Target: dailyCalories,
        percentage: caloriesPercentage,
        fill: '#F97316'
      }
    ];
    
    // Data for distribution charts
    const recipeMacrosTotal = recipeNutrition.protein + recipeNutrition.carbs + recipeNutrition.fat;
    const macrosData = [
      { name: 'Protein', value: Math.round((recipeNutrition.protein / recipeMacrosTotal) * 100), fill: COLORS[0] },
      { name: 'Carbs', value: Math.round((recipeNutrition.carbs / recipeMacrosTotal) * 100), fill: COLORS[1] },
      { name: 'Fat', value: Math.round((recipeNutrition.fat / recipeMacrosTotal) * 100), fill: COLORS[2] }
    ];
    
    const targetMacrosData = [
      { name: 'Protein', value: proteinPercentage, fill: COLORS[0] },
      { name: 'Carbs', value: carbsPercentage, fill: COLORS[1] },
      { name: 'Fat', value: fatPercentage, fill: COLORS[2] }
    ];

    return {
      macroData,
      calorieData,
      macrosData,
      targetMacrosData,
      compareData: macroData, // Adding compareData to match what ComparisonChart expects
    };
  }, [recipeNutrition, userPreferences]);
}
