
import React from 'react';
import { CardWrapper } from "@/components/ui/card-wrapper";
import { ErrorDisplay } from '@/components/ui/error-display';

interface AnalysisErrorDisplayProps {
  error: Error | string;
  onRetry: () => void;
}

export function AnalysisErrorDisplay({ error, onRetry }: AnalysisErrorDisplayProps) {
  return (
    <CardWrapper>
      <ErrorDisplay
        error={error}
        title="Failed to analyze recipe"
        onRetry={onRetry}
      />
    </CardWrapper>
  );
}
