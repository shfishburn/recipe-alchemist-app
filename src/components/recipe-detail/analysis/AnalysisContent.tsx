
import React from 'react';
import { AnalysisSection } from './AnalysisSection';
import { StepReactionItem } from './StepReactionItem';
import { ReactionsList } from './ReactionsList';
import { Button } from '@/components/ui/button';
import { RefreshCcw, FlaskRound, Beaker, Wrench } from 'lucide-react';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface AnalysisContentProps {
  chemistry: string | null;
  techniques: string | null;
  troubleshooting: string | null;
  rawResponse: string | null;
  stepReactions: StepReaction[];
  onRegenerate?: () => void;
}

export function AnalysisContent({
  chemistry,
  techniques,
  troubleshooting,
  rawResponse,
  stepReactions,
  onRegenerate
}: AnalysisContentProps) {
  // Check if we have any detailed data to display
  const hasStructuredData = chemistry || techniques || troubleshooting;
  
  // Group step reactions by major cooking methods
  const groupedReactions = React.useMemo(() => {
    const groups: Record<string, StepReaction[]> = {};
    
    if (!stepReactions || !Array.isArray(stepReactions)) return groups;
    
    stepReactions.forEach(reaction => {
      if (reaction && reaction.cooking_method) {
        const method = reaction.cooking_method;
        if (!groups[method]) {
          groups[method] = [];
        }
        groups[method].push(reaction);
      }
    });
    
    return groups;
  }, [stepReactions]);
  
  return (
    <div className="space-y-6">
      {/* Chemistry Content */}
      {chemistry && (
        <AnalysisSection 
          title="Chemistry" 
          content={chemistry} 
          icon={<FlaskRound className="h-5 w-5 text-blue-600" />}
        />
      )}
      
      {/* Techniques Content */}
      {techniques && (
        <AnalysisSection 
          title="Techniques" 
          content={techniques} 
          icon={<Beaker className="h-5 w-5 text-indigo-600" />}
        />
      )}
      
      {/* Troubleshooting Content */}
      {troubleshooting && (
        <AnalysisSection 
          title="Common Issues & Solutions" 
          content={troubleshooting} 
          icon={<Wrench className="h-5 w-5 text-amber-600" />}
        />
      )}
      
      {/* Raw Response Fallback */}
      {!hasStructuredData && rawResponse && (
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-line">{rawResponse}</p>
        </div>
      )}

      {/* Step Reactions */}
      {stepReactions && stepReactions.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Step-by-Step Reactions</h3>
          <div className="space-y-3">
            {stepReactions.map((reaction, idx) => (
              <StepReactionItem key={idx} reaction={reaction} index={idx} />
            ))}
          </div>
        </div>
      )}
      
      {/* Grouped Reactions by Cooking Method */}
      {Object.keys(groupedReactions).length > 0 && (
        <div className="space-y-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium">Reactions by Cooking Method</h3>
          <div className="space-y-6">
            {Object.entries(groupedReactions).map(([method, reactions]) => (
              <div key={method} className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">{method}</h4>
                <ReactionsList stepReactions={reactions} />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Regenerate Button (at the bottom) */}
      {onRegenerate && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={onRegenerate}
            className="flex items-center gap-1 text-sm"
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1" />
            Regenerate Analysis
          </Button>
        </div>
      )}
    </div>
  );
}
