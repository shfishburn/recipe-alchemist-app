
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatProcessingIndicatorProps {
  stage: 'sending' | 'analyzing' | 'applying';
  className?: string;
}

export function ChatProcessingIndicator({ stage, className }: ChatProcessingIndicatorProps) {
  const isMobile = useIsMobile();
  
  const messages = {
    sending: 'Sending message...',
    analyzing: 'Chef is thinking...',
    applying: 'Applying improvements...'
  };

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground rounded-md border border-border/50 bg-white/70 px-2 py-1 sm:px-3 sm:py-2 shadow-sm ${className}`}>
      <Loader2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} animate-spin text-primary`} />
      <span className="animate-pulse">{messages[stage]}</span>
    </div>
  );
}
