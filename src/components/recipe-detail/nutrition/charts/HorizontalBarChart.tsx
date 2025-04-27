
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
  ReferenceLine,
  LabelList
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';

interface ChartData {
  name: string;
  Recipe: number;
  Target: number;
  percentage: number;
  fill: string;
}

interface HorizontalBarChartProps {
  data: ChartData[];
  showPercentage: boolean;
  height?: number;
}

export function HorizontalBarChart({ data, showPercentage, height = 200 }: HorizontalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={data.length > 1 ? height : 120}>
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
        <Tooltip content={(props) => <ChartTooltip {...props} showPercentage={showPercentage} />} />
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
}
