
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { NUTRITION_COLORS } from '@/constants/nutrition';
import { useIsMobile } from '@/hooks/use-mobile';

interface MacroChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  titleId?: string; // ID of heading element for aria-labelledby
}

export function MacroChart({ 
  data, 
  height = 220, 
  showLegend = true, 
  showTooltip = true, 
  titleId 
}: MacroChartProps) {
  const isMobile = useIsMobile();
  
  // Calculate responsive dimensions
  const outerRadius = isMobile ? 70 : 80;
  const innerRadius = outerRadius * 0.6;
  
  // Custom label rendering function
  const renderCustomizedLabel = ({ name, value, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Hide labels on very small screens
    if (isMobile && window.innerWidth < 350) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-[13px] font-semibold"
      >
        {`${value}%`}
      </text>
    );
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-2 border rounded-md shadow-md text-xs">
        <p className="font-medium mb-1" style={{ color: data.color }}>{data.name}</p>
        <p><span className="font-semibold">{data.value}%</span> of daily intake</p>
        {data.name === 'Protein' && <p className="mt-1 text-[10px] text-gray-500">4 calories per gram</p>}
        {data.name === 'Carbs' && <p className="mt-1 text-[10px] text-gray-500">4 calories per gram</p>}
        {data.name === 'Fat' && <p className="mt-1 text-[10px] text-gray-500">9 calories per gram</p>}
      </div>
    );
  };

  // Custom legend formatter
  const customLegendFormatter = (value: string, entry: any) => {
    return <span className="text-xs">{value}: <strong>{entry.payload.value}%</strong></span>;
  };

  // Create a descriptive title for the chart for screen readers
  const chartDescription = data.map(d => `${d.name}: ${d.value}%`).join(', ');

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart 
          role="img" 
          aria-labelledby={titleId} 
          aria-description={chartDescription}
        >
          {titleId && (
            <title id={`${titleId}-desc`}>{chartDescription}</title>
          )}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            dataKey="value"
            label={renderCustomizedLabel}
            strokeWidth={1}
            stroke="#ffffff"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                aria-label={`${entry.name}: ${entry.value}%`}
              />
            ))}
          </Pie>
          
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          
          {showLegend && (
            <Legend 
              formatter={customLegendFormatter}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ 
                paddingTop: '10px',
                fontSize: '12px'
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
