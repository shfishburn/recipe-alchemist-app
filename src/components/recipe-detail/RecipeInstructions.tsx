
import React, { memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { InstructionStep } from './instructions/InstructionStep';
import { useStepCompletion } from './instructions/useStepCompletion';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import type { RecipeStep } from '@/types/recipe-steps';

interface RecipeInstructionsProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const RecipeInstructions = memo(function RecipeInstructions({ 
  recipe, 
  isOpen, 
  onToggle,
  className
}: RecipeInstructionsProps) {
  const { toggleStep, isStepCompleted } = useStepCompletion();
  const { stepReactions, scienceNotes } = useRecipeScience(recipe);
  
  // Memoize hasInstructions check to prevent unnecessary evaluations
  const hasInstructions = useMemo(() => 
    recipe.instructions && recipe.instructions.length > 0, 
    [recipe.instructions]
  );
  
  // Convert raw instruction strings to proper RecipeStep objects
  const formattedInstructions = useMemo(() => {
    if (!recipe.instructions) return [];
    
    return recipe.instructions.map((text, index) => {
      const stepReaction = stepReactions?.find(r => r.step_index === index);
      
      // Find any science notes that might relate to this step
      // This is a simple matching strategy - can be improved with more sophisticated matching
      let relevantNotes = [];
      if (scienceNotes && scienceNotes.length > 0) {
        // Try to find notes that mention keywords from this step
        const keywords = text.toLowerCase().split(' ')
          .filter(word => word.length > 4)
          .map(word => word.replace(/[^\w]/g, ''));
          
        relevantNotes = scienceNotes.filter(note => {
          const noteLower = note.toLowerCase();
          return keywords.some(keyword => noteLower.includes(keyword));
        });
      }
      
      return {
        text,
        index,
        isCompleted: isStepCompleted(index),
        reaction: stepReaction || null,
        category: stepReaction?.cooking_method,
        scienceNotes: relevantNotes
      };
    });
  }, [recipe.instructions, stepReactions, isStepCompleted, scienceNotes]);
  
  // Memoize the instructions rendering for better performance
  const instructionsList = useMemo(() => {
    if (!hasInstructions) return null;
    
    return formattedInstructions.map((step, index) => {
      const isLastStep = index === formattedInstructions.length - 1;
      
      return (
        <InstructionStep
          key={index}
          step={step}
          isLastStep={isLastStep}
          toggleStep={toggleStep}
        />
      );
    });
  }, [hasInstructions, formattedInstructions, toggleStep]);
  
  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-recipe-blue" />
              Instructions
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hw-accelerated">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Toggle instructions</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {hasInstructions ? (
              <ol className="space-y-4">
                {instructionsList}
              </ol>
            ) : (
              <p className="text-muted-foreground">No instructions available</p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
});
