
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormattedText } from '@/components/recipe-chat/response/FormattedText';
import { AnalysisSection } from './AnalysisSection';
import { ReactionsList } from './ReactionsList';
import { GlobalAnalysis } from './GlobalAnalysis';
import { ChemistryIcon, TechniquesIcon, TroubleshootingIcon } from './icons/AnalysisIcons';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface AnalysisContentProps {
  chemistry: string | null;
  techniques: string | null;
  troubleshooting: string | null;
  rawResponse: string | null;
  stepReactions: StepReaction[];
  globalAnalysis?: {
    cascade_effects?: string;
    energy_systems?: string;
    scaling_considerations?: string;
    process_flow_optimization?: string;
    equipment_integration?: string;
  };
  onRegenerate?: () => void;
}

export function AnalysisContent({ 
  chemistry, 
  techniques, 
  troubleshooting,
  rawResponse,
  stepReactions,
  globalAnalysis,
  onRegenerate
}: AnalysisContentProps) {
  // Check if there's any content to display
  const hasChemistry = chemistry !== null && chemistry.length > 0;
  const hasTechniques = techniques !== null && techniques.length > 0;
  const hasTroubleshooting = troubleshooting !== null && troubleshooting.length > 0;
  const hasRawResponse = rawResponse && rawResponse.length > 50 &&
    !hasChemistry && !hasTechniques && !hasTroubleshooting;
    
  return (
    <ScrollArea className="h-[60vh] sm:h-[70vh] pr-4">
      <div className="space-y-6">
        {/* Global Analysis Section */}
        <GlobalAnalysis globalAnalysis={globalAnalysis} />
        
        {/* Chemistry Section */}
        <AnalysisSection
          title="Chemistry"
          content={chemistry}
          icon={<ChemistryIcon />}
          bgClass="bg-blue-50/50"
          borderClass="border-blue-100"
        />
        
        {/* Techniques Section */}
        <AnalysisSection
          title="Cooking Techniques"
          content={techniques}
          icon={<TechniquesIcon />}
          bgClass="bg-amber-50/50"
          borderClass="border-amber-100"
        />
        
        {/* Troubleshooting Section */}
        <AnalysisSection
          title="Troubleshooting Guide"
          content={troubleshooting}
          icon={<TroubleshootingIcon />}
          bgClass="bg-green-50/50"
          borderClass="border-green-100"
        />
        
        {/* Reaction Analysis Section */}
        <ReactionsList 
          stepReactions={stepReactions} 
          onRegenerateClick={onRegenerate}
        />
        
        {/* Fallback Section */}
        {hasRawResponse && (
          <div className="prose prose-sm max-w-none bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <FormattedText text={rawResponse} preserveWhitespace={true} className="scientific-content" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
