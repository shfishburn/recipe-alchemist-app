
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ChatProcessingIndicatorProps {
  stage: 'sending' | 'analyzing' | 'applying';
  className?: string;
}

export function ChatProcessingIndicator({ stage, className }: ChatProcessingIndicatorProps) {
  const messages = {
    sending: 'Sending message...',
    analyzing: 'Chef is thinking...',
    applying: 'Applying improvements...'
  };

  return (
    <div className={`flex items-center gap-2 text-sm text-muted-foreground bg-white/70 px-3 py-2 rounded-md ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="animate-pulse">{messages[stage]}</span>
    </div>
  );
}
