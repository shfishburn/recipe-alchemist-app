
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalysisChemistrySection } from './AnalysisChemistrySection';
import { AnalysisTechniquesSection } from './AnalysisTechniquesSection';
import { AnalysisTroubleshootingSection } from './AnalysisTroubleshootingSection';
import { AnalysisFallbackSection } from './AnalysisFallbackSection';
import { ReactionsList } from '../reactions/ReactionsList';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface AnalysisContentProps {
  chemistry: string | null;
  techniques: string | null;
  troubleshooting: string | null;
  rawResponse: string | null;
  stepReactions: StepReaction[];
}

export function AnalysisContent({ 
  chemistry, 
  techniques, 
  troubleshooting,
  rawResponse,
  stepReactions
}: AnalysisContentProps) {
  // Check if there's any content to display
  const hasChemistry = chemistry !== null && chemistry.length > 0;
  const hasTechniques = techniques !== null && techniques.length > 0;
  const hasTroubleshooting = troubleshooting !== null && troubleshooting.length > 0;
  const hasOtherContent = hasChemistry || hasTechniques || hasTroubleshooting ||
    (stepReactions && stepReactions.length > 0);
    
  return (
    <ScrollArea className="h-[60vh] sm:h-[70vh] pr-4">
      <div className="space-y-6">
        {/* Chemistry Section */}
        <AnalysisChemistrySection chemistry={chemistry} />
        
        {/* Techniques Section */}
        <AnalysisTechniquesSection techniques={techniques} />
        
        {/* Troubleshooting Section */}
        <AnalysisTroubleshootingSection troubleshooting={troubleshooting} />
        
        {/* Reaction Analysis Section */}
        <ReactionsList stepReactions={stepReactions} />
        
        {/* Fallback Section */}
        <AnalysisFallbackSection 
          rawResponse={rawResponse} 
          hasOtherContent={hasOtherContent}
        />
      </div>
    </ScrollArea>
  );
}
