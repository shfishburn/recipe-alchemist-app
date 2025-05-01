
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface MacroBreakdownProps {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroBreakdown({ protein, carbs, fat }: MacroBreakdownProps) {
  // Calculate total to ensure percentages add up to 100%
  const total = protein + carbs + fat;
  const proteinPercent = Math.round((protein / total) * 100);
  const carbsPercent = Math.round((carbs / total) * 100);
  const fatPercent = Math.round((fat / total) * 100);

  return (
    <div className="space-y-4">
      <h5 className="text-xs font-medium mb-2">Macro Distribution</h5>
      
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div 
          className="bg-purple-500 h-full" 
          style={{ width: `${proteinPercent}%` }}
          title={`Protein: ${proteinPercent}%`}
        />
        <div 
          className="bg-blue-500 h-full" 
          style={{ width: `${carbsPercent}%` }}
          title={`Carbs: ${carbsPercent}%`}
        />
        <div 
          className="bg-green-500 h-full" 
          style={{ width: `${fatPercent}%` }}
          title={`Fat: ${fatPercent}%`}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1.5"></div>
            <span className="font-medium">Protein</span>
          </div>
          <span className="text-muted-foreground">{proteinPercent}%</span>
        </div>
        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
            <span className="font-medium">Carbs</span>
          </div>
          <span className="text-muted-foreground">{carbsPercent}%</span>
        </div>
        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
            <span className="font-medium">Fat</span>
          </div>
          <span className="text-muted-foreground">{fatPercent}%</span>
        </div>
      </div>
    </div>
  );
}
