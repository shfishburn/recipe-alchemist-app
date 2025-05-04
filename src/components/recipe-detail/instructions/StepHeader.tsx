
import React from 'react';
import { Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepHeaderProps {
  stepNumber: number;
  isCompleted: boolean;
  hasScience: boolean;
  showingScience: boolean;
  onToggleScience: (e: React.MouseEvent) => void;
}

export function StepHeader({ 
  stepNumber, 
  isCompleted, 
  hasScience, 
  showingScience,
  onToggleScience 
}: StepHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className={`flex-shrink-0 mr-2 font-medium ${
        isCompleted ? "text-muted-foreground" : "text-foreground"
      }`}>
        {stepNumber}.
      </span>
      
      {/* Science button - only if has science */}
      {hasScience && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleScience}
          className="h-6 w-6 ml-auto flex-shrink-0"
          title={showingScience ? "Hide Science" : "View Science"}
        >
          <Atom className="h-4 w-4 text-blue-600" />
        </Button>
      )}
    </div>
  );
}
