
import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

interface ChatProcessingIndicatorProps {
  stage?: 'sending' | 'thinking' | 'generating';
  className?: string;
}

export function ChatProcessingIndicator({ 
  stage = 'sending',
  className
}: ChatProcessingIndicatorProps) {
  let message = 'Processing...';
  
  switch (stage) {
    case 'sending':
      message = 'Sending message...';
      break;
    case 'thinking':
      message = 'Analyzing recipe...';
      break;
    case 'generating':
      message = 'Generating response...';
      break;
  }
  
  return (
    <div 
      className={cn(
        "flex items-center space-x-2 text-sm text-muted-foreground p-2", 
        className
      )}
    >
      <Spinner className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
