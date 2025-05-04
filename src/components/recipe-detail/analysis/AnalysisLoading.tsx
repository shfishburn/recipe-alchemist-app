
import React from 'react';
import { BeakerIcon } from 'lucide-react';

export function AnalysisLoading() {
  return (
    <div className="p-8 text-center">
      <div className="animate-pulse">
        <BeakerIcon className="h-16 w-16 mx-auto mb-6 text-blue-500 opacity-70" />
      </div>
      <h3 className="text-xl font-medium mb-2">Analyzing Recipe</h3>
      <p className="text-muted-foreground">
        Discovering the science of flavors and techniques...
      </p>
    </div>
  );
}
