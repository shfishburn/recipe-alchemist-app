
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface SimplifiedMacroChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  height?: number;
  enableLabel?: boolean;
}

export function SimplifiedMacroChart({ 
  data, 
  height = 180, 
  enableLabel = true 
}: SimplifiedMacroChartProps) {
  const isMobile = useIsMobile();
  
  // Calculate responsive dimensions
  const outerRadius = isMobile ? 70 : 80;
  const innerRadius = outerRadius * 0.6;
  
  // Custom label rendering function
  const renderCustomizedLabel = ({ name, value, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
    if (!enableLabel) return null;
    
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
        className="text-xs font-semibold"
      >
        {`${value}%`}
      </text>
    );
  };

  return (
    <div className="w-full overflow-visible" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            dataKey="value"
            label={enableLabel ? renderCustomizedLabel : undefined}
            strokeWidth={1}
            stroke="#ffffff"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
