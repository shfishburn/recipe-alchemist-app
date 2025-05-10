
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
    <div className="flex items-center justify-between pb-3">
      <div>
        <CardTitle className="text-base sm:text-xl font-semibold flex items-center">
          <Beaker className="h-5 w-5 mr-2 text-recipe-blue" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </div>
  );
}
