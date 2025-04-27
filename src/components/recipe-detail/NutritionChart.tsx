
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Percent, BarChartHorizontal } from 'lucide-react';
import { HorizontalBarChart } from './nutrition/charts/HorizontalBarChart';
import { MacroDistributionPie } from './nutrition/charts/MacroDistributionPie';
import { NutritionSummary } from './nutrition/NutritionSummary';

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

const COLORS = ['#9b87f5', '#0EA5E9', '#22c55e'];

export function NutritionChart({ recipeNutrition, userPreferences }: NutritionChartProps) {
  const [showPercentage, setShowPercentage] = useState(false);
  const [viewType, setViewType] = useState<'vertical' | 'horizontal'>('horizontal');
  
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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="comparison" className="w-full">
          <div className="flex justify-between items-center mb-2">
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
              >
                <Percent className="h-4 w-4 mr-1" />
                {showPercentage ? "%" : "Values"}
              </Toggle>
              <Toggle
                pressed={viewType === 'horizontal'}
                onPressedChange={(pressed) => setViewType(pressed ? 'horizontal' : 'vertical')}
                aria-label="Toggle chart orientation"
                size="sm"
              >
                <BarChartHorizontal className="h-4 w-4 mr-1" />
                {viewType === 'horizontal' ? "Horizontal" : "Vertical"}
              </Toggle>
            </div>
          </div>
          
          <TabsContent value="comparison" className="pt-2">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-center mb-2">Macronutrients</h4>
                  <HorizontalBarChart 
                    data={macroData} 
                    showPercentage={showPercentage} 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-center mb-2">Calories</h4>
                  <HorizontalBarChart 
                    data={calorieData} 
                    showPercentage={showPercentage} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="pt-2">
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
      </div>
      
      <NutritionSummary
        calories={recipeNutrition.calories}
        protein={recipeNutrition.protein}
        carbs={recipeNutrition.carbs}
        fat={recipeNutrition.fat}
        caloriesPercentage={caloriesPercentage}
        proteinPercentage={proteinPercentOfTarget}
        carbsPercentage={carbsPercentOfTarget}
        fatPercentage={fatPercentOfTarget}
      />
    </div>
  );
}
