
import React from 'react';
import { HorizontalBarChart } from './HorizontalBarChart';
import { NutritionSummaryText } from './NutritionSummaryText';

interface ChartData {
  name: string;
  Recipe: number;
  Target: number;
  percentage: number;
  value?: string;
  fill?: string;
}

interface ComparisonChartProps {
  compareData: ChartData[];
  unitSystem?: 'metric' | 'imperial';
}

export function ComparisonChart({ compareData, unitSystem = 'metric' }: ComparisonChartProps) {
  // Extract macronutrient data for summary display
  const proteinData = compareData.find(item => item.name === 'Protein');
  const carbsData = compareData.find(item => item.name === 'Carbs');
  const fatData = compareData.find(item => item.name === 'Fat');
  
  // Add fiber data if it exists, otherwise use default values
  const fiberData = {
    Recipe: 0,
    Target: 25,
    percentage: 0
  };
  
  // Calculate calories
  const caloriesFromProtein = (proteinData?.Recipe || 0) * 4;
  const caloriesFromCarbs = (carbsData?.Recipe || 0) * 4;
  const caloriesFromFat = (fatData?.Recipe || 0) * 9;
  const totalCalories = caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;
  const dailyCalories = 2000; // Default daily calories
  
  return (
    <div className="space-y-6">
      {/* Percentage of daily target chart */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium mb-2">% of Daily Targets</h3>
        <HorizontalBarChart 
          data={compareData.map(item => ({
            ...item,
            value: `${item.percentage}%`, // Pre-formatted value
            fill: '#4f46e5' // Default fill color
          }))} 
          showPercentage={true}
          showValue={true}
          height={140}
        />
      </div>
      
      {/* Recipe vs. Target chart */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium mb-2">Recipe vs. Daily Targets</h3>
        <HorizontalBarChart 
          data={compareData.map(item => ({
            ...item,
            fill: '#4f46e5' // Default fill color
          }))} 
          showPercentage={false}
          height={140}
        />
      </div>
      
      {/* Text summary */}
      <NutritionSummaryText
        calories={Math.round(totalCalories)}
        protein={proteinData?.Recipe || 0}
        carbs={carbsData?.Recipe || 0} 
        fat={fatData?.Recipe || 0}
        fiber={fiberData.Recipe}
        caloriesPercentage={Math.round((totalCalories / dailyCalories) * 100)}
        proteinPercentage={proteinData?.percentage || 0}
        carbsPercentage={carbsData?.percentage || 0}
        fatPercentage={fatData?.percentage || 0}
        fiberPercentage={fiberData.percentage}
        unitSystem={unitSystem}
      />
    </div>
  );
}
