
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
  LabelList,
  Cell
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Format label value safely with null checks
  const formatLabelValue = (value: any, entry: any) => {
    if (value === undefined || value === null) return '';
    
    // Check if entry and payload exist
    if (!entry || !entry.payload) return `${value}`;
    
    const name = entry.payload.name;
    if (showPercentage) {
      return `${value}%`;
    } else {
      return `${value}${name === 'Calories' ? ' kcal' : 'g'}`;
    }
  };

  // Calculate responsive margins based on device type
  const margins = isMobile 
    ? { top: 15, right: 60, left: 40, bottom: 5 }
    : { top: 20, right: 100, left: 60, bottom: 5 };

  return (
    <ResponsiveContainer 
      width="100%" 
      height={data.length > 1 ? (isMobile ? height * 0.8 : height) : (isMobile ? 100 : 120)}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={margins}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          tick={{ fontSize: isMobile ? 12 : 14 }} 
          width={isMobile ? 40 : 60}
        />
        <Tooltip content={(props: any) => <ChartTooltip {...props} showPercentage={showPercentage} />} />
        <Legend 
          verticalAlign="top" 
          height={32} 
          wrapperStyle={isMobile ? { fontSize: '10px' } : undefined}
        />
        <Bar 
          dataKey={showPercentage ? "percentage" : "Recipe"} 
          name={showPercentage ? "% of Target" : "Recipe"}
          fill="#9b87f5" 
          radius={[0, 4, 4, 0]}
          barSize={showPercentage ? (isMobile ? 16 : 20) : (isMobile ? 20 : 24)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey={showPercentage ? "percentage" : "Recipe"}
            position="right"
            formatter={formatLabelValue}
            style={{ fontSize: isMobile ? '10px' : '12px' }}
          />
        </Bar>
        {!showPercentage && (
          <Bar 
            dataKey="Target" 
            fill="#D3E4FD" 
            radius={[0, 4, 4, 0]}
            barSize={isMobile ? 20 : 24}
            name="Daily Target"
          >
            <LabelList
              dataKey="Target"
              position="right"
              formatter={formatLabelValue}
              style={{ fontSize: isMobile ? '10px' : '12px' }}
            />
          </Bar>
        )}
        {showPercentage && (
          <ReferenceLine x={100} stroke="#F97316" strokeWidth={1.5} label={{ value: "Target", position: 'right', fontSize: isMobile ? 10 : 12 }} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
