
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { CookingStep } from '../cooking/CookingStep';
import { StepReaction, getStepReaction } from './useStepReactions';
import { ScienceNote } from './ScienceNote';

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
  
  const toggleNotes = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedNotes(prev => !prev);
  };
  
  return (
    <li key={index} className="group">
      <CookingStep
        stepNumber={index + 1}
        instruction={step}
        isCompleted={isCompleted}
        onToggleComplete={() => toggleStep(index)}
        hasScience={hasReactions}
        onToggleScience={toggleNotes}
        showingScience={expandedNotes}
      />
      
      {/* Science note content */}
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
