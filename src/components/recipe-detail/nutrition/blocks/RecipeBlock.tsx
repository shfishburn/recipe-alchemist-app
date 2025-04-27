
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';

interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface RecipeBlockProps {
  recipeNutrition: RecipeNutrition;
}

export function RecipeBlock({ recipeNutrition }: RecipeBlockProps) {
  const isMobile = useIsMobile();
  
  const COLORS = ['#9b87f5', '#0EA5E9', '#22c55e'];
  
  // Calculate macro distribution
  const total = recipeNutrition.protein + recipeNutrition.carbs + recipeNutrition.fat;
  const proteinPercent = Math.round((recipeNutrition.protein / total) * 100);
  const carbsPercent = Math.round((recipeNutrition.carbs / total) * 100);
  const fatPercent = Math.round((recipeNutrition.fat / total) * 100);
  
  const macrosData = [
    { name: 'Protein', value: proteinPercent, fill: COLORS[0] },
    { name: 'Carbs', value: carbsPercent, fill: COLORS[1] },
    { name: 'Fat', value: fatPercent, fill: COLORS[2] }
  ];
  
  // Calculate calories from each macro
  const proteinCalories = recipeNutrition.protein * 4;
  const carbsCalories = recipeNutrition.carbs * 4;
  const fatCalories = recipeNutrition.fat * 9;
  const totalCalories = recipeNutrition.calories;
  
  const calorieMacroData = [
    { name: 'Protein', value: Math.round((proteinCalories / totalCalories) * 100), fill: COLORS[0] },
    { name: 'Carbs', value: Math.round((carbsCalories / totalCalories) * 100), fill: COLORS[1] },
    { name: 'Fat', value: Math.round((fatCalories / totalCalories) * 100), fill: COLORS[2] }
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-center mb-2">Macro Distribution (g)</h4>
            <div className={`${isMobile ? 'h-48' : 'h-56'} flex flex-col justify-center`}>
              <ChartContainer config={{
                'Protein': { color: COLORS[0] },
                'Carbs': { color: COLORS[1] },
                'Fat': { color: COLORS[2] },
              }} className="h-full w-full">
                <PieChart>
                  <Pie
                    data={macrosData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {macrosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-center mb-2">Calorie Sources</h4>
            <div className={`${isMobile ? 'h-48' : 'h-56'} flex flex-col justify-center`}>
              <ChartContainer config={{
                'Protein': { color: COLORS[0] },
                'Carbs': { color: COLORS[1] },
                'Fat': { color: COLORS[2] },
              }} className="h-full w-full">
                <PieChart>
                  <Pie
                    data={calorieMacroData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {calorieMacroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">Recipe Nutrition Facts</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Calories</p>
            <p className="text-lg font-semibold">{recipeNutrition.calories} kcal</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Protein</p>
            <p className="text-lg font-semibold">{recipeNutrition.protein}g</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Carbs</p>
            <p className="text-lg font-semibold">{recipeNutrition.carbs}g</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Fat</p>
            <p className="text-lg font-semibold">{recipeNutrition.fat}g</p>
          </div>
        </div>
      </div>
    </div>
  );
}
