
import React from 'react';

export const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);
