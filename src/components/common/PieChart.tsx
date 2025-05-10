
import React from 'react';
import { PieChart as ReChartsPie, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export default function PieChart({ data }: PieChartProps) {
  // Filter out any data points with zero value to avoid rendering issues
  const filteredData = data.filter(item => item.value > 0);
  
  // If no data has values, show empty chart with placeholder
  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-muted-foreground">
        <p className="text-xs">No data available</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReChartsPie width={300} height={300} data={filteredData}>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius="90%"
          paddingAngle={1}
          dataKey="value"
          stroke="#e5e7eb" // Light border
          strokeWidth={1}
        >
          {filteredData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
              strokeWidth={index === 0 ? 2 : 1} 
            />
          ))}
        </Pie>
      </ReChartsPie>
    </ResponsiveContainer>
  );
}
