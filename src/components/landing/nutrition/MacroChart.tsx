
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
}

export function MacroChart({ data, height = 150, showLegend = true, showTooltip = true }: MacroChartProps) {
  const isMobile = useIsMobile();
  
  // Calculate responsive dimensions
  const outerRadius = isMobile ? 45 : 55;
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
        className="text-[10px] font-semibold"
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
      </div>
    );
  };

  // Custom legend formatter for more compact display
  const customLegendFormatter = (value: string, entry: any) => {
    return <span className="text-[10px]">{`${value}: ${entry.payload.value}%`}</span>;
  };

  const chartHeight = isMobile ? Math.min(height, 120) : height;

  return (
    <div className="w-full" style={{ height: `${chartHeight}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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
                fontSize: '10px',
                paddingTop: '0px'
              }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
