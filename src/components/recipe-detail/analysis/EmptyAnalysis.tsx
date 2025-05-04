
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyAnalysisProps {
  onAnalyze: () => void;
}

export function EmptyAnalysis({ onAnalyze }: EmptyAnalysisProps) {
  return (
    <div className="p-8 text-center">
      <h3 className="text-lg font-medium mb-2">No Analysis Available</h3>
      <p className="text-muted-foreground mb-4">
        No analysis data was found for this recipe.
      </p>
      <Button 
        variant="outline" 
        onClick={onAnalyze}
        className="mt-2"
      >
        Generate Analysis
      </Button>
    </div>
  );
}
