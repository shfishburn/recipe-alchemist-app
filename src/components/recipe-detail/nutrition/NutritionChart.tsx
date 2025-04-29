
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComparisonChart } from './charts/ComparisonChart';
import { DistributionCharts } from './charts/DistributionCharts';
import { ExtendedNutritionData } from './useNutritionData';
import { MicronutrientsDisplay } from './MicronutrientsDisplay';

interface NutritionChartProps {
  recipeNutrition: ExtendedNutritionData;
  userPreferences?: {
    dailyCalories: number;
    macroSplit: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

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
          <TabsTrigger value="micronutrients">Micronutrients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="pt-2">
          <ComparisonChart compareData={compareData} />
        </TabsContent>
        
        <TabsContent value="distribution" className="pt-2">
          <DistributionCharts 
            recipeMacros={macrosData}
            targetMacros={targetMacrosData}
          />
        </TabsContent>
        
        <TabsContent value="micronutrients" className="pt-2">
          <MicronutrientsDisplay nutrition={recipeNutrition} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
