
import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface MacroPieChartsProps {
  carbsData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  fatsData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const MacroPieCharts = ({ carbsData, fatsData }: MacroPieChartsProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4 text-center">Carbohydrate Distribution</h3>
        <ChartContainer config={{
          'Complex Carbs': { color: '#4f46e5' },
          'Simple Carbs': { color: '#818cf8' },
        }} className="h-40 w-full">
          <PieChart>
            <Pie 
              data={carbsData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {carbsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4 text-center">Fat Distribution</h3>
        <ChartContainer config={{
          'Saturated Fat': { color: '#22c55e' },
          'Unsaturated Fat': { color: '#86efac' },
        }} className="h-40 w-full">
          <PieChart>
            <Pie 
              data={fatsData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {fatsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default MacroPieCharts;
