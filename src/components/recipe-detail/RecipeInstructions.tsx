
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, ChevronDown, ChevronUp, Atom } from 'lucide-react';
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
  confidence: number;
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
  
  const toggleNotes = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
  
  // Format reaction names for better display
  const formatReactionName = (reaction: string): string => {
    return reaction
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
                        onClick={() => toggleStep(index)}
                        className={`flex flex-col gap-2 p-3 rounded-md transition-colors cursor-pointer ${
                          completedSteps[index] 
                            ? "bg-green-50 hover:bg-green-100" 
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start">
                          {/* Small, compact step number */}
                          <span 
                            className="flex-shrink-0 mr-3 font-medium text-muted-foreground"
                          >
                            {index + 1}.
                          </span>
                          
                          {/* Main instruction content */}
                          <div className="flex-1">
                            <p className={`leading-relaxed ${completedSteps[index] ? "line-through text-muted-foreground" : ""}`}>
                              {renderInstructionWithBoldIngredients(step)}
                            </p>
                            
                            {/* Show reaction tags inline */}
                            {hasReactions && !expandedNotes[index] && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {stepReaction.reactions.slice(0, 2).map((type, i) => (
                                  <span 
                                    key={i} 
                                    className="inline-flex items-center text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                                  >
                                    <Atom className="h-3 w-3 mr-1" />
                                    {formatReactionName(type)}
                                  </span>
                                ))}
                                {stepReaction.reactions.length > 2 && (
                                  <span className="text-xs text-blue-600">
                                    +{stepReaction.reactions.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Science button - only if has reactions */}
                          {hasReactions && (
                            <Button
                              onClick={(e) => toggleNotes(index, e)} 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7 ml-2 flex-shrink-0"
                              title={expandedNotes[index] ? "Hide Science" : "View Science"}
                            >
                              <Atom className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                        </div>
                        
                        {/* Science note content */}
                        {hasReactions && expandedNotes[index] && (
                          <div className="ml-8 mt-1 p-3 bg-blue-50 rounded-md">
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
                                      {formatReactionName(type)}
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
