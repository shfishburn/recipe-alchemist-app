
import React from 'react';

interface MacroDetailsPanelProps {
  title: string;
  description: string;
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function MacroDetailsPanel({ title, description, data }: MacroDetailsPanelProps) {
  return (
    <div className="w-full space-y-2">
      <p className="text-center text-xs md:text-sm">{description}</p>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg w-full">
        <ul className="space-y-1 w-full">
          {data.map((item, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className="h-2.5 w-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="text-xs">{item.name}</span>
              </div>
              <span className="font-semibold text-xs">{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
