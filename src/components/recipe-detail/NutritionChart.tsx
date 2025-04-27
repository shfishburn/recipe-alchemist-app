
import React, { useState } from 'react';
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
  ReferenceLine,
  LabelList
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Percent, BarChartHorizontal } from 'lucide-react';

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
  
  // Data for the macronutrient chart
  const macroData = [
    {
      name: 'Protein',
      Recipe: recipeNutrition.protein,
      Target: proteinTarget,
      percentage: proteinPercentOfTarget,
      fill: '#9b87f5' // primary purple
    },
    {
      name: 'Carbs',
      Recipe: recipeNutrition.carbs,
      Target: carbsTarget,
      percentage: carbsPercentOfTarget,
      fill: '#0EA5E9' // ocean blue
    },
    {
      name: 'Fat',
      Recipe: recipeNutrition.fat,
      Target: fatTarget,
      percentage: fatPercentOfTarget,
      fill: '#22c55e' // soft green
    }
  ];

  // Data for calories chart
  const calorieData = [
    {
      name: 'Calories',
      Recipe: recipeNutrition.calories,
      Target: dailyCalories,
      percentage: caloriesPercentage,
      fill: '#F97316' // bright orange
    }
  ];
  
  // Data for the pie chart showing macro distribution in the recipe
  const recipeMacrosTotal = recipeNutrition.protein + recipeNutrition.carbs + recipeNutrition.fat;
  const macrosData = [
    { name: 'Protein', value: Math.round((recipeNutrition.protein / recipeMacrosTotal) * 100), fill: '#9b87f5' },
    { name: 'Carbs', value: Math.round((recipeNutrition.carbs / recipeMacrosTotal) * 100), fill: '#0EA5E9' },
    { name: 'Fat', value: Math.round((recipeNutrition.fat / recipeMacrosTotal) * 100), fill: '#22c55e' }
  ];
  
  // Data for the pie chart showing user's target macro distribution
  const targetMacrosData = [
    { name: 'Protein', value: proteinPercentage, fill: '#9b87f5' },
    { name: 'Carbs', value: carbsPercentage, fill: '#0EA5E9' },
    { name: 'Fat', value: fatPercentage, fill: '#22c55e' }
  ];
  
  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border border-gray-200 rounded shadow-md text-xs">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-gray-800">
            Recipe: {showPercentage ? `${payload[0].payload.percentage}%` : `${payload[0].value}${label === 'Calories' ? ' kcal' : 'g'}`}
          </p>
          <p className="text-gray-600">
            Daily Target: {showPercentage ? '100%' : `${payload[1].value}${label === 'Calories' ? ' kcal' : 'g'}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Function to render the values on bars
  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value, index, dataKey, payload } = props;
    
    const displayValue = showPercentage 
      ? `${payload.percentage}%` 
      : value;
    
    // For horizontal bars
    if (viewType === 'horizontal') {
      const xPos = x + width + 5;
      const yPos = y + height / 2;
      return (
        <text 
          x={xPos} 
          y={yPos} 
          fill="#333" 
          textAnchor="start" 
          dominantBaseline="middle"
          fontSize={12}
          fontWeight={500}
        >
          {displayValue}{!showPercentage && (payload.name === 'Calories' ? ' kcal' : 'g')}
        </text>
      );
    }
    
    // For vertical bars
    const xPos = x + width / 2;
    const yPos = y - 5;
    return (
      <text 
        x={xPos} 
        y={yPos} 
        fill="#333" 
        textAnchor="middle" 
        dominantBaseline="bottom"
        fontSize={12}
        fontWeight={500}
      >
        {displayValue}
      </text>
    );
  };

  // Function to render horizontal bar charts
  const renderHorizontalBarChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height={data.length > 1 ? 200 : 120}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 100, left: 60, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          tick={{ fontSize: 14 }} 
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Bar 
          dataKey={showPercentage ? "percentage" : "Recipe"} 
          name={showPercentage ? "% of Target" : "Recipe"}
          fill="#9b87f5" 
          radius={[0, 4, 4, 0]}
          barSize={showPercentage ? 20 : 24}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey={showPercentage ? "percentage" : "Recipe"}
            position="right"
            formatter={(value: any, entry: any) => 
              `${value}${showPercentage ? '%' : (entry.payload.name === 'Calories' ? ' kcal' : 'g')}`
            }
          />
        </Bar>
        {!showPercentage && (
          <Bar 
            dataKey="Target" 
            fill="#D3E4FD" 
            radius={[0, 4, 4, 0]}
            barSize={24}
            name="Daily Target"
          >
            <LabelList
              dataKey="Target"
              position="right"
              formatter={(value: any, entry: any) => 
                `${value}${entry.payload.name === 'Calories' ? ' kcal' : 'g'}`
              }
            />
          </Bar>
        )}
        {showPercentage && (
          <ReferenceLine x={100} stroke="#F97316" strokeWidth={1.5} label="Target" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  // Function to render vertical bar charts
  const renderVerticalBarChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 30, left: 20, bottom: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 14 }} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={36} />
        <Bar 
          dataKey={showPercentage ? "percentage" : "Recipe"} 
          name={showPercentage ? "% of Target" : "Recipe"}
          fill="#9b87f5" 
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey={showPercentage ? "percentage" : "Recipe"}
            position="top"
            formatter={(value: any) => `${value}${showPercentage ? '%' : ''}`}
          />
        </Bar>
        {!showPercentage && (
          <Bar 
            dataKey="Target" 
            fill="#D3E4FD" 
            radius={[4, 4, 0, 0]}
            name="Daily Target"
          >
            <LabelList
              dataKey="Target"
              position="top"
            />
          </Bar>
        )}
        {showPercentage && (
          <ReferenceLine y={100} stroke="#F97316" strokeWidth={1.5} label="Target" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
  
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
                  {viewType === 'horizontal' 
                    ? renderHorizontalBarChart(macroData)
                    : renderVerticalBarChart(macroData)
                  }
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-center mb-2">Calories</h4>
                  {viewType === 'horizontal' 
                    ? renderHorizontalBarChart(calorieData)
                    : renderVerticalBarChart(calorieData)
                  }
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-center mb-2">
                    Recipe Macro Breakdown
                  </h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macrosData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {macrosData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {userPreferences && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-center mb-2">
                      Your Target Macro Breakdown
                    </h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={targetMacrosData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {targetMacrosData.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 rounded-md bg-gray-50">
          <p className="text-xs text-gray-500 font-medium">Calories</p>
          <p className="font-bold">{recipeNutrition.calories} kcal</p>
          <p className="text-xs text-gray-500">({caloriesPercentage}% daily)</p>
        </div>
        <div className="p-2 rounded-md" style={{ backgroundColor: '#e5deff' }}>
          <p className="text-xs text-gray-500 font-medium">Protein</p>
          <p className="font-bold">{recipeNutrition.protein}g</p>
          <p className="text-xs text-gray-500">({proteinPercentOfTarget}% daily)</p>
        </div>
        <div className="p-2 rounded-md" style={{ backgroundColor: '#d3e4fd' }}>
          <p className="text-xs text-gray-500 font-medium">Carbs</p>
          <p className="font-bold">{recipeNutrition.carbs}g</p>
          <p className="text-xs text-gray-500">({carbsPercentOfTarget}% daily)</p>
        </div>
        <div className="p-2 rounded-md" style={{ backgroundColor: '#f2fce2' }}>
          <p className="text-xs text-gray-500 font-medium">Fat</p>
          <p className="font-bold">{recipeNutrition.fat}g</p>
          <p className="text-xs text-gray-500">({fatPercentOfTarget}% daily)</p>
        </div>
      </div>
    </div>
  );
}
