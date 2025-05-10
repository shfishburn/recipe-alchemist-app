
import React from 'react';

interface SimplifiedMacroLegendProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function SimplifiedMacroLegend({ data }: SimplifiedMacroLegendProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div 
            className="h-3 w-3 rounded-full mr-2" 
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <span className="text-sm font-medium mr-1">{item.name}:</span>
          <span className="text-sm font-semibold">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}
