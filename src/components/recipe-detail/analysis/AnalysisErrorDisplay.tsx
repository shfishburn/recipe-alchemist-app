
import React, { memo } from 'react';
import { CardWrapper } from "@/components/ui/card-wrapper";
import { ErrorDisplay } from '@/components/ui/error-display';
import { AlertTriangle } from 'lucide-react';

interface AnalysisErrorDisplayProps {
  error: Error | string;
  onRetry: () => void;
  className?: string;
}

export const AnalysisErrorDisplay = memo(function AnalysisErrorDisplay({ 
  error, 
  onRetry,
  className 
}: AnalysisErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <CardWrapper className={className}>
      <ErrorDisplay
        error={errorMessage}
        title="Failed to analyze recipe"
        onRetry={onRetry}
      />
    </CardWrapper>
  );
});
