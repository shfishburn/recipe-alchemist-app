
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, ChevronDown, ChevronUp, Check, Atom } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe } from '@/hooks/use-recipe-detail';

interface RecipeInstructionsProps {
  recipe: Recipe;
  isOpen: boolean;
  onToggle: () => void;
}

// Define reaction item type
interface StepReaction {
  step_index: number;
  step_text: string;
  reactions: string[];
  reaction_details: string[];
}

export function RecipeInstructions({ recipe, isOpen, onToggle }: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<{[key: number]: boolean}>({});
  const [expandedNotes, setExpandedNotes] = useState<{[key: number]: boolean}>({});
  
  // Fetch reaction data for this recipe
  const { data: stepReactions } = useQuery({
    queryKey: ['recipe-reactions', recipe.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('recipe_step_reactions')
          .select('*')
          .eq('recipe_id', recipe.id)
          .order('step_index', { ascending: true });
        
        if (error) {
          console.error('Error fetching recipe reactions:', error);
          return [];
        }
        
        return data as StepReaction[];
      } catch (err) {
        console.error('Error in query execution:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
  
  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const toggleNotes = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNotes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Enhanced function to process markdown-style bold ingredient text
  const renderInstructionWithBoldIngredients = (instruction: string) => {
    // Split by bold markers
    const parts = instruction.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, i) => {
      // Check if this part is wrapped in bold markers
      if (part.startsWith('**') && part.endsWith('**')) {
        // Extract content between ** markers and render as bold with special styling
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
  
  // Get step reaction based on index
  const getStepReaction = (index: number) => {
    if (!stepReactions || !Array.isArray(stepReactions)) return null;
    return stepReactions.find(reaction => reaction.step_index === index);
  };
  
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-recipe-blue" />
              Instructions
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle instructions</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {recipe.instructions && recipe.instructions.length > 0 ? (
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => {
                  const stepReaction = getStepReaction(index);
                  const hasReactions = stepReaction && 
                                      Array.isArray(stepReaction.reactions) && 
                                      stepReaction.reactions.length > 0;
                  
                  return (
                    <li key={index} className="group">
                      <div 
                        className={`flex flex-col gap-3 p-3 rounded-md transition-colors ${
                          completedSteps[index] 
                            ? "bg-green-50 hover:bg-green-100" 
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-3" onClick={() => toggleStep(index)}>
                          <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-recipe-blue/10 text-recipe-blue font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p className={`leading-relaxed ${completedSteps[index] ? "line-through text-muted-foreground" : ""}`}>
                              {renderInstructionWithBoldIngredients(step)}
                            </p>
                          </div>
                          
                          {/* Science note toggle button if reactions exist */}
                          {hasReactions && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="ml-auto flex-shrink-0 flex items-center gap-1"
                              onClick={(e) => toggleNotes(index, e)}
                            >
                              <Atom className="h-4 w-4" />
                              <span className="text-xs">
                                {expandedNotes[index] ? 'Hide Science' : 'View Science'}
                              </span>
                            </Button>
                          )}
                          
                          {completedSteps[index] && (
                            <Check className="h-5 w-5 text-green-500 ml-1" />
                          )}
                        </div>
                        
                        {/* Science note content */}
                        {hasReactions && expandedNotes[index] && (
                          <div className="ml-11 mt-1 p-3 bg-blue-50 rounded-md">
                            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                              <Atom className="h-4 w-4 mr-1" />
                              <span>Science Notes</span>
                            </h4>
                            <div className="text-sm text-blue-700 space-y-2">
                              {stepReaction?.reaction_details?.map((detail, i) => (
                                <p key={i}>{detail}</p>
                              ))}
                              {stepReaction?.reactions?.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {stepReaction.reactions.map((type, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                      {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {index < recipe.instructions.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="text-muted-foreground">No instructions available</p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
