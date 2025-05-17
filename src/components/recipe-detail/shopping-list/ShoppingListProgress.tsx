
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ShoppingListProgressProps {
  completedCount: number;
  totalItems: number;
  completionPercentage: number;
}

export function ShoppingListProgress({ completedCount, totalItems, completionPercentage = 0 }: ShoppingListProgressProps) {
  // Ensure percentage is a valid number
  const safePercentage = typeof completionPercentage === 'number' && !isNaN(completionPercentage) 
    ? Math.max(0, Math.min(100, completionPercentage)) 
    : 0;
  
  // Determine color based on completion percentage
  const indicatorColor = safePercentage === 100 
    ? "#22c55e" // Green when complete
    : safePercentage > 50 
      ? "#0EA5E9" // Blue when more than halfway
      : undefined; // Default primary color otherwise
      
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm text-muted-foreground">
          {completedCount} of {totalItems} items ({Math.round(safePercentage)}%)
        </span>
      </div>
      <Progress 
        value={safePercentage} 
        indicatorColor={indicatorColor}
      />
    </div>
  );
}
