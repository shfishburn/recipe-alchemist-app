
import React, { useState } from 'react';
import { AnalysisSection } from './AnalysisSection';
import { StepReactionItem } from './StepReactionItem';
import { ReactionsList } from './ReactionsList';
import { Button } from '@/components/ui/button';
import { FlaskRound, Beaker, Wrench, Bug, Copy } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { SimplifiedNutriScore } from '@/components/landing/nutrition/SimplifiedNutriScore';
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
        toast({
          title: 'Copied to clipboard',
          description: 'JSON data copied successfully',
          variant: 'success'
        });
      })
      .catch(err => {
        console.error('Failed to copy JSON:', err);
        toast({
          title: 'Copy failed',
          description: 'Failed to copy JSON data',
          variant: 'destructive'
        });
      });
  };
  
  // Generate analysis data for export
  const getAnalysisData = () => ({
    rawResponse,
    stepReactions,
    chemistry,
    techniques,
    troubleshooting,
    hasStructuredData
  });

  // Extract the nutri-score if present in the data
  const nutriScore = React.useMemo(() => {
    if (rawResponse && rawResponse.includes('Nutri-Score')) {
      const match = rawResponse.match(/Nutri-Score\s+([A-E])/i);
      return match ? match[1] as 'A' | 'B' | 'C' | 'D' | 'E' : null;
    }
    return null;
  }, [rawResponse]);
  
  return (
    <div className="space-y-6">
      {/* Advanced Debug Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 text-xs float-right"
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
                onClick={() => copyJsonToClipboard(getAnalysisData())}
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

      {/* Display Nutri-Score if available */}
      {nutriScore && (
        <div className="flex items-center mb-4">
          <span className="text-sm font-medium mr-2">Recipe Quality:</span>
          <SimplifiedNutriScore grade={nutriScore} size="md" showLabel={true} />
        </div>
      )}

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
      
      {/* JSON Copy Button - More Prominent Placement */}
      <div className="mt-6 p-3 border border-blue-200 rounded-md bg-blue-50 dark:border-blue-900 dark:bg-blue-900/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Recipe Analysis Data</h4>
            <p className="text-xs text-blue-600 dark:text-blue-400">Export complete analysis data as JSON</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => copyJsonToClipboard(getAnalysisData())}
            className="flex items-center gap-1 bg-white border border-blue-200 hover:bg-blue-100 text-blue-700"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy Analysis JSON
          </Button>
        </div>
      </div>
      
      {/* Removed the Regenerate Button that was at the bottom */}
    </div>
  );
}
