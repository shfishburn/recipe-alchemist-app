
import React from 'react';
import { MessageCircleQuestion } from 'lucide-react';

export function EmptyChatState() {
  return (
    <div className="text-center py-4 sm:py-8 bg-white/60 rounded-lg border border-slate-100 shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <MessageCircleQuestion className="h-8 w-8 text-primary/40" />
        <p className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-4">
          Ask for cooking techniques, scientific insights, or modifications!
          You can also upload a recipe image or paste a URL.
        </p>
      </div>
    </div>
  );
}
