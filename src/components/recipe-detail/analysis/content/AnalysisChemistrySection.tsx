
import React from 'react';
import { AnalysisSection } from '../AnalysisSection';
import { ChemistryIcon } from '../icons/AnalysisIcons';

interface AnalysisChemistrySectionProps {
  chemistry: string | null;
}

export function AnalysisChemistrySection({ chemistry }: AnalysisChemistrySectionProps) {
  if (!chemistry) return null;
  
  return (
    <AnalysisSection
      title="Chemistry"
      content={chemistry}
      icon={<ChemistryIcon />}
      bgClass="bg-blue-50/50"
      borderClass="border-blue-100"
    />
  );
}
