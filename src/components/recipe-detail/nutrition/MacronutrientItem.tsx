
import React from 'react';
import { NUTRITION_COLORS } from '@/constants/nutrition';
import { Dumbbell, Apple, Droplets, Circle } from 'lucide-react';

interface MacronutrientItemProps {
  type: 'protein' | 'carbs' | 'fat' | 'fiber';
  value: string;
  percentage: number;
  label: string;
}

export function MacronutrientItem({ type, value, percentage, label }: MacronutrientItemProps) {
  // Map types to icons and colors consistently
  const getIconConfig = () => {
    switch(type) {
      case 'protein':
        return { 
          icon: <Dumbbell className="h-4 w-4 text-white" aria-hidden="true" />,
          color: NUTRITION_COLORS.protein,
          ariaLabel: `Protein: ${value}, ${percentage}% of daily value`
        };
      case 'carbs':
        return { 
          icon: <Apple className="h-4 w-4 text-white" aria-hidden="true" />,
          color: NUTRITION_COLORS.carbs,
          ariaLabel: `Carbohydrates: ${value}, ${percentage}% of daily value`
        };
      case 'fat':
        return { 
          icon: <Droplets className="h-4 w-4 text-white" aria-hidden="true" />,
          color: NUTRITION_COLORS.fat,
          ariaLabel: `Fat: ${value}, ${percentage}% of daily value`
        };
      case 'fiber':
        return { 
          icon: <Circle className="h-4 w-4 text-white" aria-hidden="true" />,
          color: NUTRITION_COLORS.fiber,
          ariaLabel: `Fiber: ${value}, ${percentage}% of daily value`
        };
      default:
        return { 
          icon: <Circle className="h-4 w-4 text-white" aria-hidden="true" />,
          color: NUTRITION_COLORS.default || '#8E9196',
          ariaLabel: `${label}: ${value}, ${percentage}% of daily value`
        };
    }
  };

  const { icon, color, ariaLabel } = getIconConfig();

  return (
    <div 
      className="flex items-center space-x-3 w-full" 
      role="listitem"
      aria-label={ariaLabel}
    >
      <div 
        className="p-1.5 rounded-full flex items-center justify-center flex-shrink-0" 
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {icon}
      </div>
      
      <div className="flex-1 flex flex-col">
        <p className="text-sm font-medium line-clamp-1">{label}</p>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{percentage}% DV</p>
        </div>
      </div>
    </div>
  );
}
