
import React from 'react';
import { Button } from '@/components/ui/button';
import { BeakerIcon, RefreshCcw } from 'lucide-react';

interface AnalysisHeaderProps {
  hasContent: boolean;
  isAnalyzing: boolean;
  onRegenerate: () => void;
}

export function AnalysisHeader({ 
  hasContent, 
  isAnalyzing, 
  onRegenerate 
}: AnalysisHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <BeakerIcon className="h-5 w-5 mr-2 text-recipe-blue" />
        <h3 className="text-xl font-semibold">Recipe Analysis</h3>
      </div>
      
      {hasContent && !isAnalyzing && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRegenerate}
          className="h-8 px-2"
          disabled={isAnalyzing}
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          <span className="text-xs">Regenerate</span>
        </Button>
      )}
    </div>
  );
}
