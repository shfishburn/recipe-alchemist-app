
import React from 'react';
import { Check, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CookingStepProps {
  stepNumber: number;
  instruction: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export function CookingStep({ stepNumber, instruction, isCompleted, onToggleComplete }: CookingStepProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Step {stepNumber}</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onToggleComplete}
        >
          {isCompleted ? (
            <Check className="h-4 w-4 mr-1" />
          ) : (
            <Square className="h-4 w-4 mr-1" />
          )}
          {isCompleted ? "Completed" : "Mark Complete"}
        </Button>
      </div>
      
      <div className="rounded-lg border p-6 bg-background mt-4">
        <p className="text-xl leading-relaxed">
          {instruction}
        </p>
      </div>
    </div>
  );
}
