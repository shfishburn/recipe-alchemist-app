
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Beaker } from "lucide-react";
import { ReactionsList } from "./ReactionsList";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface AnalysisContentProps {
  chemistry?: string[];
  techniques?: string[];
  troubleshooting?: string[];
  rawResponse?: string | null;
  stepReactions?: any[] | null;
  onRegenerate?: (() => void) | null;
}

export function AnalysisContent({ 
  chemistry = [], 
  techniques = [],
  troubleshooting = [],
  rawResponse = null,
  stepReactions = null,
  onRegenerate = null
}: AnalysisContentProps) {
  const [showRaw, setShowRaw] = useState(false);
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="chemistry">
        <TabsList className="mb-2">
          <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
          <TabsTrigger value="techniques">Techniques</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="reactions">Step Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chemistry" className="space-y-2">
          {chemistry.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {chemistry.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">No chemistry analysis available yet.</p>
          )}
        </TabsContent>
        
        <TabsContent value="techniques" className="space-y-2">
          {techniques.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {techniques.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">No technique analysis available yet.</p>
          )}
        </TabsContent>
        
        <TabsContent value="troubleshooting" className="space-y-2">
          {troubleshooting.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {troubleshooting.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">No troubleshooting tips available yet.</p>
          )}
        </TabsContent>
        
        <TabsContent value="reactions" className="space-y-2">
          {stepReactions && stepReactions.length > 0 ? (
            <ReactionsList reactions={stepReactions} />
          ) : (
            <p className="text-muted-foreground italic">No step-by-step analysis available yet.</p>
          )}
        </TabsContent>
      </Tabs>
      
      {rawResponse && (
        <Collapsible className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground flex items-center">
              <Beaker className="h-4 w-4 mr-1" />
              Advanced details
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                {showRaw ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
            <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-96">
              {rawResponse}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
