
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ShoppingListProgressProps {
  completedCount: number;
  totalItems: number;
  completionPercentage: number;
}

export function ShoppingListProgress({ completedCount, totalItems, completionPercentage }: ShoppingListProgressProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-muted-foreground">
          {completedCount} of {totalItems} items ({completionPercentage}%)
        </span>
      </div>
      <Progress 
        value={completionPercentage} 
        indicatorClassName={
          completionPercentage === 100 
            ? "bg-green-500" 
            : completionPercentage > 50 
              ? "bg-recipe-blue" 
              : undefined
        }
      />
    </div>
  );
}
