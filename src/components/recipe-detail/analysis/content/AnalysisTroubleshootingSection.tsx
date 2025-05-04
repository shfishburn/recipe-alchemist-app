
import React from 'react';
import { AnalysisSection } from '../AnalysisSection';
import { TroubleshootingIcon } from '../icons/AnalysisIcons';

interface AnalysisTroubleshootingSectionProps {
  troubleshooting: string | null;
}

export function AnalysisTroubleshootingSection({ troubleshooting }: AnalysisTroubleshootingSectionProps) {
  if (!troubleshooting) return null;
  
  return (
    <AnalysisSection
      title="Troubleshooting Guide"
      content={troubleshooting}
      icon={<TroubleshootingIcon />}
      bgClass="bg-green-50/50"
      borderClass="border-green-100"
    />
  );
}
