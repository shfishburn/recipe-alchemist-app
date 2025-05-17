
import React from 'react';
import { cn } from '@/lib/utils';

interface IngredientItemProps {
  name: string;
  [key: string]: any;
}

interface DisplayIngredientProps {
  qty: number | string;
  unit: string;
  item: string | { name: string; [key: string]: any };
  notes?: string;
  index?: number;
  className?: string;
  isStrikeThrough?: boolean;
  isPending?: boolean;
}

export function DisplayIngredient({
  qty,
  unit,
  item,
  notes,
  className,
  isStrikeThrough = false,
  isPending = false
}: DisplayIngredientProps) {
  // Function to properly render the ingredient item
  const renderIngredientItem = () => {
    if (typeof item === 'string') {
      return item;
    } else if (item && typeof item === 'object' && 'name' in item) {
      return item.name;
    }
    return 'Unknown ingredient';
  };

  return (
    <div 
      className={cn(
        "flex items-baseline text-gray-700 dark:text-gray-300",
        isStrikeThrough && "line-through opacity-50",
        isPending && "opacity-50 italic",
        className
      )}
    >
      <div className="flex-shrink-0 min-w-[85px] font-medium">
        {qty && <span>{qty} </span>}
        {unit && <span>{unit}</span>}
      </div>
      
      <div className="ml-2">
        <span className="font-medium">{renderIngredientItem()}</span>
        {notes && <span className="text-gray-500 ml-1 text-sm">({notes})</span>}
      </div>
    </div>
  );
}
