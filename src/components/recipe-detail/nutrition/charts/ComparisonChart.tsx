
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
  Cell,
  ReferenceLine
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

  // Add percent formatter for the labels showing percentage of target
  const formatPercentage = (value: number, entry: any) => {
    if (!entry || !entry.payload) return '';
    const percentage = entry.payload.percentage;
    return `${percentage}%`;
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
          barGap={2} // Reduced from previous value for tighter grouping
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
          
          {/* Recipe amount bars */}
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
            {/* Add percentage indicator showing proportion of target met */}
            <LabelList 
              dataKey="Recipe" 
              position="insideTop"
              formatter={formatPercentage}
              style={{ 
                fontSize: isMobile ? 9 : 10, 
                fontWeight: 600, 
                fill: '#fff',
                textAnchor: 'middle'
              }}
            />
          </Bar>
          
          {/* Target amount bars */}
          <Bar 
            dataKey="Target" 
            name="Daily Target" 
            fill="#94a3b8" 
            radius={[4, 4, 0, 0]}
            maxBarSize={isMobile ? 40 : 60}
            opacity={0.7} // More transparent to create visual hierarchy
          >
            <LabelList 
              dataKey="Target" 
              position="top"
              formatter={formatAxisValue}
              style={{ fontSize: isMobile ? 10 : 11, fontWeight: 500, fill: '#666' }}
            />
          </Bar>
          
          {/* Add reference lines for recommended ranges */}
          {compareData.map((entry, index) => (
            <ReferenceLine
              key={`ref-${index}`}
              segment={[
                { x: entry.name, y: entry.Target * 0.8 },  
                { x: entry.name, y: entry.Target * 1.2 }   
              ]}
              stroke="#F97316"
              strokeWidth={2}
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
              className="reference-optimal-range"
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}
