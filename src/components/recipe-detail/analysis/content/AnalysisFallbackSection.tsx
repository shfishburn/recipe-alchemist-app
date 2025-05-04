
import React from 'react';
import { FormattedText } from '@/components/recipe-chat/response/FormattedText';

interface AnalysisFallbackSectionProps {
  rawResponse: string | null;
  hasOtherContent: boolean;
}

export function AnalysisFallbackSection({ rawResponse, hasOtherContent }: AnalysisFallbackSectionProps) {
  // Only show fallback if there's content and no other sections are displayed
  if (!rawResponse || hasOtherContent || rawResponse.length < 50) return null;
  
  return (
    <div className="prose prose-sm max-w-none bg-blue-50/50 p-4 rounded-lg border border-blue-100">
      <FormattedText text={rawResponse} preserveWhitespace={true} className="scientific-content" />
    </div>
  );
}
