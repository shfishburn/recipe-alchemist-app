
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
  value?: string; // For pre-formatted display values
}

interface HorizontalBarChartProps {
  data: ChartData[];
  showPercentage: boolean;
  showValue?: boolean; // Whether to use pre-formatted value string
  height?: number;
}

export function HorizontalBarChart({ 
  data, 
  showPercentage, 
  showValue = false,
  height = 200 
}: HorizontalBarChartProps) {
  const isMobile = useIsMobile();
  
  // Format label value safely with null checks
  const formatLabelValue = (value: any, entry: any) => {
    if (value === undefined || value === null) return '';
    
    // For very small screens, don't show labels to avoid overlap
    if (isMobile && window.innerWidth < 340) return '';
    
    // Check if entry and payload exist
    if (!entry || !entry.payload) return `${value}`;
    
    // If showValue is true and we have a formatted value string, use that
    if (showValue && entry.payload.value) {
      return entry.payload.value;
    }
    
    const name = entry.payload.name;
    if (showPercentage) {
      return `${value}%`;
    } else {
      return `${value}${name === 'Calories' ? ' kcal' : 'g'}`;
    }
  };

  // Calculate responsive margins based on device type
  const margins = isMobile 
    ? { top: 15, right: 80, left: 40, bottom: 5 }
    : { top: 20, right: 140, left: 60, bottom: 5 };

  // Calculate height based on number of data items for mobile devices
  const calculatedHeight = isMobile 
    ? Math.max(80, data.length * 40)
    : height;

  return (
    <ResponsiveContainer 
      width="100%" 
      height={data.length > 1 ? calculatedHeight : (isMobile ? 100 : 120)}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={margins}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis 
          type="number" 
          domain={[0, showPercentage ? 100 : 'auto']}
          tick={{ fontSize: isMobile ? 11 : 12 }}
          height={20}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          tick={{ fontSize: isMobile ? 11 : 14, fontWeight: 500 }} 
          width={isMobile ? 40 : 70}
        />
        <Tooltip content={(props: any) => <ChartTooltip {...props} showPercentage={showPercentage} />} />
        <Legend 
          verticalAlign="top" 
          height={30}
          iconSize={isMobile ? 8 : 12}
          wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }}
          formatter={(value) => {
            return <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#666' }}>{value}</span>;
          }}
        />
        <Bar 
          dataKey={showPercentage ? "percentage" : "Recipe"} 
          name={showPercentage ? "% of Daily Target" : "Recipe"}
          fill="#9b87f5" 
          radius={[0, 4, 4, 0]}
          barSize={showPercentage ? (isMobile ? 14 : 20) : (isMobile ? 16 : 24)}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.fill} 
              aria-label={`${entry.name}: ${showPercentage ? entry.percentage : entry.Recipe}%`}
            />
          ))}
          <LabelList
            dataKey={showPercentage ? "percentage" : "Recipe"}
            position="right"
            formatter={formatLabelValue}
            style={{ 
              fontSize: isMobile ? '9px' : '12px', 
              fontWeight: 500,
              fill: '#444',
            }}
          />
        </Bar>
        {!showPercentage && (
          <Bar 
            dataKey="Target" 
            fill="#D3E4FD" 
            radius={[0, 4, 4, 0]}
            barSize={isMobile ? 16 : 24}
            name="Daily Target"
          >
            <LabelList
              dataKey="Target"
              position="right"
              formatter={formatLabelValue}
              style={{ 
                fontSize: isMobile ? '9px' : '12px',
                fontWeight: 500,
                fill: '#666',
              }}
            />
          </Bar>
        )}
        {showPercentage && (
          <ReferenceLine 
            x={100} 
            stroke="#F97316" 
            strokeWidth={2} 
            strokeDasharray="3 3"
            label={{ 
              value: isMobile && window.innerWidth < 400 ? "100%" : "Target (100%)", 
              position: 'right', 
              fontSize: isMobile ? 9 : 12,
              fill: '#F97316',
              fontWeight: 600
            }} 
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
