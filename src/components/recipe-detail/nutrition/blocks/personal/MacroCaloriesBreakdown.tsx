
import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface MacroCaloriesBreakdownProps {
  proteinCalories: number;
  carbCalories: number;
  fatCalories: number;
  proteinCaloriePercent: number;
  carbCaloriePercent: number;
  fatCaloriePercent: number;
  colors: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

export function MacroCaloriesBreakdown({
  proteinCalories,
  carbCalories,
  fatCalories,
  proteinCaloriePercent,
  carbCaloriePercent,
  fatCaloriePercent,
  colors
}: MacroCaloriesBreakdownProps) {
  const data = [
    { name: `Protein (${proteinCaloriePercent}%)`, value: proteinCalories, color: colors.protein },
    { name: `Carbs (${carbCaloriePercent}%)`, value: carbCalories, color: colors.carbs },
    { name: `Fat (${fatCaloriePercent}%)`, value: fatCalories, color: colors.fat }
  ];
  
  return (
    <div className="mt-6">
      <h5 className="text-xs font-semibold mb-3">Calorie Source Breakdown</h5>
      
      <div className="bg-white rounded-md p-4 shadow-sm">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconSize={10}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 text-xs text-center text-muted-foreground">
          <p>Total calories: {proteinCalories + carbCalories + fatCalories}</p>
        </div>
      </div>
    </div>
  );
}
