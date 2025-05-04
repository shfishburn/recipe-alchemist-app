
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { StepReaction } from './useStepReactions';
import { ScienceNote } from './ScienceNote';
import { StepHeader } from './StepHeader';
import { FormatIngredientText } from './FormatIngredientText';

interface InstructionStepProps {
  step: string;
  index: number;
  isCompleted: boolean;
  toggleStep: (index: number) => void;
  stepReaction: StepReaction | null;
  isLastStep: boolean;
}

export function InstructionStep({ 
  step, 
  index, 
  isCompleted, 
  toggleStep,
  stepReaction,
  isLastStep
}: InstructionStepProps) {
  const [expandedNotes, setExpandedNotes] = useState<boolean>(false);
  
  const hasReactions = stepReaction && 
                      Array.isArray(stepReaction.reactions) && 
                      stepReaction.reactions.length > 0;
  
  const toggleNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNotes(prev => !prev);
  };
  
  return (
    <li key={index} className="group">
      <div 
        onClick={() => toggleStep(index)}
        className={`flex flex-col cursor-pointer p-3 rounded-md transition-colors ${
          isCompleted ? "bg-green-50 hover:bg-green-100" : "hover:bg-muted/50"
        }`}
      >
        <StepHeader
          stepNumber={index + 1}
          isCompleted={isCompleted}
          hasScience={hasReactions}
          showingScience={expandedNotes}
          onToggleScience={toggleNotes}
        />
        
        <p className={`text-lg leading-relaxed ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
          <FormatIngredientText text={step} />
        </p>
      </div>
      
      {hasReactions && expandedNotes && (
        <ScienceNote 
          reactionDetails={stepReaction.reaction_details} 
          reactions={stepReaction.reactions} 
        />
      )}
      
      {!isLastStep && (
        <Separator className="my-4" />
      )}
    </li>
  );
}
