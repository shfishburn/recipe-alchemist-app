
import React, { memo } from 'react';
import { ClipboardList } from 'lucide-react';

interface EmptyStepsProps {
  className?: string;
}

export const EmptySteps = memo(function EmptySteps({ className }: EmptyStepsProps) {
  return (
    <div className={`flex items-center justify-center py-4 text-muted-foreground ${className || ''}`}>
      <ClipboardList className="h-4 w-4 mr-2 opacity-70" />
      <p>No steps available</p>
    </div>
  );
});
