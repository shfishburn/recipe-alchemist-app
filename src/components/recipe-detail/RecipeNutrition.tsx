import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { NutritionPreferencesType } from '@/pages/Profile';
import { ChartContainer } from '@/components/ui/chart';

interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionChartProps {
  recipeNutrition: RecipeNutrition;
  userPreferences: NutritionPreferencesType;
}

export function NutritionChart({ recipeNutrition, userPreferences }: NutritionChartProps) {
  // Calculate user's target macros in grams
  const proteinTarget = Math.round((userPreferences.dailyCalories * (userPreferences.macroSplit.protein / 100)) / 4);
  const carbsTarget = Math.round((userPreferences.dailyCalories * (userPreferences.macroSplit.carbs / 100)) / 4);
  const fatTarget = Math.round((userPreferences.dailyCalories * (userPreferences.macroSplit.fat / 100)) / 9);
  
  // Calculate percentage of daily goal
  const proteinPercentage = Math.round((recipeNutrition.protein / proteinTarget) * 100);
  const carbsPercentage = Math.round((recipeNutrition.carbs / carbsTarget) * 100);
  const fatPercentage = Math.round((recipeNutrition.fat / fatTarget) * 100);
  const caloriesPercentage = Math.round((recipeNutrition.calories / userPreferences.dailyCalories) * 100);
  
  // Data for the bar chart comparing recipe nutrition with daily targets
  const compareData = [
    {
      name: 'Protein',
      Recipe: recipeNutrition.protein,
      Target: proteinTarget,
      percentage: proteinPercentage
    },
    {
      name: 'Carbs',
      Recipe: recipeNutrition.carbs,
      Target: carbsTarget,
      percentage: carbsPercentage
    },
    {
      name: 'Fat',
      Recipe: recipeNutrition.fat,
      Target: fatTarget,
      percentage: fatPercentage
    },
    {
      name: 'Calories',
      Recipe: recipeNutrition.calories,
      Target: userPreferences.dailyCalories,
      percentage: caloriesPercentage
    }
  ];
  
  // Data for the pie chart showing macro distribution in the recipe
  const recipeMacrosTotal = recipeNutrition.protein + recipeNutrition.carbs + recipeNutrition.fat;
  const macrosData = [
    { name: 'Protein', value: Math.round((recipeNutrition.protein / recipeMacrosTotal) * 100) },
    { name: 'Carbs', value: Math.round((recipeNutrition.carbs / recipeMacrosTotal) * 100) },
    { name: 'Fat', value: Math.round((recipeNutrition.fat / recipeMacrosTotal) * 100) }
  ];
  
  // Data for the pie chart showing user's target macro distribution
  const targetMacrosData = [
    { name: 'Protein', value: userPreferences.macroSplit.protein },
    { name: 'Carbs', value: userPreferences.macroSplit.carbs },
    { name: 'Fat', value: userPreferences.macroSplit.fat }
  ];
  
  // Colors for the pie charts
  const COLORS = ['#4f46e5', '#0ea5e9', '#22c55e']; // Indigo, Sky blue, Green
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border rounded shadow text-xs">
          <p className="font-medium">{label}</p>
          <p>Recipe: {payload[0].value}g ({payload[0].payload.percentage}% of target)</p>
          <p>Daily Target: {payload[1].value}g</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="comparison">
        <TabsList className="mb-2">
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="pt-2">
          <Card>
            <CardContent className="p-2">
              <p className="text-xs text-muted-foreground mb-2 text-center">
                Recipe vs. Daily Targets (g)
              </p>
              <ChartContainer config={{
                protein: { color: '#4f46e5' },
                carbs: { color: '#0ea5e9' },
                fat: { color: '#22c55e' },
              }} className="h-64 w-full">
                <BarChart data={compareData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Recipe" fill="#4f46e5" name="Recipe" />
                  <Bar dataKey="Target" fill="#94a3b8" name="Daily Target" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-2">
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  Recipe Macro Breakdown
                </p>
                <div className="h-40">
                  <ChartContainer config={{
                    protein: { color: COLORS[0] },
                    carbs: { color: COLORS[1] },
                    fat: { color: COLORS[2] },
                  }} className="h-full w-full">
                    <PieChart>
                      <Pie
                        data={macrosData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {macrosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-2">
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  Your Target Macro Breakdown
                </p>
                <div className="h-40">
                  <ChartContainer config={{
                    protein: { color: COLORS[0] },
                    carbs: { color: COLORS[1] },
                    fat: { color: COLORS[2] },
                  }} className="h-full w-full">
                    <PieChart>
                      <Pie
                        data={targetMacrosData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {targetMacrosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Calories:</span> {recipeNutrition.calories} kcal ({caloriesPercentage}% of daily target)
        </p>
        <p>
          <span className="font-medium">Protein:</span> {recipeNutrition.protein}g ({proteinPercentage}% of daily target)
        </p>
        <p>
          <span className="font-medium">Carbs:</span> {recipeNutrition.carbs}g ({carbsPercentage}% of daily target)
        </p>
        <p>
          <span className="font-medium">Fat:</span> {recipeNutrition.fat}g ({fatPercentage}% of daily target)
        </p>
      </div>
    </div>
  );
}

