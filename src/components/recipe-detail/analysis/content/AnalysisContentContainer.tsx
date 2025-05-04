
import React from 'react';
import { useAnalysisContent } from '@/hooks/use-analysis-content';
import { AnalysisLoading } from '../AnalysisLoading';
import { AnalysisPrompt } from '../AnalysisPrompt';
import { EmptyAnalysis } from '../EmptyAnalysis';
import { AnalysisContent } from './AnalysisContent';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface AnalysisContentContainerProps {
  analysis: any;
  isLoading: boolean;
  isAnalyzing: boolean;
  stepReactions: StepReaction[];
  scienceNotes: string[];
  hasAnalysisData: boolean;
  onAnalyze: () => void;
}

export function AnalysisContentContainer({ 
  analysis, 
  isLoading, 
  isAnalyzing,
  stepReactions,
  scienceNotes,
  hasAnalysisData,
  onAnalyze
}: AnalysisContentContainerProps) {
  // Use our hook to extract analysis content
  const { chemistry, techniques, troubleshooting, hasAnyContent } = useAnalysisContent(
    analysis,
    scienceNotes,
    stepReactions
  );

  // Check if we should show the analysis prompt
  const showAnalysisPrompt = (!analysis && !isLoading && (!stepReactions || stepReactions.length === 0) && !isAnalyzing) || 
    (!hasAnyContent && !isAnalyzing && !isLoading);

  if (isLoading || isAnalyzing) {
    return <AnalysisLoading />;
  }
  
  if (showAnalysisPrompt) {
    return <AnalysisPrompt onAnalyze={onAnalyze} />;
  }
  
  if (hasAnyContent) {
    return (
      <AnalysisContent
        chemistry={chemistry}
        techniques={techniques}
        troubleshooting={troubleshooting}
        rawResponse={analysis?.textResponse || null}
        stepReactions={stepReactions}
      />
    );
  }
  
  return <EmptyAnalysis onAnalyze={onAnalyze} />;
}
