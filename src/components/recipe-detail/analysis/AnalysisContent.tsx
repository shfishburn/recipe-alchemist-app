
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Beaker } from "lucide-react";
import { ReactionsList } from "./ReactionsList";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { FormattedText } from '@/components/recipe-chat/response/FormattedText';

interface AnalysisContentProps {
  chemistry?: string[];
  techniques?: string[];
  troubleshooting?: string[];
  rawResponse?: string | null;
  stepReactions?: any[] | null;
}

export function AnalysisContent({ 
  chemistry = [], 
  techniques = [],
  troubleshooting = [],
  rawResponse = null,
  stepReactions = null
}: AnalysisContentProps) {
  const [showRaw, setShowRaw] = useState(false);
  
  const renderList = (items: string[]) => {
    if (!items || items.length === 0) {
      return <p className="text-muted-foreground italic">No data available yet.</p>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-muted-foreground">
            <FormattedText text={item} preserveWhitespace={false} forceScientific={true} />
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="chemistry" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
          <TabsTrigger value="techniques">Techniques</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="reactions">Step Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chemistry" className="space-y-2 pt-2">
          {renderList(chemistry)}
        </TabsContent>
        
        <TabsContent value="techniques" className="space-y-2 pt-2">
          {renderList(techniques)}
        </TabsContent>
        
        <TabsContent value="troubleshooting" className="space-y-2 pt-2">
          {renderList(troubleshooting)}
        </TabsContent>
        
        <TabsContent value="reactions" className="space-y-2 pt-2">
          {stepReactions && stepReactions.length > 0 ? (
            <ReactionsList stepReactions={stepReactions} />
          ) : (
            <p className="text-muted-foreground italic">No step-by-step analysis available yet.</p>
          )}
        </TabsContent>
      </Tabs>
      
      {rawResponse && (
        <Collapsible className="mt-4 border-t border-gray-100 pt-3">
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
            <div className="bg-muted p-3 rounded-md overflow-auto max-h-96">
              <FormattedText 
                text={rawResponse} 
                preserveWhitespace={true} 
                forceScientific={true} 
                className="text-xs scientific-content"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
