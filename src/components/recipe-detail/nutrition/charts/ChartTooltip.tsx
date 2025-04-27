
import React from 'react';
import { TooltipProps } from 'recharts';
import { 
  NameType, 
  ValueType 
} from 'recharts/types/component/DefaultTooltipContent';

export interface ChartTooltipProps extends TooltipProps<ValueType, NameType> {
  showPercentage?: boolean;
}

export function ChartTooltip({ active, payload, showPercentage = false }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Safely access payload data to prevent undefined errors
  const data = payload[0]?.payload;
  if (!data) {
    return null;
  }

  const value = payload[0].value;
  const name = data.name;
  
  if (!name) {
    return null;
  }
  
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
