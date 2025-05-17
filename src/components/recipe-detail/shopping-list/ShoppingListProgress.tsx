
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ShoppingListProgressProps {
  completedCount: number;
  totalItems: number;
  completionPercentage: number;
}

export function ShoppingListProgress({ completedCount, totalItems, completionPercentage }: ShoppingListProgressProps) {
  // Determine color based on completion percentage
  const indicatorColor = completionPercentage === 100 
    ? "#22c55e" // Green when complete
    : completionPercentage > 50 
      ? "#0EA5E9" // Blue when more than halfway
      : undefined; // Default primary color otherwise
      
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-muted-foreground">
          {completedCount} of {totalItems} items ({Math.round(completionPercentage)}%)
        </span>
      </div>
      <Progress 
        value={completionPercentage} 
        indicatorColor={indicatorColor}
      />
    </div>
  );
}
