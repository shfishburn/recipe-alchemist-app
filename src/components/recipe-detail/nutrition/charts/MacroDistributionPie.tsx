
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
  
  const renderCustomizedLabel = ({ name, value }: { name: string; value: number }) => {
    return isMobile ? `${value}%` : `${name}: ${value}%`;
  };
  
  return (
    <div className={isMobile ? "h-32" : "h-40"}>
      <p className="text-xs text-muted-foreground mb-2 text-center">
        {title}
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={isMobile ? 45 : 60}
            dataKey="value"
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend wrapperStyle={isMobile ? { fontSize: '10px' } : undefined} />
          <Tooltip content={(props) => <ChartTooltip {...props} showPercentage={true} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
