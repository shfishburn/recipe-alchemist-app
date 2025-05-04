
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Percent, BarChartHorizontal } from 'lucide-react';
import { HorizontalBarChart } from './nutrition/charts/HorizontalBarChart';
import { MacroDistributionPie } from './nutrition/charts/MacroDistributionPie';
import { NutritionSummary } from './nutrition/NutritionSummary';
import { useNutritionChartData } from './nutrition/hooks/useNutritionChartData';

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

export function NutritionChart({ recipeNutrition, userPreferences }: NutritionChartProps) {
  const [showPercentage, setShowPercentage] = useState(false);
  const [viewType, setViewType] = useState<'vertical' | 'horizontal'>('horizontal');
  
  const { macroData, calorieData, macrosData, targetMacrosData } = useNutritionChartData(
    recipeNutrition, 
    userPreferences
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="comparison" className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <TabsList className="justify-start">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2 items-center">
            <Toggle
              pressed={showPercentage}
              onPressedChange={setShowPercentage}
              aria-label="Toggle percentage view"
              size="sm"
              className="data-[state=on]:bg-slate-200"
            >
              <Percent className="h-4 w-4 mr-1" />
              {showPercentage ? "%" : "Values"}
            </Toggle>
            
            <Toggle
              pressed={viewType === 'horizontal'}
              onPressedChange={(pressed) => setViewType(pressed ? 'horizontal' : 'vertical')}
              aria-label="Toggle chart orientation"
              size="sm"
              className="data-[state=on]:bg-slate-200"
            >
              <BarChartHorizontal className="h-4 w-4 mr-1" />
              {viewType === 'horizontal' ? "Horizontal" : "Vertical"}
            </Toggle>
          </div>
        </div>
        
        <TabsContent value="comparison" className="pt-2 mt-0">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-center mb-3">Macronutrients</h4>
                <HorizontalBarChart 
                  data={macroData} 
                  showPercentage={showPercentage} 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-center mb-3">Calories</h4>
                <HorizontalBarChart 
                  data={calorieData} 
                  showPercentage={showPercentage} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="distribution" className="pt-2 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <MacroDistributionPie
                  data={macrosData}
                  title="Recipe Macro Breakdown"
                />
              </CardContent>
            </Card>
            
            {userPreferences && (
              <Card>
                <CardContent className="p-4">
                  <MacroDistributionPie
                    data={targetMacrosData}
                    title="Your Target Macro Breakdown"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <NutritionSummary
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
