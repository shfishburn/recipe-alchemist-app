
import React from 'react';
import { NUTRITION_COLORS } from '@/constants/nutrition';

interface MacroBreakdownProps {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroBreakdown({ protein, carbs, fat }: MacroBreakdownProps) {
  // Ensure all values are positive numbers
  const safeProtein = Math.max(0, protein || 0);
  const safeCarbs = Math.max(0, carbs || 0);
  const safeFat = Math.max(0, fat || 0);

  // Calculate total to ensure percentages add up to 100%
  const total = safeProtein + safeCarbs + safeFat;
  
  // If total is 0, set equal percentages to avoid NaN
  const proteinPercent = total === 0 ? 33 : Math.round((safeProtein / total) * 100);
  const carbsPercent = total === 0 ? 34 : Math.round((safeCarbs / total) * 100);
  // Ensure percentages add up to exactly 100%
  const fatPercent = total === 0 ? 33 : 100 - proteinPercent - carbsPercent;

  return (
    <div className="space-y-4">
      <h5 className="text-sm font-medium mb-2">Macro Distribution</h5>
      
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div 
          className="h-full" 
          style={{ width: `${proteinPercent}%`, backgroundColor: NUTRITION_COLORS.protein }}
          title={`Protein: ${proteinPercent}%`}
        />
        <div 
          className="h-full" 
          style={{ width: `${carbsPercent}%`, backgroundColor: NUTRITION_COLORS.carbs }}
          title={`Carbs: ${carbsPercent}%`}
        />
        <div 
          className="h-full" 
          style={{ width: `${fatPercent}%`, backgroundColor: NUTRITION_COLORS.fat }}
          title={`Fat: ${fatPercent}%`}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: NUTRITION_COLORS.protein }}></div>
            <span className="font-medium">Protein</span>
          </div>
          <span className="text-muted-foreground">{proteinPercent}%</span>
        </div>
        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: NUTRITION_COLORS.carbs }}></div>
            <span className="font-medium">Carbs</span>
          </div>
          <span className="text-muted-foreground">{carbsPercent}%</span>
        </div>
        <div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: NUTRITION_COLORS.fat }}></div>
            <span className="font-medium">Fat</span>
          </div>
          <span className="text-muted-foreground">{fatPercent}%</span>
        </div>
      </div>
    </div>
  );
}
