
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComparisonChart } from './charts/ComparisonChart';
import { DistributionCharts } from './charts/DistributionCharts';
import { EnhancedNutrition } from '@/types/nutrition-enhanced';
import { MicronutrientsDisplay } from './MicronutrientsDisplay';
import { NUTRITION_COLORS } from '@/constants/nutrition';

interface NutritionChartProps {
  recipeNutrition: EnhancedNutrition;
  userPreferences?: {
    dailyCalories: number;
    macroSplit: {
      protein: number;
      carbs: number;
      fat: number;
    };
    unitSystem?: 'metric' | 'imperial';
  };
}

export function NutritionChart({ recipeNutrition, userPreferences }: NutritionChartProps) {
  // Calculate chart data directly within the component
  const { macroData, macrosData, targetMacrosData, compareData } = React.useMemo(() => {
    // Default values if userPreferences is not available
    const dailyCalories = userPreferences?.dailyCalories || 2000;
    const proteinPercentage = userPreferences?.macroSplit.protein || 30;
    const carbsPercentage = userPreferences?.macroSplit.carbs || 40;
    const fatPercentage = userPreferences?.macroSplit.fat || 30;
    
    // Calculate user's target macros in grams
    const proteinTarget = Math.round((dailyCalories * (proteinPercentage / 100)) / 4);
    const carbsTarget = Math.round((dailyCalories * (carbsPercentage / 100)) / 4);
    const fatTarget = Math.round((dailyCalories * (fatPercentage / 100)) / 9);
    
    // Use colors from constants
    const COLORS = [
      NUTRITION_COLORS.protein, 
      NUTRITION_COLORS.carbs, 
      NUTRITION_COLORS.fat
    ];
    
    // Make sure nutrition values are numbers
    const proteinValue = typeof recipeNutrition.protein === 'number' ? 
      recipeNutrition.protein : 0;
    
    const carbsValue = typeof recipeNutrition.carbs === 'number' ? 
      recipeNutrition.carbs : 0;
    
    const fatValue = typeof recipeNutrition.fat === 'number' ? 
      recipeNutrition.fat : 0;
    
    // Data for macros comparison chart
    const macroData = [
      {
        name: 'Protein',
        Recipe: proteinValue,
        Target: proteinTarget,
        percentage: Math.round((proteinValue / proteinTarget) * 100),
        fill: COLORS[0]
      },
      {
        name: 'Carbs',
        Recipe: carbsValue,
        Target: carbsTarget,
        percentage: Math.round((carbsValue / carbsTarget) * 100),
        fill: COLORS[1]
      },
      {
        name: 'Fat',
        Recipe: fatValue,
        Target: fatTarget,
        percentage: Math.round((fatValue / fatTarget) * 100),
        fill: COLORS[2]
      }
    ];

    // Calculate the total macros for pie chart data
    const recipeMacrosTotal = proteinValue + carbsValue + fatValue;
    const macrosData = [
      { name: 'Protein', value: Math.round((proteinValue / recipeMacrosTotal) * 100), fill: COLORS[0] },
      { name: 'Carbs', value: Math.round((carbsValue / recipeMacrosTotal) * 100), fill: COLORS[1] },
      { name: 'Fat', value: Math.round((fatValue / recipeMacrosTotal) * 100), fill: COLORS[2] }
    ];
    
    const targetMacrosData = [
      { name: 'Protein', value: proteinPercentage, fill: COLORS[0] },
      { name: 'Carbs', value: carbsPercentage, fill: COLORS[1] },
      { name: 'Fat', value: fatPercentage, fill: COLORS[2] }
    ];

    return {
      macroData,
      macrosData,
      targetMacrosData,
      compareData: macroData, // Using macroData for ComparisonChart
    };
  }, [recipeNutrition, userPreferences]);

  const unitSystem = userPreferences?.unitSystem || 'metric';

  return (
    <div className="space-y-4">
      <Tabs defaultValue="comparison" className="w-full">
        <div className="flex items-center mb-4">
          <TabsList className="flex w-full overflow-x-auto rounded-md p-1 mb-0 md:max-w-fit">
            <TabsTrigger value="comparison" className="flex-1 md:flex-none">Comparison</TabsTrigger>
            <TabsTrigger value="distribution" className="flex-1 md:flex-none">Distribution</TabsTrigger>
            <TabsTrigger value="micronutrients" className="flex-1 md:flex-none">Micronutrients</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="comparison" className="pt-2">
          <ComparisonChart compareData={compareData} unitSystem={unitSystem} />
        </TabsContent>
        
        <TabsContent value="distribution" className="pt-2">
          <DistributionCharts 
            recipeMacros={macrosData}
            targetMacros={targetMacrosData}
          />
        </TabsContent>
        
        <TabsContent value="micronutrients" className="pt-2">
          <MicronutrientsDisplay nutrition={recipeNutrition} unitSystem={unitSystem} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
