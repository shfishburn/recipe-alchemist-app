
import React from 'react';
import { Loader } from 'lucide-react';

interface ChatProcessingIndicatorProps {
  stage: 'sending' | 'analyzing' | 'applying';
  className?: string;
}

export function ChatProcessingIndicator({ stage, className }: ChatProcessingIndicatorProps) {
  const messages = {
    sending: 'Sending message...',
    analyzing: 'Analyzing recipe...',
    applying: 'Applying improvements...'
  };

  return (
    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      <Loader className="h-4 w-4 animate-spin" />
      <span className="animate-pulse">{messages[stage]}</span>
    </div>
  );
}
