
import React from 'react';
import { AnalysisSection } from '../AnalysisSection';
import { TechniquesIcon } from '../icons/AnalysisIcons';

interface AnalysisTechniquesSectionProps {
  techniques: string | null;
}

export function AnalysisTechniquesSection({ techniques }: AnalysisTechniquesSectionProps) {
  if (!techniques) return null;
  
  return (
    <AnalysisSection
      title="Cooking Techniques"
      content={techniques}
      icon={<TechniquesIcon />}
      bgClass="bg-amber-50/50"
      borderClass="border-amber-100"
    />
  );
}
