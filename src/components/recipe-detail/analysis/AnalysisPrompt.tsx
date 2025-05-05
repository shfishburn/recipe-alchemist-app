
import React from 'react';
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";

interface AnalysisPromptProps {
  onAnalyze: () => void;
}

export function AnalysisPrompt({ onAnalyze }: AnalysisPromptProps) {
  return (
    <div className="text-center py-6">
      <p className="mb-4 text-muted-foreground">
        Click the Analyze Recipe button to generate a scientific analysis of this recipe.
      </p>
      <Button onClick={onAnalyze} variant="outline">
        <Beaker className="h-5 w-5 mr-2" />
        Analyze Recipe
      </Button>
    </div>
  );
}
