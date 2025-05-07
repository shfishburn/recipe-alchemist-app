
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full flex flex-col">
      <p className="text-center text-xs">{description}</p>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg w-full mt-1">
        <ul className="w-full">
          {data.map((item, i) => (
            <li key={i} className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-1">
                <span 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className={isMobile ? "text-[10px]" : "text-xs"}>{item.name}</span>
              </div>
              <span className={`font-semibold ${isMobile ? "text-[10px]" : "text-xs"}`}>{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
