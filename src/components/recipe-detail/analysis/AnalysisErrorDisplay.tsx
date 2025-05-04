
import React from 'react';
import { Button } from '@/components/ui/button';

interface AnalysisErrorDisplayProps {
  error: Error;
  onRetry: () => void;
}

export function AnalysisErrorDisplay({ error, onRetry }: AnalysisErrorDisplayProps) {
  return (
    <div className="p-8 text-center">
      <h3 className="text-lg font-medium text-red-600 mb-2">Analysis Error</h3>
      <p className="text-muted-foreground mb-4">
        {error.message || "There was a problem analyzing this recipe."}
      </p>
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="mt-4"
      >
        Retry Analysis
      </Button>
    </div>
  );
}
