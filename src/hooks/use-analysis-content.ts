
import { useCallback } from 'react';
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
  // Extract analysis content
  const extractAnalysisContent = useCallback(() => {
    // First check for pre-existing notes in the recipe
    const existingNotes = scienceNotes.length > 0;
    
    // If we don't have analysis data, fall back to recipe notes
    if (!analysis) {
      return { 
        chemistry: existingNotes ? scienceNotes.join('\n\n') : null,
        techniques: null,
        troubleshooting: null
      };
    }
    
    // Extract chemistry section
    const chemistry = (analysis.science_notes && Array.isArray(analysis.science_notes) && analysis.science_notes.length > 0)
      ? analysis.science_notes.join('\n\n')
      : (existingNotes ? scienceNotes.join('\n\n') : null);
    
    // Extract techniques section
    const techniques = (analysis.techniques && Array.isArray(analysis.techniques) && analysis.techniques.length > 0)
      ? analysis.techniques.join('\n\n')
      : null;
    
    // Extract troubleshooting section
    const troubleshooting = (analysis.troubleshooting && Array.isArray(analysis.troubleshooting) && analysis.troubleshooting.length > 0)
      ? analysis.troubleshooting.join('\n\n')
      : null;
    
    return { chemistry, techniques, troubleshooting };
  }, [analysis, scienceNotes]);

  const { chemistry, techniques, troubleshooting } = extractAnalysisContent();
  
  // Determine if there's any analysis content available
  const hasAnyContent = 
    (chemistry !== null) || 
    (techniques !== null) || 
    (troubleshooting !== null) ||
    (analysis?.textResponse && analysis.textResponse.length > 50) ||
    (stepReactions && stepReactions.length > 0);

  return {
    chemistry,
    techniques,
    troubleshooting,
    hasAnyContent
  };
}
