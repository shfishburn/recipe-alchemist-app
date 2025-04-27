
import React from 'react';

interface ChartTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
  showPercentage: boolean;
}

export function ChartTooltip({ active, payload, label, showPercentage }: ChartTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-200 rounded shadow-md text-xs">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-gray-800">
          Recipe: {showPercentage ? `${payload[0].payload.percentage}%` : `${payload[0].value}${label === 'Calories' ? ' kcal' : 'g'}`}
        </p>
        <p className="text-gray-600">
          Daily Target: {showPercentage ? '100%' : `${payload[1].value}${label === 'Calories' ? ' kcal' : 'g'}`}
        </p>
      </div>
    );
  }
  return null;
}
