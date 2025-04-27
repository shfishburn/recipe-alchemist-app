
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  LabelList,
  Cell
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComparisonChartProps {
  compareData: Array<{
    name: string;
    Recipe: number;
    Target: number;
    percentage: number;
    fill: string;
  }>;
}

export function ComparisonChart({ compareData }: ComparisonChartProps) {
  const isMobile = useIsMobile();
  
  const formatYAxisTick = (value: any) => {
    return value;
  };
  
  const formatAxisValue = (value: any) => {
    return `${value}g`;
  };

  return (
    <div className="h-full">
      <ChartContainer config={{
        protein: { color: '#9b87f5' },
        carbs: { color: '#0EA5E9' },
        fat: { color: '#22c55e' },
      }} className={`${isMobile ? 'h-56' : 'h-64'} w-full`}>
        <BarChart 
          data={compareData}
          barGap={2}
          barCategoryGap={isMobile ? "15%" : "25%"}
          margin={{ top: 5, right: 30, left: 10, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            fontSize={isMobile ? 12 : 13}
            tickLine={true}
            axisLine={true}
            fontWeight={500}
          />
          <YAxis 
            tickFormatter={formatYAxisTick}
            fontSize={isMobile ? 11 : 12}
            ticks={[0, 25, 50, 75, 100, 125, 150, 175, 200]}
            domain={[0, 'auto']}
            label={{ 
              value: 'grams', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: isMobile ? 10 : 12, textAnchor: 'middle' } 
            }}
          />
          <Tooltip content={props => <ChartTooltip {...props} />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: 10,
              fontSize: isMobile ? 11 : 13
            }}
            iconSize={isMobile ? 8 : 10}
            iconType="circle"
          />
          <Bar 
            dataKey="Recipe" 
            name="Recipe Amount" 
            fill="#4f46e5"
            radius={[4, 4, 0, 0]}
            maxBarSize={isMobile ? 40 : 60}
          >
            {compareData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList 
              dataKey="Recipe" 
              position="top"
              formatter={formatAxisValue}
              style={{ fontSize: isMobile ? 10 : 11, fontWeight: 500, fill: '#333' }}
            />
          </Bar>
          <Bar 
            dataKey="Target" 
            name="Daily Target" 
            fill="#94a3b8" 
            radius={[4, 4, 0, 0]}
            maxBarSize={isMobile ? 40 : 60}
          >
            <LabelList 
              dataKey="Target" 
              position="top"
              formatter={formatAxisValue}
              style={{ fontSize: isMobile ? 10 : 11, fontWeight: 500, fill: '#666' }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
