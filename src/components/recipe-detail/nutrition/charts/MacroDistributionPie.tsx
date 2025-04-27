
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

interface MacroData {
  name: string;
  value: number;
  fill: string;
}

interface MacroDistributionPieProps {
  data: MacroData[];
  title: string;
}

export function MacroDistributionPie({ data, title }: MacroDistributionPieProps) {
  const isMobile = useIsMobile();
  
  const renderCustomizedLabel = ({ name, value, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={isMobile ? 10 : 12}
        fontWeight="bold"
      >
        {`${value}%`}
      </text>
    );
  };
  
  return (
    <div className={isMobile ? "h-40" : "h-48"}>
      <h5 className="text-xs font-medium text-muted-foreground mb-2 text-center">
        {title}
      </h5>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            outerRadius={isMobile ? 50 : 65}
            dataKey="value"
            label={renderCustomizedLabel}
            strokeWidth={1}
            stroke="#ffffff"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend 
            layout="horizontal"
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={isMobile ? { fontSize: '10px', paddingTop: '10px' } : { paddingTop: '15px' }}
            formatter={(value, entry) => (`${value}: ${entry.payload.value}%`)}
          />
          <Tooltip content={(props) => <ChartTooltip {...props} showPercentage={true} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
