
import React from 'react';

export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: any;
  }>;
  label?: string;
  showPercentage?: boolean;
}

export function ChartTooltip({ active, payload, label, showPercentage = false }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0].payload;
  const value = payload[0].value;
  const name = data.name;
  
  return (
    <div className="bg-white p-2 border rounded shadow-sm text-xs">
      <p className="font-medium">{name}</p>
      <p>
        {showPercentage
          ? `${value}% of daily target`
          : `${value} ${name === 'Calories' ? 'kcal' : 'g'}`
        }
      </p>
      {!showPercentage && data.Target && (
        <p className="text-muted-foreground">
          Target: {data.Target} {name === 'Calories' ? 'kcal' : 'g'}
        </p>
      )}
    </div>
  );
}
