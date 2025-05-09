
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { NUTRITION_COLORS } from '@/constants/nutrition';

interface MacroCaloriesBreakdownProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export function MacroCaloriesBreakdown({
  calories,
  protein,
  carbs,
  fat,
  dailyCalories,
  macroSplit
}: MacroCaloriesBreakdownProps) {
  const isMobile = useIsMobile();
  
  // Calculate calories from macronutrients
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;
  
  // Prepare data for pie chart
  const macroData = [
    { name: 'Protein', value: proteinCalories, color: NUTRITION_COLORS.proteinBg },
    { name: 'Carbs', value: carbsCalories, color: NUTRITION_COLORS.carbsBg },
    { name: 'Fat', value: fatCalories, color: NUTRITION_COLORS.fatBg }
  ].filter(item => item.value > 0); // Only include non-zero values
  
  // Calculate percentage of daily calories
  const caloriesPercentage = Math.round((calories / dailyCalories) * 100);
  
  // Format the macronutrient percentages
  const actualProteinPercentage = Math.round((proteinCalories / calories) * 100) || 0;
  const actualCarbsPercentage = Math.round((carbsCalories / calories) * 100) || 0;
  const actualFatPercentage = Math.round((fatCalories / calories) * 100) || 0;
  
  // Calculate the difference between actual and target percentages
  const proteinDiff = actualProteinPercentage - macroSplit.protein;
  const carbsDiff = actualCarbsPercentage - macroSplit.carbs;
  const fatDiff = actualFatPercentage - macroSplit.fat;
  
  // Helper function to determine text color for difference
  const getDiffColor = (diff: number) => {
    if (Math.abs(diff) < 5) return "text-green-600"; // Close enough to target
    if (diff > 0) return "text-amber-600"; // Over target
    return "text-blue-600"; // Under target
  };
  
  // Helper function to format the difference
  const formatDiff = (diff: number) => {
    if (diff === 0) return "on target";
    if (diff > 0) return `+${diff}%`;
    return `${diff}%`;
  };
  
  return (
    <div className="space-y-2 bg-slate-50 p-4 rounded-md">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium">Macronutrient Breakdown</h4>
        <span className="text-sm">
          <span className="font-semibold">{caloriesPercentage}%</span> of daily target
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={macroData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {macroData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="space-y-1 mt-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Protein ({macroSplit.protein}% target)</span>
          <span>
            {actualProteinPercentage}% 
            <span className={`ml-1 ${getDiffColor(proteinDiff)}`}>
              {formatDiff(proteinDiff)}
            </span>
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Carbs ({macroSplit.carbs}% target)</span>
          <span>
            {actualCarbsPercentage}%
            <span className={`ml-1 ${getDiffColor(carbsDiff)}`}>
              {formatDiff(carbsDiff)}
            </span>
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Fat ({macroSplit.fat}% target)</span>
          <span>
            {actualFatPercentage}%
            <span className={`ml-1 ${getDiffColor(fatDiff)}`}>
              {formatDiff(fatDiff)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
