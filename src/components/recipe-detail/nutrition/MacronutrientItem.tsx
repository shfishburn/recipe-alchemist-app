
import React from 'react';
import { cn } from '@/lib/utils';
import { NUTRITION_COLORS } from '@/constants/nutrition';

interface MacronutrientItemProps {
  name: 'protein' | 'carbs' | 'fat' | 'fiber' | 'calories';
  value: number;
  percentage?: number;
  className?: string;
  showPercentage?: boolean;
  emphasize?: boolean;
}

export function MacronutrientItem({
  name,
  value,
  percentage,
  className,
  showPercentage = true,
  emphasize = false
}: MacronutrientItemProps) {
  // Use the color directly from NUTRITION_COLORS constant
  const color = NUTRITION_COLORS[name] || '#94A3B8'; // Default to slate if not found
  
  // Format the name for display
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  
  // Format the value (round to nearest integer)
  const formattedValue = Math.round(value);
  
  // Format percentage if available
  const formattedPercentage = percentage !== undefined ? `${Math.round(percentage)}%` : '';
  
  return (
    <div 
      className={cn(
        "flex items-center justify-between py-2 transition-colors",
        emphasize && "font-medium",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span 
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <span>{displayName}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{formattedValue}g</span>
        {showPercentage && percentage !== undefined && (
          <span className="text-xs text-muted-foreground">{formattedPercentage}</span>
        )}
      </div>
    </div>
  );
}
