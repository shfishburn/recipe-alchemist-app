
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { NUTRITION_COLORS } from '../blocks/personal/constants';

interface MacroData {
  name: string;
  value: number;
  fill: string;
  actualValue?: number;
  unit?: string;
}

interface MacroDistributionPieProps {
  data: MacroData[];
  title: string;
  height?: number;
}

export function MacroDistributionPie({ data, title, height = 200 }: MacroDistributionPieProps) {
  const isMobile = useIsMobile();
  
  const renderCustomizedLabel = ({ name, value, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Don't render text labels on very small devices
    if (isMobile && window.innerWidth < 350) {
      return null;
    }

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

  const customLegendFormatter = (value: string, entry: any) => {
    return (
      <span className="text-xs">
        {value}: <span className="font-medium">{entry.payload.value}%</span>
        {entry.payload.actualValue !== undefined && ` (${entry.payload.actualValue}${entry.payload.unit || 'g'})`}
      </span>
    );
  };
  
  // Calculate responsive dimensions
  const outerRadius = isMobile ? (window.innerWidth < 350 ? 60 : 70) : 85;
  const innerRadius = Math.max(outerRadius * 0.65, 40);
  
  return (
    <div style={{ height: `${height}px` }} aria-label={title} role="img">
      <h5 className="text-xs font-medium text-center mb-4 text-slate-700">
        {title}
      </h5>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            dataKey="value"
            label={renderCustomizedLabel}
            strokeWidth={1}
            stroke="#ffffff"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill}
                aria-label={`${entry.name}: ${entry.value}%`}
              />
            ))}
          </Pie>
          <Legend 
            layout="horizontal"
            verticalAlign="bottom" 
            align="center"
            formatter={customLegendFormatter}
            wrapperStyle={{ 
              paddingTop: isMobile ? '10px' : '15px',
              fontSize: '12px'
            }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 border rounded-md shadow-md text-xs">
                  <p className="font-medium mb-1" style={{ color: data.fill }}>{data.name}</p>
                  <p>
                    <span className="font-semibold">{data.value}%</span>
                    {data.actualValue !== undefined && 
                      ` (${data.actualValue}${data.unit || 'g'})`
                    }
                  </p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
