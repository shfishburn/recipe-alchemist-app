
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/ui/chart';

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
  
  // Data for the bar chart comparing recipe nutrition with daily targets
  const compareData = [
    {
      name: 'Protein',
      Recipe: recipeNutrition.protein,
      Target: proteinTarget,
      percentage: proteinPercentOfTarget
    },
    {
      name: 'Carbs',
      Recipe: recipeNutrition.carbs,
      Target: carbsTarget,
      percentage: carbsPercentOfTarget
    },
    {
      name: 'Fat',
      Recipe: recipeNutrition.fat,
      Target: fatTarget,
      percentage: fatPercentOfTarget
    },
    {
      name: 'Calories',
      Recipe: recipeNutrition.calories,
      Target: dailyCalories,
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
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="mb-2 w-full justify-start">
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="pt-2">
          <Card>
            <CardContent className="p-2">
              <p className="text-xs text-muted-foreground mb-2 text-center">
                Recipe vs. Daily Targets (g)
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compareData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Recipe" fill="#4f46e5" name="Recipe" />
                    <Bar dataKey="Target" fill="#94a3b8" name="Daily Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
                  <ResponsiveContainer width="100%" height="100%">
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
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {userPreferences && (
              <Card>
                <CardContent className="p-2">
                  <p className="text-xs text-muted-foreground mb-2 text-center">
                    Your Target Macro Breakdown
                  </p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Protein', value: proteinPercentage },
                            { name: 'Carbs', value: carbsPercentage },
                            { name: 'Fat', value: fatPercentage }
                          ]}
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
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-sm space-y-1 py-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 bg-gray-50 rounded-md">
          <p className="font-medium text-xs text-gray-500">Calories</p>
          <p className="font-bold">{recipeNutrition.calories} kcal</p>
          <p className="text-xs text-gray-500">({caloriesPercentage}% daily)</p>
        </div>
        <div className="p-2 bg-indigo-50 rounded-md">
          <p className="font-medium text-xs text-gray-500">Protein</p>
          <p className="font-bold">{recipeNutrition.protein}g</p>
          <p className="text-xs text-gray-500">({proteinPercentOfTarget}% daily)</p>
        </div>
        <div className="p-2 bg-sky-50 rounded-md">
          <p className="font-medium text-xs text-gray-500">Carbs</p>
          <p className="font-bold">{recipeNutrition.carbs}g</p>
          <p className="text-xs text-gray-500">({carbsPercentOfTarget}% daily)</p>
        </div>
        <div className="p-2 bg-green-50 rounded-md">
          <p className="font-medium text-xs text-gray-500">Fat</p>
          <p className="font-bold">{recipeNutrition.fat}g</p>
          <p className="text-xs text-gray-500">({fatPercentOfTarget}% daily)</p>
        </div>
      </div>
    </div>
  );
}
