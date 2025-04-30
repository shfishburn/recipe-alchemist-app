import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { ChartTooltip } from '../charts/ChartTooltip';
import { NUTRITION_COLORS } from './personal/constants';
import { MicronutrientsDisplay } from '../MicronutrientsDisplay';
import { ExtendedNutritionData } from '../useNutritionData';
import { WeightDisplay } from '@/components/ui/unit-display';

interface RecipeBlockProps {
  recipeNutrition: ExtendedNutritionData;
  unitSystem: 'metric' | 'imperial';
}

export function RecipeBlock({ recipeNutrition, unitSystem }: RecipeBlockProps) {
  const isMobile = useIsMobile();
  
  const COLORS = {
    protein: NUTRITION_COLORS.protein,
    carbs: NUTRITION_COLORS.carbs,
    fat: NUTRITION_COLORS.fat
  };
  
  const totalGrams = recipeNutrition.protein + recipeNutrition.carbs + recipeNutrition.fat;
  const proteinPercent = Math.round((recipeNutrition.protein / totalGrams) * 100);
  const carbsPercent = Math.round((recipeNutrition.carbs / totalGrams) * 100);
  const fatPercent = Math.round((recipeNutrition.fat / totalGrams) * 100);
  
  const macrosData = [
    { 
      name: 'Protein', 
      value: proteinPercent, 
      fill: COLORS.protein,
      actualGrams: recipeNutrition.protein,
      tooltip: 'Essential for muscle building and repair'
    },
    { 
      name: 'Carbs', 
      value: carbsPercent, 
      fill: COLORS.carbs,
      actualGrams: recipeNutrition.carbs,
      tooltip: 'Primary energy source for the body'
    },
    { 
      name: 'Fat', 
      value: fatPercent, 
      fill: COLORS.fat,
      actualGrams: recipeNutrition.fat,
      tooltip: 'Important for hormone production and nutrient absorption'
    }
  ];
  
  const proteinCalories = recipeNutrition.protein * 4;
  const carbsCalories = recipeNutrition.carbs * 4;
  const fatCalories = recipeNutrition.fat * 9;
  const totalCalories = recipeNutrition.calories || (proteinCalories + carbsCalories + fatCalories);
  
  const calorieMacroData = [
    { 
      name: 'Protein', 
      value: Math.round((proteinCalories / totalCalories) * 100), 
      fill: COLORS.protein,
      actualCalories: proteinCalories,
      conversionFactor: '4 cal/g',
      tooltip: 'Protein provides 4 calories per gram'
    },
    { 
      name: 'Carbs', 
      value: Math.round((carbsCalories / totalCalories) * 100), 
      fill: COLORS.carbs,
      actualCalories: carbsCalories,
      conversionFactor: '4 cal/g',
      tooltip: 'Carbohydrates provide 4 calories per gram'
    },
    { 
      name: 'Fat', 
      value: Math.round((fatCalories / totalCalories) * 100), 
      fill: COLORS.fat,
      actualCalories: fatCalories,
      conversionFactor: '9 cal/g',
      tooltip: 'Fat provides 9 calories per gram, more than twice that of protein or carbs'
    }
  ];

  const renderCustomLabel = ({ name, value, cx, cy, midAngle, innerRadius, outerRadius, actualGrams, actualCalories }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={isMobile ? "12" : "14"}
        fontWeight="500"
      >
        {`${value}%`}
      </text>
    );
  };

  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-3 border rounded-md shadow-md text-xs">
        <p className="font-medium mb-1 text-sm" style={{ color: data.fill }}>{data.name}</p>
        
        {data.actualGrams !== undefined && (
          <p className="mb-0.5">
            <span className="font-semibold">{data.actualGrams}g</span> ({data.value}% of total)
          </p>
        )}
        
        {data.actualCalories !== undefined && (
          <>
            <p className="mb-0.5">
              <span className="font-semibold">{data.actualCalories} kcal</span> ({data.value}% of total)
            </p>
            <p className="text-gray-500 mb-0.5">Conversion: {data.conversionFactor}</p>
          </>
        )}
        
        {data.tooltip && <p className="mt-1 text-gray-500">{data.tooltip}</p>}
      </div>
    );
  };
  
  const customLegendFormatter = (value: string, entry: any) => {
    let extraInfo = '';
    if (entry.payload.actualGrams !== undefined) {
      extraInfo = `${entry.payload.actualGrams}g`;
    } else if (entry.payload.actualCalories !== undefined) {
      extraInfo = `${entry.payload.actualCalories} kcal`;
    }
    
    return (
      <span className="text-xs">
        {value}: <span className="font-medium">{extraInfo} ({entry.payload.value}%)</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Macronutrient Distribution by Weight</h4>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Shows the percentage breakdown of protein, carbs, and fat by weight (grams) in this recipe.</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
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
                    innerRadius={isMobile ? 40 : 50}
                    outerRadius={isMobile ? 65 : 80}
                    paddingAngle={2}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={false}
                    isAnimationActive={false}
                  >
                    {macrosData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                        strokeWidth={1}
                        stroke="#fff"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={customTooltip} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={customLegendFormatter}
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
                <UITooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Shows the percentage of calories provided by each macronutrient. Note that fat has 9 calories per gram, while protein and carbs have 4 calories per gram.</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
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
                    innerRadius={isMobile ? 40 : 50}
                    outerRadius={isMobile ? 65 : 80}
                    paddingAngle={2}
                    dataKey="value"
                    label={renderCustomLabel}
                    labelLine={false}
                    isAnimationActive={false}
                  >
                    {calorieMacroData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                        strokeWidth={1}
                        stroke="#fff"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={customTooltip} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={customLegendFormatter}
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
            <p className="text-lg font-semibold">{totalCalories} kcal</p>
            <p className="text-xs text-muted-foreground">Total calories</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${COLORS.protein}` }}>
            <p className="text-xs text-gray-500">Protein</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold">{recipeNutrition.protein}g</p>
              <p className="text-xs font-medium">{proteinCalories} kcal</p>
            </div>
            <p className="text-xs text-muted-foreground">{proteinPercent}% by weight, {Math.round((proteinCalories / totalCalories) * 100)}% of calories</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${COLORS.carbs}` }}>
            <p className="text-xs text-gray-500">Carbs</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold">{recipeNutrition.carbs}g</p>
              <p className="text-xs font-medium">{carbsCalories} kcal</p>
            </div>
            <p className="text-xs text-muted-foreground">{carbsPercent}% by weight, {Math.round((carbsCalories / totalCalories) * 100)}% of calories</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid ${COLORS.fat}` }}>
            <p className="text-xs text-gray-500">Fat</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold">{recipeNutrition.fat}g</p>
              <p className="text-xs font-medium">{fatCalories} kcal</p>
            </div>
            <p className="text-xs text-muted-foreground">{fatPercent}% by weight, {Math.round((fatCalories / totalCalories) * 100)}% of calories</p>
          </div>
        </div>
        <div className="mt-4 bg-white p-3 rounded-md shadow-sm" style={{ borderLeft: `3px solid #65a30d` }}>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500">Fiber</p>
              <p className="text-lg font-semibold">{recipeNutrition.fiber}g</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Daily Value</p>
              <p className="text-md font-medium">{recipeNutrition.fiberPercentage}%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Fiber adds bulk to your diet and helps with digestion
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          *Protein and carbs provide 4 calories per gram, while fat provides 9 calories per gram.
        </p>
      </div>
      
      {/* Add the micronutrients display with unitSystem */}
      <MicronutrientsDisplay nutrition={recipeNutrition} unitSystem={unitSystem} />
    </div>
  );
}
