
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

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
  return (
    <div className="h-40">
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
            outerRadius={60}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
