
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface MacroChartProps {
  chartData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function MacroChart({ chartData }: MacroChartProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <ChartContainer config={{
        protein: { color: '#4f46e5' },
        carbs: { color: '#0ea5e9' },
        fat: { color: '#22c55e' },
      }} className="h-64 w-full">
        <PieChart>
          <Pie 
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
