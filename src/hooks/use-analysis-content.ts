
import { useCallback, useMemo } from 'react';
import type { StepReaction } from '@/hooks/use-recipe-science';

interface AnalysisResponse {
  textResponse?: string;
  science_notes?: string[];
  techniques?: string[];
  troubleshooting?: string[];
  error?: string;
}

interface AnalysisContentData {
  chemistry: string[];
  techniques: string[];
  troubleshooting: string[];
  hasAnyContent: boolean;
}

export function useAnalysisContent(
  analysis: AnalysisResponse | undefined,
  scienceNotes: string[],
  stepReactions: StepReaction[]
): AnalysisContentData {
  // Extract analysis content with memoized callback
  const extractAnalysisContent = useCallback(() => {
    // First check for pre-existing notes in the recipe
    const existingNotes = scienceNotes && Array.isArray(scienceNotes) && scienceNotes.length > 0;
    
    // If we don't have analysis data, fall back to recipe notes
    if (!analysis) {
      return { 
        chemistry: existingNotes ? scienceNotes : [],
        techniques: [],
        troubleshooting: []
      };
    }
    
    // Extract chemistry section
    const chemistry = (analysis.science_notes && Array.isArray(analysis.science_notes) && analysis.science_notes.length > 0)
      ? analysis.science_notes
      : (existingNotes ? scienceNotes : []);
    
    // Extract techniques section
    const techniques = (analysis.techniques && Array.isArray(analysis.techniques) && analysis.techniques.length > 0)
      ? analysis.techniques
      : [];
    
    // Extract troubleshooting section
    const troubleshooting = (analysis.troubleshooting && Array.isArray(analysis.troubleshooting) && analysis.troubleshooting.length > 0)
      ? analysis.troubleshooting
      : [];
    
    return { chemistry, techniques, troubleshooting };
  }, [analysis, scienceNotes]);

  // Use memoization for the content extraction
  const { chemistry, techniques, troubleshooting } = useMemo(() => 
    extractAnalysisContent(), 
    [extractAnalysisContent]
  );
  
  // Determine if there's any analysis content available with memoization
  const hasAnyContent = useMemo(() => 
    (chemistry.length > 0) || 
    (techniques.length > 0) || 
    (troubleshooting.length > 0) ||
    (analysis?.textResponse && analysis.textResponse.length > 50) ||
    (stepReactions && stepReactions.length > 0),
    [chemistry, techniques, troubleshooting, analysis?.textResponse, stepReactions]
  );

  return {
    chemistry,
    techniques,
    troubleshooting,
    hasAnyContent
  };
}
