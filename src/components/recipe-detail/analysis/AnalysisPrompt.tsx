
import React from 'react';
import { Button } from '@/components/ui/button';
import { BeakerIcon } from 'lucide-react';

interface AnalysisPromptProps {
  onAnalyze: () => void;
}

export function AnalysisPrompt({ onAnalyze }: AnalysisPromptProps) {
  return (
    <div className="p-8 text-center">
      <BeakerIcon className="h-16 w-16 mx-auto mb-6 text-blue-500 opacity-60" />
      <h3 className="text-xl font-medium mb-2">Analyze This Recipe</h3>
      <p className="text-muted-foreground mb-6">
        Discover the science behind this recipe's ingredients and techniques.
      </p>
      <Button onClick={onAnalyze} className="px-8 py-2">
        Run Analysis
      </Button>
    </div>
  );
}
