
import React from 'react';

export function EmptyChatState() {
  return (
    <div className="text-center py-4 sm:py-8 bg-white/60 rounded-lg border border-slate-100 shadow-sm">
      <p className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-4">
        Ask for cooking techniques, scientific insights, or modifications!
        You can also upload a recipe image or paste a URL.
      </p>
    </div>
  );
}
