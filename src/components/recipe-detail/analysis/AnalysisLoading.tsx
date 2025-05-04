
import React from 'react';
import { Loader2 } from "lucide-react";

export function AnalysisLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <span className="ml-2 text-muted-foreground">Analyzing recipe chemistry...</span>
    </div>
  );
}
