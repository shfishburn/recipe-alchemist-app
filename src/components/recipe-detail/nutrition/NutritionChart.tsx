
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComparisonChart } from './charts/ComparisonChart';
import { DistributionCharts } from './charts/DistributionCharts';
import { NutritionSummaryText } from './charts/NutritionSummaryText';
import { useNutritionChartData } from './hooks/useNutritionChartData';

interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionChartProps {
  recipeNutrition: RecipeNutrition;
  userPreferences?: {
    dailyCalories: number;
    macroSplit: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

const COLORS = ['#4f46e5', '#0ea5e9', '#22c55e']; // Indigo, Sky blue, Green

export function NutritionChart({ recipeNutrition, userPreferences }: NutritionChartProps) {
  const { 
    macroData, 
    calorieData, 
    macrosData, 
    targetMacrosData,
    compareData 
  } = useNutritionChartData(recipeNutrition, userPreferences);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="comparison">
        <TabsList className="mb-2">
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="pt-2">
          <ComparisonChart compareData={compareData} />
        </TabsContent>
        
        <TabsContent value="distribution" className="pt-2">
          <DistributionCharts 
            recipeMacros={macrosData}
            targetMacros={targetMacrosData}
            colors={COLORS}
          />
        </TabsContent>
      </Tabs>
      
      <NutritionSummaryText
        calories={recipeNutrition.calories}
        protein={recipeNutrition.protein}
        carbs={recipeNutrition.carbs}
        fat={recipeNutrition.fat}
        caloriesPercentage={calorieData[0].percentage}
        proteinPercentage={macroData[0].percentage}
        carbsPercentage={macroData[1].percentage}
        fatPercentage={macroData[2].percentage}
      />
    </div>
  );
}
