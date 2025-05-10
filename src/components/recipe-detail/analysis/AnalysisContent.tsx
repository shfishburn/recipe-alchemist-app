
import React, { useState } from 'react';
import { AnalysisSection } from './AnalysisSection';
import { StepReactionItem } from './StepReactionItem';
import { ReactionsList } from './ReactionsList';
import { Button } from '@/components/ui/button';
import { RefreshCcw, FlaskRound, Beaker, Wrench, Bug } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
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
  const [showDebug, setShowDebug] = useState(false);
  
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

  // Function to copy JSON to clipboard
  const copyJsonToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      .then(() => {
        alert('JSON copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy JSON:', err);
      });
  };
  
  return (
    <div className="space-y-6">
      {/* JSON Debug Button */}
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1 text-xs"
            >
              <Bug className="h-3.5 w-3.5 mr-1" />
              Show Debug Data
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Analysis Debug Data</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyJsonToClipboard({
                    rawResponse,
                    stepReactions,
                    hasStructuredData
                  })}
                >
                  Copy JSON
                </Button>
              </div>
              
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Raw Response
                    <span className="text-xs text-muted-foreground">Click to toggle</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 mt-2 bg-slate-50 dark:bg-slate-900 rounded-md overflow-auto max-h-[400px]">
                    <pre className="text-xs whitespace-pre-wrap">{rawResponse || "No raw response data"}</pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Step Reactions Data
                    <span className="text-xs text-muted-foreground">Click to toggle</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 mt-2 bg-slate-50 dark:bg-slate-900 rounded-md overflow-auto max-h-[400px]">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(stepReactions, null, 2) || "No step reactions data"}</pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

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

      {/* Debug section for small screen - collapsible */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-xs text-muted-foreground hover:text-foreground p-1 w-full"
            onClick={() => setShowDebug(!showDebug)}
          >
            <Bug className="h-3 w-3 mr-1" />
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4 border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Analysis JSON Data</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => copyJsonToClipboard({
                  rawResponse,
                  stepReactions,
                  hasStructuredData
                })}
              >
                Copy JSON
              </Button>
            </div>
            <Separator className="my-2" />
            <div className="text-xs text-muted-foreground mt-2">
              <p><strong>Data Points:</strong></p>
              <ul className="list-disc pl-5 mt-1">
                <li>Raw response length: {rawResponse?.length || 0} chars</li>
                <li>Steps with reactions: {stepReactions?.length || 0}</li>
                <li>Chemistry data: {chemistry ? 'Yes' : 'No'}</li>
                <li>Techniques data: {techniques ? 'Yes' : 'No'}</li>
                <li>Troubleshooting data: {troubleshooting ? 'Yes' : 'No'}</li>
              </ul>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
