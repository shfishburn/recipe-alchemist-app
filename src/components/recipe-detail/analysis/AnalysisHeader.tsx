
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Beaker } from "lucide-react";

interface AnalysisHeaderProps {
  title?: string;
  description?: string;
  hasContent: boolean;
  isAnalyzing: boolean;
}

export function AnalysisHeader({ 
  title = "Scientific Analysis",
  description = "In-depth breakdown of cooking chemistry and techniques",
  hasContent,
  isAnalyzing
}: AnalysisHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
      <div>
        <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
          <Beaker className="h-5 w-5 mr-2 text-recipe-blue" />
          {title}
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </div>
      
      {isAnalyzing && (
        <div className="text-xs text-muted-foreground animate-pulse flex items-center">
          <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
          Analyzing...
        </div>
      )}
    </div>
  );
}
