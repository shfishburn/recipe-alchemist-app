
import React from 'react';
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";

interface EmptyAnalysisProps {
  onAnalyze: () => void;
}

export function EmptyAnalysis({ onAnalyze }: EmptyAnalysisProps) {
  return (
    <div className="text-center py-6">
      <p className="mb-4 text-muted-foreground">No analysis data available for this recipe.</p>
      <Button onClick={onAnalyze} variant="outline">
        <Beaker className="h-5 w-5 mr-2" />
        Generate Analysis
      </Button>
    </div>
  );
}
