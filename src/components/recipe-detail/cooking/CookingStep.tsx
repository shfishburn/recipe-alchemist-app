
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
  // Function to process markdown-style bold text
  const renderInstructionWithBoldIngredients = (instruction: string) => {
    // Split by bold markers
    const parts = instruction.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, i) => {
      // Check if this part is wrapped in bold markers
      if (part.startsWith('**') && part.endsWith('**')) {
        // Extract content between ** markers and render as styled ingredient
        const content = part.substring(2, part.length - 2);
        return (
          <span 
            key={i} 
            className="font-semibold text-recipe-blue bg-recipe-blue/5 px-1.5 py-0.5 rounded-md border border-recipe-blue/10"
          >
            {content}
          </span>
        );
      }
      // Return regular text
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };
  
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
          {renderInstructionWithBoldIngredients(instruction)}
        </p>
      </div>
    </div>
  );
}
