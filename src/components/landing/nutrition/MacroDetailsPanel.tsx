
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
    <div className="w-full space-y-3">
      <p className="text-center text-sm md:text-base">{description}</p>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg w-full">
        <ul className="space-y-2 w-full">
          {data.map((item, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="font-semibold text-sm">{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
