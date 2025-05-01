
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
  // Map types to icons
  const getIcon = () => {
    switch(type) {
      case 'protein':
        return <Dumbbell className="h-4 w-4 text-white" />;
      case 'carbs':
        return <Apple className="h-4 w-4 text-white" />;
      case 'fat':
        return <Droplets className="h-4 w-4 text-white" />;
      case 'fiber':
        return <Circle className="h-4 w-4 text-white" />;
      default:
        return <Circle className="h-4 w-4 text-white" />;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div 
        className="p-1.5 rounded-full flex items-center justify-center" 
        style={{ backgroundColor: NUTRITION_COLORS[type] }}
      >
        {getIcon()}
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <div className="flex items-center space-x-2">
          <p className="text-sm">{value}</p>
          <p className="text-xs text-muted-foreground">{percentage}% DV</p>
        </div>
      </div>
    </div>
  );
}
