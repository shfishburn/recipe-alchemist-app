
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
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
}

export function MacroDistributionPie({ data, title }: MacroDistributionPieProps) {
  const isMobile = useIsMobile();
  
  const enhancedData = data.map(item => ({
    ...item,
    // Add additional properties for enhanced tooltips
    tooltip: getTooltipText(item.name)
  }));
  
  const renderCustomizedLabel = ({ name, value, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={isMobile ? 11 : 13}
        fontWeight="bold"
      >
        {`${value}%`}
      </text>
    );
  };

  // Custom tooltip content
  const customTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-3 border rounded-md shadow-md text-xs">
        <p className="font-medium mb-1 text-sm" style={{ color: data.fill }}>{data.name}</p>
        <p className="mb-0.5">
          <span className="font-semibold">{data.value}%</span> of total
        </p>
        {data.actualValue !== undefined && (
          <p className="mb-0.5">
            <span className="font-semibold">{data.actualValue}{data.unit || 'g'}</span>
          </p>
        )}
        {data.tooltip && (
          <p className="mt-1 text-gray-500">{data.tooltip}</p>
        )}
      </div>
    );
  };
  
  // Enhanced legend formatter with actual values if available
  const customLegendFormatter = (value: string, entry: any) => {
    const actualValue = entry.payload.actualValue;
    const unit = entry.payload.unit || '';
    
    return (
      <span className="text-xs">
        {value}: <span className="font-medium">{entry.payload.value}%</span>
        {actualValue !== undefined && ` (${actualValue}${unit})`}
      </span>
    );
  };
  
  function getTooltipText(macroName: string): string {
    switch(macroName.toLowerCase()) {
      case 'protein':
        return 'Important for muscle maintenance and growth (4 cal/g)';
      case 'carbs':
        return 'Primary energy source for your body (4 cal/g)';
      case 'fat':
        return 'Essential for hormone production and nutrient absorption (9 cal/g)';
      default:
        return '';
    }
  }
  
  return (
    <div className={isMobile ? "h-44" : "h-52"}>
      <h5 className="text-xs font-medium text-center mb-2">
        {title}
      </h5>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={enhancedData}
            cx="50%"
            cy="45%"
            labelLine={false}
            outerRadius={isMobile ? 55 : 65}
            innerRadius={isMobile ? 25 : 30}
            dataKey="value"
            label={renderCustomizedLabel}
            strokeWidth={1}
            stroke="#ffffff"
          >
            {enhancedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend 
            layout="horizontal"
            verticalAlign="bottom" 
            align="center"
            formatter={customLegendFormatter}
            wrapperStyle={isMobile ? { fontSize: '10px', paddingTop: '10px', maxWidth: '100%' } : { paddingTop: '15px' }}
          />
          <Tooltip content={customTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
