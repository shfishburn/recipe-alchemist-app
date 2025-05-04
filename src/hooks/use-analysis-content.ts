
import { useCallback, useMemo } from 'react';
import { useMemoize } from '@/hooks/use-memoize';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface AnalysisResponse {
  textResponse?: string;
  science_notes?: string[];
  techniques?: string[];
  troubleshooting?: string[];
  error?: string;
}

interface AnalysisContentData {
  chemistry: string | null;
  techniques: string | null;
  troubleshooting: string | null;
  hasAnyContent: boolean;
}

export function useAnalysisContent(
  analysis: AnalysisResponse | undefined,
  scienceNotes: string[],
  stepReactions: StepReaction[]
): AnalysisContentData {
  // Use memoize with caching for expensive content extraction
  const extractAnalysisContent = useMemoize((
    currentAnalysis: AnalysisResponse | undefined,
    currentScienceNotes: string[]
  ) => {
    // First check for pre-existing notes in the recipe
    const existingNotes = currentScienceNotes.length > 0;
    
    // If we don't have analysis data, fall back to recipe notes
    if (!currentAnalysis) {
      return { 
        chemistry: existingNotes ? currentScienceNotes.join('\n\n') : null,
        techniques: null,
        troubleshooting: null
      };
    }
    
    // Extract chemistry section
    const chemistry = (currentAnalysis.science_notes && Array.isArray(currentAnalysis.science_notes) && currentAnalysis.science_notes.length > 0)
      ? currentAnalysis.science_notes.join('\n\n')
      : (existingNotes ? currentScienceNotes.join('\n\n') : null);
    
    // Extract techniques section
    const techniques = (currentAnalysis.techniques && Array.isArray(currentAnalysis.techniques) && currentAnalysis.techniques.length > 0)
      ? currentAnalysis.techniques.join('\n\n')
      : null;
    
    // Extract troubleshooting section
    const troubleshooting = (currentAnalysis.troubleshooting && Array.isArray(currentAnalysis.troubleshooting) && currentAnalysis.troubleshooting.length > 0)
      ? currentAnalysis.troubleshooting.join('\n\n')
      : null;
    
    return { chemistry, techniques, troubleshooting };
  }, {
    // Cache settings
    ttl: 60000, // Cache for 1 minute
    maxSize: 10
  });

  // Get memoized content
  const content = useMemo(() => 
    extractAnalysisContent(analysis, scienceNotes), 
    [extractAnalysisContent, analysis, scienceNotes]
  );
  
  // Determine if there's any analysis content available
  const hasAnyContent = useMemo(() => 
    (content.chemistry !== null) || 
    (content.techniques !== null) || 
    (content.troubleshooting !== null) ||
    (analysis?.textResponse && analysis.textResponse.length > 50) ||
    (stepReactions && stepReactions.length > 0),
    [content, analysis?.textResponse, stepReactions]
  );

  return {
    ...content,
    hasAnyContent
  };
}
