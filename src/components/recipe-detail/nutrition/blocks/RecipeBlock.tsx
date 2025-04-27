
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

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
  
  const COLORS = {
    protein: '#9b87f5',
    carbs: '#0EA5E9',
    fat: '#22c55e'
  };
  
  // Calculate macro distribution
  const total = recipeNutrition.protein + recipeNutrition.carbs + recipeNutrition.fat;
  const proteinPercent = Math.round((recipeNutrition.protein / total) * 100);
  const carbsPercent = Math.round((recipeNutrition.carbs / total) * 100);
  const fatPercent = Math.round((recipeNutrition.fat / total) * 100);
  
  const macrosData = [
    { name: 'Protein', value: proteinPercent, fill: COLORS.protein },
    { name: 'Carbs', value: carbsPercent, fill: COLORS.carbs },
    { name: 'Fat', value: fatPercent, fill: COLORS.fat }
  ];
  
  // Calculate calories from each macro
  const proteinCalories = recipeNutrition.protein * 4;
  const carbsCalories = recipeNutrition.carbs * 4;
  const fatCalories = recipeNutrition.fat * 9;
  const totalCalories = recipeNutrition.calories;
  
  const calorieMacroData = [
    { name: 'Protein', value: Math.round((proteinCalories / totalCalories) * 100), fill: COLORS.protein },
    { name: 'Carbs', value: Math.round((carbsCalories / totalCalories) * 100), fill: COLORS.carbs },
    { name: 'Fat', value: Math.round((fatCalories / totalCalories) * 100), fill: COLORS.fat }
  ];
  
  const renderLabel = ({ name, value }: { name: string; value: number }) => `${name}: ${value}%`;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Macronutrient Distribution by Weight</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Shows the percentage breakdown of protein, carbs, and fat by weight (grams) in this recipe.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mb-1 text-center">
              Distribution by grams
            </p>
            <div className={`${isMobile ? 'h-52' : 'h-56'} flex flex-col justify-center`}>
              <ChartContainer config={{
                'Protein': { color: COLORS.protein },
                'Carbs': { color: COLORS.carbs },
                'Fat': { color: COLORS.fat },
              }} className="h-full w-full">
                <PieChart>
                  <Pie
                    data={macrosData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 65 : 80}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderLabel}
                  >
                    {macrosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
                    wrapperStyle={{ bottom: 10 }}
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Calorie Source Breakdown</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Shows the percentage of calories provided by each macronutrient. Note that fat has 9 calories per gram, while protein and carbs have 4 calories per gram.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mb-1 text-center">
              Distribution by calories
            </p>
            <div className={`${isMobile ? 'h-52' : 'h-56'} flex flex-col justify-center`}>
              <ChartContainer config={{
                'Protein': { color: COLORS.protein },
                'Carbs': { color: COLORS.carbs },
                'Fat': { color: COLORS.fat },
              }} className="h-full w-full">
                <PieChart>
                  <Pie
                    data={calorieMacroData}
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 65 : 80}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderLabel}
                  >
                    {calorieMacroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend 
                    formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
                    wrapperStyle={{ bottom: 10 }}
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">Recipe Nutritional Content</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-xs text-gray-500">Calories</p>
            <p className="text-lg font-semibold">{recipeNutrition.calories} kcal</p>
            <p className="text-xs text-muted-foreground">Total calories</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${COLORS.protein}` }}>
            <p className="text-xs text-gray-500">Protein</p>
            <p className="text-lg font-semibold">{recipeNutrition.protein}g</p>
            <p className="text-xs text-muted-foreground">{proteinCalories} kcal ({proteinPercent}%)</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${COLORS.carbs}` }}>
            <p className="text-xs text-gray-500">Carbs</p>
            <p className="text-lg font-semibold">{recipeNutrition.carbs}g</p>
            <p className="text-xs text-muted-foreground">{carbsCalories} kcal ({carbsPercent}%)</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${COLORS.fat}` }}>
            <p className="text-xs text-gray-500">Fat</p>
            <p className="text-lg font-semibold">{recipeNutrition.fat}g</p>
            <p className="text-xs text-muted-foreground">{fatCalories} kcal ({fatPercent}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
